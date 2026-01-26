/**
 * Enterprise RBAC Permission Matrix and Policy Definitions
 * Implements least-privilege principle with explicit permission grants
 */

import { UserRole, Resource, Action, Permission, RoleDefinition } from '../types/rbac';

// ============================================
// PERMISSION MATRIX - EXPLICIT GRANTS ONLY
// ============================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    // Own Profile Management
    'profile:read',
    'profile:update',
    
    // Own Applications
    'application:create',
    'application:read',
    'application:update',
    'application:delete',
    'application:list',
    
    // Own Resume Management
    'resume:upload',
    'resume:read',
    'resume:update',
    'resume:delete',
    
    // Feedback (Receive Only)
    'feedback:read',
    'feedback:list',
    'feedback_request:create',
    
    // Mentorship (Assigned Only)
    'mentorship:read',
    'mentor_assignment:read',
    
    // Own Notifications
    'notification:read',
    'notification:list',
    'notification:update', // Mark as read
    
    // File Operations (Own Files)
    'file:upload',
    'file:read',
    'file:delete',
  ],

  [UserRole.MENTOR]: [
    // Own Profile Management
    'profile:read',
    'profile:update',
    
    // Assigned Students' Applications (Read-Only)
    'application:read',
    'application:list',
    
    // Feedback Management (For Assigned Students)
    'feedback:create',
    'feedback:read',
    'feedback:update',
    'feedback:list',
    'feedback_request:read',
    'feedback_request:update',
    
    // Mentorship Management
    'mentorship:read',
    'mentorship:update',
    'mentor_assignment:read',
    
    // Student Profile Access (Assigned Only)
    'user:read', // Limited to assigned students
    
    // Own Notifications
    'notification:read',
    'notification:list',
    'notification:update',
    'notification:send', // To assigned students
    
    // File Access (Assigned Students' Files)
    'file:read',
    'resume:read',
  ],

  [UserRole.ADMIN]: [
    // User Management
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'user:list',
    'user:search',
    'user:export',
    
    // Profile Management (All Users)
    'profile:read',
    'profile:update',
    
    // Application Management
    'application:read',
    'application:update',
    'application:delete',
    'application:list',
    'application:search',
    'application:export',
    'application_status:update',
    
    // Mentorship Administration
    'mentorship:create',
    'mentorship:read',
    'mentorship:update',
    'mentorship:delete',
    'mentorship:list',
    'mentor_assignment:create',
    'mentor_assignment:read',
    'mentor_assignment:update',
    'mentor_assignment:delete',
    'mentor_assignment:assign',
    'mentor_assignment:unassign',
    
    // Feedback Oversight
    'feedback:read',
    'feedback:update',
    'feedback:delete',
    'feedback:list',
    'feedback:search',
    'feedback_request:read',
    'feedback_request:update',
    'feedback_request:approve',
    'feedback_request:reject',
    
    // Notification Management
    'notification:create',
    'notification:read',
    'notification:update',
    'notification:delete',
    'notification:list',
    'notification:send',
    
    // File Management
    'file:read',
    'file:delete',
    'file:list',
    'resume:read',
    'resume:delete',
    
    // Analytics and Reporting
    'analytics:read',
    'analytics:export',
    
    // Audit Access
    'audit_log:read',
    'audit_log:list',
    'audit_log:search',
  ],

  [UserRole.SUPER_ADMIN]: [
    // All Admin Permissions (Inherited)
    ...[] as Permission[], // Will be populated by role hierarchy
    
    // System Administration
    'system:manage',
    'system:configure',
    'system:audit',
    
    // Organization/Tenant Management
    'organization:create',
    'organization:read',
    'organization:update',
    'organization:delete',
    'organization:list',
    'tenant:create',
    'tenant:read',
    'tenant:update',
    'tenant:delete',
    'tenant:manage',
    
    // Advanced User Management
    'user:import',
    'user:export',
    'user:manage',
    
    // Full Audit Access
    'audit_log:read',
    'audit_log:list',
    'audit_log:search',
    'audit_log:export',
    'audit_log:delete',
    
    // System Analytics
    'analytics:read',
    'analytics:export',
    'analytics:manage',
    
    // Security Management
    'system:configure',
    'system:manage',
    'system:audit',
  ]
};

// ============================================
// ROLE HIERARCHY AND INHERITANCE
// ============================================

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  [UserRole.STUDENT]: {
    role: UserRole.STUDENT,
    description: 'Students can manage their applications, receive feedback, and interact with assigned mentors',
    permissions: ROLE_PERMISSIONS[UserRole.STUDENT],
    constraints: [
      {
        type: 'resource_limit',
        config: { maxApplications: 50, maxFileSize: '10MB' }
      }
    ]
  },

  [UserRole.MENTOR]: {
    role: UserRole.MENTOR,
    description: 'Mentors can provide feedback and guidance to assigned students',
    permissions: ROLE_PERMISSIONS[UserRole.MENTOR],
    constraints: [
      {
        type: 'resource_limit',
        config: { maxAssignedStudents: 20 }
      }
    ]
  },

  [UserRole.ADMIN]: {
    role: UserRole.ADMIN,
    description: 'Administrators manage users, applications, and system operations within their organization',
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
    constraints: [
      {
        type: 'approval_required',
        config: { actions: ['user:delete', 'application:delete'] }
      }
    ]
  },

  [UserRole.SUPER_ADMIN]: {
    role: UserRole.SUPER_ADMIN,
    description: 'Super administrators have full system access across all organizations',
    permissions: [
      ...ROLE_PERMISSIONS[UserRole.ADMIN], // Inherit admin permissions
      ...ROLE_PERMISSIONS[UserRole.SUPER_ADMIN]
    ],
    inherits: [UserRole.ADMIN],
    constraints: [
      {
        type: 'ip_based',
        config: { allowedIPs: ['admin_network'] }
      },
      {
        type: 'time_based',
        config: { businessHoursOnly: true }
      }
    ]
  }
};

// ============================================
// OWNERSHIP AND RELATIONSHIP RULES
// ============================================

export const OWNERSHIP_RULES = {
  // Students can only access their own resources
  [UserRole.STUDENT]: {
    'application:*': 'self_owned',
    'profile:*': 'self_owned',
    'file:*': 'self_owned',
    'resume:*': 'self_owned',
    'notification:*': 'self_owned',
    'feedback:read': 'assigned_to_self', // Can read feedback given to them
  },

  // Mentors can access assigned students' resources
  [UserRole.MENTOR]: {
    'application:read': 'assigned_students',
    'feedback:*': 'assigned_students',
    'user:read': 'assigned_students',
    'file:read': 'assigned_students',
    'resume:read': 'assigned_students',
    'notification:send': 'assigned_students',
  },

  // Admins have broader access within their organization
  [UserRole.ADMIN]: {
    'user:*': 'same_organization',
    'application:*': 'same_organization',
    'feedback:*': 'same_organization',
    'mentorship:*': 'same_organization',
    'notification:*': 'same_organization',
  },

  // Super Admins have cross-organization access
  [UserRole.SUPER_ADMIN]: {
    '*:*': 'global_access'
  }
};

// ============================================
// SECURITY POLICIES
// ============================================

export const SECURITY_POLICIES = {
  // Rate limiting per role
  RATE_LIMITS: {
    [UserRole.STUDENT]: { requests: 100, window: '15m' },
    [UserRole.MENTOR]: { requests: 200, window: '15m' },
    [UserRole.ADMIN]: { requests: 500, window: '15m' },
    [UserRole.SUPER_ADMIN]: { requests: 1000, window: '15m' }
  },

  // Session policies
  SESSION_POLICIES: {
    [UserRole.STUDENT]: { maxAge: '24h', renewThreshold: '2h' },
    [UserRole.MENTOR]: { maxAge: '12h', renewThreshold: '1h' },
    [UserRole.ADMIN]: { maxAge: '8h', renewThreshold: '30m' },
    [UserRole.SUPER_ADMIN]: { maxAge: '4h', renewThreshold: '15m' }
  },

  // Audit requirements
  AUDIT_REQUIREMENTS: {
    [UserRole.STUDENT]: ['application:delete', 'profile:update'],
    [UserRole.MENTOR]: ['feedback:create', 'feedback:update'],
    [UserRole.ADMIN]: ['user:create', 'user:delete', 'mentor_assignment:*'],
    [UserRole.SUPER_ADMIN]: ['*:*'] // Audit everything
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getRolePermissions(role: UserRole): Permission[] {
  const definition = ROLE_DEFINITIONS[role];
  let permissions = [...definition.permissions];

  // Apply inheritance
  if (definition.inherits) {
    for (const inheritedRole of definition.inherits) {
      permissions = [...permissions, ...getRolePermissions(inheritedRole)];
    }
  }

  // Remove duplicates
  return [...new Set(permissions)];
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = getRolePermissions(userRole);
  return rolePermissions.includes(permission);
}

export function getRequiredPermission(resource: Resource, action: Action): Permission {
  return `${resource}:${action}` as Permission;
}