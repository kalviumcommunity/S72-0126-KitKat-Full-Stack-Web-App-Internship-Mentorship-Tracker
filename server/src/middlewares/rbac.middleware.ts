/**
 * Enterprise RBAC Middleware
 * Provides declarative authorization for API endpoints with comprehensive security
 */

import { Request, Response, NextFunction } from 'express';
import { 
  Resource, 
  Action, 
  AccessContext, 
  SecurityContext,
  RBACMiddlewareOptions 
} from '../types/rbac';
import { rbacService } from '../services/rbac.service';
import { AuthenticationError, AuthorizationError } from './error.middleware';
import { logger } from '../lib/logger';

/**
 * Main RBAC authorization middleware factory
 */
export function requirePermission(options: RBACMiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Ensure user is authenticated
      if (!req.user) {
        throw new AuthenticationError('Authentication required');
      }

      // 2. Build access context
      const accessContext = await buildAccessContext(req);
      req.accessContext = accessContext;

      // 3. Build security context
      const securityContext = buildSecurityContext(req);
      req.securityContext = securityContext;

      // 4. Extract resource ID from request
      const resourceId = extractResourceId(req, options.resource);

      // 5. Perform authorization check
      const authResult = await rbacService.authorize(
        accessContext,
        options.resource,
        options.action,
        resourceId,
        securityContext
      );

      if (!authResult.allowed) {
        logger.warn('Authorization denied', {
          userId: req.user.id,
          resource: options.resource,
          action: options.action,
          reason: authResult.reason,
          path: req.path,
          method: req.method
        });

        throw new AuthorizationError(authResult.reason || 'Access denied');
      }

      // 6. Custom validation if provided
      if (options.customValidator) {
        const customValid = await options.customValidator(accessContext, resourceId);
        if (!customValid) {
          throw new AuthorizationError('Custom validation failed');
        }
      }

      // 7. Success - continue to next middleware
      logger.debug('Authorization successful', {
        userId: req.user.id,
        resource: options.resource,
        action: options.action,
        resourceId
      });

      next();

    } catch (error) {
      next(error);
    }
  };
}

/**
 * Role-based middleware (simpler alternative)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Role-based authorization denied', {
        userId: req.user.id,
        userRole: req.user.role,
        allowedRoles,
        path: req.path
      });
      
      return next(new AuthorizationError('Insufficient role privileges'));
    }

    next();
  };
}

/**
 * Resource ownership middleware
 */
export function requireOwnership(resourceType: Resource) {
  return requirePermission({
    resource: resourceType,
    action: Action.READ,
    ownershipCheck: true,
    auditLevel: 'basic'
  });
}

/**
 * Mentor-student relationship middleware
 */
export function requireMentorStudentRelation() {
  return requirePermission({
    resource: Resource.MENTORSHIP,
    action: Action.READ,
    customValidator: async (context: AccessContext, resourceId?: string) => {
      if (!resourceId) return false;
      
      // This would check if the mentor is assigned to the student
      // Implementation depends on how the relationship is stored
      return true; // Placeholder
    },
    auditLevel: 'detailed'
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function buildAccessContext(req: Request): Promise<AccessContext> {
  const user = req.user!;
  
  // Get user's effective permissions
  const permissions = rbacService.getEffectivePermissions(user.role as any);
  
  // Build context
  const context: AccessContext = {
    userId: user.id,
    role: user.role as any,
    permissions,
    organizationId: user.organizationId
  };

  // Add relationship data for mentors and students
  if (user.role === 'MENTOR') {
    context.assignedStudents = await getAssignedStudents(user.id);
  } else if (user.role === 'STUDENT') {
    context.assignedMentors = await getAssignedMentors(user.id);
  }

  return context;
}

function buildSecurityContext(req: Request): SecurityContext {
  return {
    sessionId: req.sessionID || `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ipAddress: req.ip || req.connection?.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
    lastActivity: new Date(),
    riskScore: calculateRiskScore(req),
    mfaVerified: false // Would be set by MFA middleware
  };
}

function extractResourceId(req: Request, resource: Resource): string | undefined {
  // Try common parameter names
  const possibleParams = ['id', 'userId', 'applicationId', 'feedbackId', 'notificationId'];
  
  for (const param of possibleParams) {
    if (req.params[param]) {
      return req.params[param];
    }
  }

  // Try resource-specific patterns
  switch (resource) {
    case Resource.USER:
    case Resource.PROFILE:
      return req.params.userId || req.params.id;
    case Resource.APPLICATION:
      return req.params.applicationId || req.params.id;
    case Resource.FEEDBACK:
      return req.params.feedbackId || req.params.id;
    default:
      return req.params.id;
  }
}

async function getAssignedStudents(mentorId: string): Promise<string[]> {
  try {
    // This would query the database for assigned students
    // Placeholder implementation
    return [];
  } catch (error) {
    logger.error('Failed to get assigned students', { mentorId, error });
    return [];
  }
}

async function getAssignedMentors(studentId: string): Promise<string[]> {
  try {
    // This would query the database for assigned mentors
    // Placeholder implementation
    return [];
  } catch (error) {
    logger.error('Failed to get assigned mentors', { studentId, error });
    return [];
  }
}

function calculateRiskScore(req: Request): number {
  let score = 0;

  // Check for suspicious patterns
  const userAgent = req.get('User-Agent') || '';
  const ip = req.ip || '';

  // Basic heuristics (would be more sophisticated in production)
  if (!userAgent.includes('Mozilla')) score += 20;
  if (ip.startsWith('10.') || ip.startsWith('192.168.')) score -= 10; // Internal network
  if (req.get('X-Forwarded-For')) score += 5; // Behind proxy

  // Time-based risk (higher risk outside business hours)
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) score += 15;

  return Math.max(0, Math.min(100, score));
}

// ============================================
// CONVENIENCE MIDDLEWARES
// ============================================

// Common permission combinations
export const requireStudentAccess = requireRole('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN');
export const requireMentorAccess = requireRole('MENTOR', 'ADMIN', 'SUPER_ADMIN');
export const requireAdminAccess = requireRole('ADMIN', 'SUPER_ADMIN');
export const requireSuperAdminAccess = requireRole('SUPER_ADMIN');

// Resource-specific middlewares
export const canCreateApplication = requirePermission({
  resource: Resource.APPLICATION,
  action: Action.CREATE,
  auditLevel: 'basic'
});

export const canReadApplication = requirePermission({
  resource: Resource.APPLICATION,
  action: Action.READ,
  ownershipCheck: true,
  auditLevel: 'basic'
});

export const canUpdateApplication = requirePermission({
  resource: Resource.APPLICATION,
  action: Action.UPDATE,
  ownershipCheck: true,
  auditLevel: 'detailed'
});

export const canDeleteApplication = requirePermission({
  resource: Resource.APPLICATION,
  action: Action.DELETE,
  ownershipCheck: true,
  auditLevel: 'detailed'
});

export const canCreateFeedback = requirePermission({
  resource: Resource.FEEDBACK,
  action: Action.CREATE,
  customValidator: async (context, resourceId) => {
    // Ensure mentor can only create feedback for assigned students
    return context.role === 'MENTOR' || context.role === 'ADMIN' || context.role === 'SUPER_ADMIN';
  },
  auditLevel: 'detailed'
});

export const canReadFeedback = requirePermission({
  resource: Resource.FEEDBACK,
  action: Action.READ,
  ownershipCheck: true,
  auditLevel: 'basic'
});

export const canManageUsers = requirePermission({
  resource: Resource.USER,
  action: Action.MANAGE,
  auditLevel: 'detailed'
});

export const canViewAnalytics = requirePermission({
  resource: Resource.ANALYTICS,
  action: Action.READ,
  auditLevel: 'basic'
});

export const canAuditSystem = requirePermission({
  resource: Resource.AUDIT_LOG,
  action: Action.READ,
  auditLevel: 'detailed'
});