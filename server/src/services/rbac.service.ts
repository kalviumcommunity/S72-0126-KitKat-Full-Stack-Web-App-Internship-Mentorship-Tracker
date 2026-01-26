/**
 * Enterprise RBAC Authorization Service
 * Implements secure, scalable role-based access control with audit logging
 */

import { 
  UserRole, 
  Resource, 
  Action, 
  Permission, 
  AccessContext, 
  AuthorizationResult,
  AuditEvent,
  ResourceOwnership,
  SecurityContext
} from '../types/rbac';
import { 
  getRolePermissions, 
  OWNERSHIP_RULES, 
  SECURITY_POLICIES 
} from '../config/rbac-policies';
import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { redis } from '../lib/redis';

export class RBACService {
  private static instance: RBACService;
  
  public static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  // ============================================
  // CORE AUTHORIZATION METHODS
  // ============================================

  /**
   * Primary authorization check with full context validation
   */
  async authorize(
    context: AccessContext,
    resource: Resource,
    action: Action,
    resourceId?: string,
    securityContext?: SecurityContext
  ): Promise<AuthorizationResult> {
    const startTime = Date.now();
    const permission = `${resource}:${action}` as Permission;

    try {
      // 1. Basic permission check
      const hasBasicPermission = this.hasPermission(context.role, permission);
      if (!hasBasicPermission) {
        await this.auditAccess(context, resource, action, 'DENIED', 'Missing basic permission', securityContext);
        return {
          allowed: false,
          reason: 'Insufficient permissions',
          requiredPermissions: [permission],
          missingPermissions: [permission]
        };
      }

      // 2. Ownership and relationship validation
      if (resourceId) {
        const ownershipValid = await this.validateOwnership(context, resource, resourceId);
        if (!ownershipValid) {
          await this.auditAccess(context, resource, action, 'DENIED', 'Ownership validation failed', securityContext);
          return {
            allowed: false,
            reason: 'Access denied: resource ownership validation failed'
          };
        }
      }

      // 3. Rate limiting check
      const rateLimitValid = await this.checkRateLimit(context, securityContext);
      if (!rateLimitValid) {
        await this.auditAccess(context, resource, action, 'DENIED', 'Rate limit exceeded', securityContext);
        return {
          allowed: false,
          reason: 'Rate limit exceeded'
        };
      }

      // 4. Security context validation
      if (securityContext) {
        const securityValid = await this.validateSecurityContext(context, securityContext);
        if (!securityValid) {
          await this.auditAccess(context, resource, action, 'DENIED', 'Security context validation failed', securityContext);
          return {
            allowed: false,
            reason: 'Security validation failed'
          };
        }
      }

      // 5. Success - log and return
      await this.auditAccess(context, resource, action, 'ALLOWED', undefined, securityContext);
      
      logger.info('Authorization successful', {
        userId: context.userId,
        role: context.role,
        resource,
        action,
        resourceId,
        duration: Date.now() - startTime
      });

      return { allowed: true };

    } catch (error) {
      logger.error('Authorization error', {
        userId: context.userId,
        resource,
        action,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      await this.auditAccess(context, resource, action, 'DENIED', 'System error', securityContext);
      
      return {
        allowed: false,
        reason: 'Authorization system error'
      };
    }
  }

  /**
   * Batch authorization for multiple resources
   */
  async authorizeMultiple(
    context: AccessContext,
    requests: Array<{ resource: Resource; action: Action; resourceId?: string }>,
    securityContext?: SecurityContext
  ): Promise<Record<string, AuthorizationResult>> {
    const results: Record<string, AuthorizationResult> = {};

    for (const request of requests) {
      const key = `${request.resource}:${request.action}:${request.resourceId || 'global'}`;
      results[key] = await this.authorize(
        context,
        request.resource,
        request.action,
        request.resourceId,
        securityContext
      );
    }

    return results;
  }

  // ============================================
  // PERMISSION VALIDATION
  // ============================================

  private hasPermission(role: UserRole, permission: Permission): boolean {
    const rolePermissions = getRolePermissions(role);
    
    // Check exact permission
    if (rolePermissions.includes(permission)) {
      return true;
    }

    // Check wildcard permissions
    const [resource, action] = permission.split(':');
    const wildcardPermissions = [
      `${resource}:*` as Permission,
      `*:${action}` as Permission,
      '*:*' as Permission
    ];

    return wildcardPermissions.some(wildcard => rolePermissions.includes(wildcard));
  }

  // ============================================
  // OWNERSHIP VALIDATION
  // ============================================

  private async validateOwnership(
    context: AccessContext,
    resource: Resource,
    resourceId: string
  ): Promise<boolean> {
    const ownershipRule = OWNERSHIP_RULES[context.role]?.[`${resource}:*`] || 
                         OWNERSHIP_RULES[context.role]?.[`${resource}:read`];

    if (!ownershipRule) {
      return true; // No ownership rule means access is allowed
    }

    switch (ownershipRule) {
      case 'self_owned':
        return await this.validateSelfOwnership(context.userId, resource, resourceId);
      
      case 'assigned_students':
        return await this.validateStudentAssignment(context.userId, resource, resourceId);
      
      case 'assigned_to_self':
        return await this.validateAssignedToSelf(context.userId, resource, resourceId);
      
      case 'same_organization':
        return await this.validateSameOrganization(context.userId, resource, resourceId);
      
      case 'global_access':
        return true;
      
      default:
        return false;
    }
  }

  private async validateSelfOwnership(userId: string, resource: Resource, resourceId: string): Promise<boolean> {
    try {
      switch (resource) {
        case Resource.APPLICATION:
          const application = await prisma.application.findUnique({
            where: { id: resourceId },
            select: { userId: true }
          });
          return application?.userId === userId;

        case Resource.PROFILE:
        case Resource.USER:
          return resourceId === userId;

        case Resource.NOTIFICATION:
          const notification = await prisma.notification.findUnique({
            where: { id: resourceId },
            select: { userId: true }
          });
          return notification?.userId === userId;

        default:
          return false;
      }
    } catch (error) {
      logger.error('Self ownership validation error', { userId, resource, resourceId, error });
      return false;
    }
  }

  private async validateStudentAssignment(mentorId: string, resource: Resource, resourceId: string): Promise<boolean> {
    try {
      // Get mentor's assigned students
      const assignments = await prisma.mentorAssignment.findMany({
        where: { 
          mentorId,
          isActive: true 
        },
        select: { studentId: true }
      });
      
      const assignedStudentIds = assignments.map(a => a.studentId);

      switch (resource) {
        case Resource.APPLICATION:
          const application = await prisma.application.findUnique({
            where: { id: resourceId },
            select: { userId: true }
          });
          return application ? assignedStudentIds.includes(application.userId) : false;

        case Resource.USER:
          return assignedStudentIds.includes(resourceId);

        case Resource.FEEDBACK:
          const feedback = await prisma.feedback.findUnique({
            where: { id: resourceId },
            include: { application: { select: { userId: true } } }
          });
          return feedback ? assignedStudentIds.includes(feedback.application.userId) : false;

        default:
          return false;
      }
    } catch (error) {
      logger.error('Student assignment validation error', { mentorId, resource, resourceId, error });
      return false;
    }
  }

  private async validateAssignedToSelf(userId: string, resource: Resource, resourceId: string): Promise<boolean> {
    try {
      if (resource === Resource.FEEDBACK) {
        const feedback = await prisma.feedback.findUnique({
          where: { id: resourceId },
          include: { application: { select: { userId: true } } }
        });
        return feedback?.application.userId === userId;
      }
      return false;
    } catch (error) {
      logger.error('Assigned to self validation error', { userId, resource, resourceId, error });
      return false;
    }
  }

  private async validateSameOrganization(userId: string, resource: Resource, resourceId: string): Promise<boolean> {
    // For now, return true as we don't have organization structure yet
    // This would be implemented when multi-tenant support is added
    return true;
  }

  // ============================================
  // SECURITY VALIDATION
  // ============================================

  private async checkRateLimit(context: AccessContext, securityContext?: SecurityContext): Promise<boolean> {
    if (!securityContext) return true;

    const policy = SECURITY_POLICIES.RATE_LIMITS[context.role];
    const key = `rate_limit:${context.userId}:${Math.floor(Date.now() / (15 * 60 * 1000))}`;

    try {
      // Use INCR which returns number directly, handles first-time access (starts at 1)
      // Returns null if Redis is not available
      const current = await redis.incr(key);
      
      // If Redis is not available, fail open (allow request)
      if (current === null) {
        logger.warn('Rate limit check failed - Redis unavailable, allowing request');
        return true;
      }
      
      // Set expiration only on first increment to prevent race conditions
      if (current === 1) {
        await redis.expire(key, 15 * 60); // 15 minutes
      }
      
      // current is guaranteed to be a number >= 1 from INCR operation
      return current <= policy.requests;
    } catch (error) {
      logger.warn('Rate limit check failed, allowing request', { error });
      return true; // Fail open for availability
    }
  }

  private async validateSecurityContext(context: AccessContext, securityContext: SecurityContext): Promise<boolean> {
    // Check session age
    const policy = SECURITY_POLICIES.SESSION_POLICIES[context.role];
    const sessionAge = Date.now() - securityContext.lastActivity.getTime();
    const maxAge = this.parseTimeString(policy.maxAge);

    if (sessionAge > maxAge) {
      return false;
    }

    // Check risk score
    if (securityContext.riskScore > 80) {
      return false;
    }

    // For super admin, require MFA
    if (context.role === UserRole.SUPER_ADMIN && !securityContext.mfaVerified) {
      return false;
    }

    return true;
  }

  private parseTimeString(timeStr: string): number {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0, -1));
    
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      case 's': return value * 1000;
      default: return value;
    }
  }

  // ============================================
  // AUDIT LOGGING
  // ============================================

  private async auditAccess(
    context: AccessContext,
    resource: Resource,
    action: Action,
    result: 'ALLOWED' | 'DENIED',
    reason?: string,
    securityContext?: SecurityContext
  ): Promise<void> {
    const auditEvent: Omit<AuditEvent, 'id'> = {
      userId: context.userId,
      action: `${resource}:${action}`,
      resource,
      result,
      reason,
      metadata: {
        role: context.role,
        permissions: context.permissions,
        organizationId: context.organizationId
      },
      timestamp: new Date(),
      ipAddress: securityContext?.ipAddress || 'unknown',
      userAgent: securityContext?.userAgent || 'unknown',
      organizationId: context.organizationId
    };

    try {
      // Store in database for long-term retention
      await prisma.auditLog.create({
        data: {
          ...auditEvent,
          id: undefined, // Let DB generate ID
          metadata: JSON.stringify(auditEvent.metadata)
        }
      });

      // Also log to application logger for immediate monitoring
      logger.info('RBAC Audit', auditEvent);
    } catch (error) {
      logger.error('Failed to create audit log', { error, auditEvent });
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Get user's effective permissions (including inherited)
   */
  getEffectivePermissions(role: UserRole): Permission[] {
    return getRolePermissions(role);
  }

  /**
   * Check if user can perform action on resource type (without specific resource ID)
   */
  canPerformAction(role: UserRole, resource: Resource, action: Action): boolean {
    const permission = `${resource}:${action}` as Permission;
    return this.hasPermission(role, permission);
  }

  /**
   * Get all resources a role can access with specific action
   */
  getAccessibleResources(role: UserRole, action: Action): Resource[] {
    const permissions = getRolePermissions(role);
    const resources: Resource[] = [];

    for (const permission of permissions) {
      const [resource, permAction] = permission.split(':');
      if (permAction === action || permAction === '*') {
        resources.push(resource as Resource);
      }
    }

    return [...new Set(resources)];
  }
}

// Export singleton instance
export const rbacService = RBACService.getInstance();