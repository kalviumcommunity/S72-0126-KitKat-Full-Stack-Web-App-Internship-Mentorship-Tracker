/**
 * Enterprise-Grade Role-Based Access Control (RBAC) System
 * Designed for scalable SaaS applications with strict security requirements
 */

// ============================================
// CORE RBAC TYPES
// ============================================

export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR', 
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum Resource {
  // User Management
  USER = 'user',
  PROFILE = 'profile',
  
  // Application Management
  APPLICATION = 'application',
  APPLICATION_STATUS = 'application_status',
  
  // Mentorship
  MENTORSHIP = 'mentorship',
  MENTOR_ASSIGNMENT = 'mentor_assignment',
  
  // Feedback System
  FEEDBACK = 'feedback',
  FEEDBACK_REQUEST = 'feedback_request',
  
  // Notifications
  NOTIFICATION = 'notification',
  
  // System Administration
  SYSTEM = 'system',
  AUDIT_LOG = 'audit_log',
  ANALYTICS = 'analytics',
  
  // File Management
  FILE = 'file',
  RESUME = 'resume',
  
  // Multi-tenant (Future)
  TENANT = 'tenant',
  ORGANIZATION = 'organization'
}

export enum Action {
  // CRUD Operations
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  
  // Specialized Actions
  LIST = 'list',
  SEARCH = 'search',
  EXPORT = 'export',
  IMPORT = 'import',
  
  // Status Management
  APPROVE = 'approve',
  REJECT = 'reject',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  
  // System Actions
  MANAGE = 'manage',
  CONFIGURE = 'configure',
  AUDIT = 'audit',
  
  // File Operations
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  
  // Communication
  SEND = 'send',
  RECEIVE = 'receive'
}

// Permission format: <resource>:<action>
export type Permission = `${Resource}:${Action}`;

// ============================================
// ACCESS CONTROL CONTEXT
// ============================================

export interface AccessContext {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  organizationId?: string; // For multi-tenant support
  assignedStudents?: string[]; // For mentors
  assignedMentors?: string[]; // For students
}

export interface ResourceOwnership {
  ownerId: string;
  resourceType: Resource;
  resourceId: string;
  organizationId?: string;
}

// ============================================
// RBAC POLICY DEFINITIONS
// ============================================

export interface RoleDefinition {
  role: UserRole;
  description: string;
  permissions: Permission[];
  inherits?: UserRole[]; // Role hierarchy
  constraints?: RoleConstraint[];
}

export interface RoleConstraint {
  type: 'time_based' | 'ip_based' | 'resource_limit' | 'approval_required';
  config: Record<string, any>;
}

// ============================================
// AUDIT AND SECURITY
// ============================================

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: Resource;
  resourceId?: string;
  result: 'ALLOWED' | 'DENIED';
  reason?: string;
  metadata: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  organizationId?: string;
}

export interface SecurityContext {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: Date;
  riskScore: number;
  mfaVerified: boolean;
}

// ============================================
// AUTHORIZATION RESULT
// ============================================

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  requiredPermissions?: Permission[];
  missingPermissions?: Permission[];
  context?: Record<string, any>;
}

// ============================================
// MIDDLEWARE TYPES
// ============================================

export interface RBACMiddlewareOptions {
  resource: Resource;
  action: Action;
  ownershipCheck?: boolean;
  customValidator?: (context: AccessContext, resourceId?: string) => Promise<boolean>;
  auditLevel?: 'none' | 'basic' | 'detailed';
}

// ============================================
// MULTI-TENANT SUPPORT
// ============================================

export interface TenantContext {
  tenantId: string;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  features: string[];
  limits: Record<string, number>;
}

export interface CrossTenantAccess {
  sourceTenantId: string;
  targetTenantId: string;
  permissions: Permission[];
  expiresAt?: Date;
}