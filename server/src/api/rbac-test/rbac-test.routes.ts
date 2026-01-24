/**
 * RBAC Testing Routes
 * Provides comprehensive endpoints for testing the RBAC system
 */

import { Router } from 'express';
import { rbacTestController } from './rbac-test.controller';
import { 
  requirePermission,
  requireRole,
  requireAdminAccess,
  requireSuperAdminAccess 
} from '../../middlewares/rbac.middleware';
import { authenticateToken } from '../../middlewares/test-auth.middleware';
import { Resource, Action } from '../../types/rbac';

const router = Router();

// ============================================
// PUBLIC TEST ENDPOINTS (No Auth Required)
// ============================================

// Get all test users and their roles
router.get('/users', rbacTestController.getTestUsers);

// Get test data relationships
router.get('/relationships', rbacTestController.getTestRelationships);

// Test login endpoint
router.post('/login', rbacTestController.testLogin);

// Get permissions for a specific role
router.get('/permissions/:role', rbacTestController.getRolePermissions);

// Test authorization for specific scenarios
router.post('/authorize', rbacTestController.testAuthorization);

// Test common RBAC scenarios
router.get('/scenarios', rbacTestController.testScenarios);

// Get RBAC system status
router.get('/status', rbacTestController.getSystemStatus);

// ============================================
// PROTECTED TEST ENDPOINTS (Auth Required)
// ============================================

// Test student-level access
router.get('/test-student-access', 
  authenticateToken,
  requireRole('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Student-level access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Test mentor-level access
router.get('/test-mentor-access',
  authenticateToken,
  requireRole('MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Mentor-level access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Test admin-level access
router.get('/test-admin-access',
  authenticateToken,
  requireAdminAccess,
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin-level access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Test super admin-level access
router.get('/test-superadmin-access',
  authenticateToken,
  requireSuperAdminAccess,
  (req, res) => {
    res.json({
      success: true,
      message: 'Super Admin-level access granted',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  }
);

// Test specific permission requirements
router.get('/test-application-create',
  authenticateToken,
  requirePermission({
    resource: Resource.APPLICATION,
    action: Action.CREATE,
    auditLevel: 'basic'
  }),
  (req, res) => {
    res.json({
      success: true,
      message: 'Application creation permission verified',
      user: req.user,
      permission: 'application:create',
      timestamp: new Date().toISOString()
    });
  }
);

router.get('/test-user-management',
  authenticateToken,
  requirePermission({
    resource: Resource.USER,
    action: Action.MANAGE,
    auditLevel: 'detailed'
  }),
  (req, res) => {
    res.json({
      success: true,
      message: 'User management permission verified',
      user: req.user,
      permission: 'user:manage',
      timestamp: new Date().toISOString()
    });
  }
);

router.get('/test-analytics-access',
  authenticateToken,
  requirePermission({
    resource: Resource.ANALYTICS,
    action: Action.READ,
    auditLevel: 'basic'
  }),
  (req, res) => {
    res.json({
      success: true,
      message: 'Analytics access permission verified',
      user: req.user,
      permission: 'analytics:read',
      timestamp: new Date().toISOString()
    });
  }
);

// ============================================
// OWNERSHIP TESTING ENDPOINTS
// ============================================

// Test resource ownership validation
router.get('/test-ownership/:resourceType/:resourceId',
  requirePermission({
    resource: Resource.APPLICATION, // Will be overridden by params
    action: Action.READ,
    ownershipCheck: true,
    auditLevel: 'detailed'
  }),
  (req, res) => {
    res.json({
      success: true,
      message: 'Resource ownership validation passed',
      user: req.user,
      resource: {
        type: req.params.resourceType,
        id: req.params.resourceId
      },
      timestamp: new Date().toISOString()
    });
  }
);

// ============================================
// BATCH TESTING ENDPOINTS
// ============================================

// Test multiple permissions at once
router.post('/test-batch-permissions',
  authenticateToken,
  requireRole('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN'),
  async (req, res) => {
    const { permissions } = req.body;
    
    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'permissions array is required'
        }
      });
    }

    const results = {};
    
    // This would use the rbacService to test multiple permissions
    // For now, just return a mock response
    for (const permission of permissions) {
      results[permission] = {
        allowed: true, // Would be actual check
        reason: 'Test result'
      };
    }

    res.json({
      success: true,
      data: {
        user: req.user,
        results,
        timestamp: new Date().toISOString()
      }
    });
  }
);

// ============================================
// ERROR TESTING ENDPOINTS
// ============================================

// Test authentication error
router.get('/test-auth-error', (req, res) => {
  res.status(401).json({
    success: false,
    error: {
      code: 'AUTHENTICATION_ERROR',
      message: 'This endpoint always returns authentication error for testing'
    }
  });
});

// Test authorization error
router.get('/test-authz-error',
  requireSuperAdminAccess, // Most restrictive
  (req, res) => {
    res.json({
      success: true,
      message: 'If you see this, you have super admin access'
    });
  }
);

// Test rate limiting (would need actual rate limiting middleware)
router.get('/test-rate-limit', (req, res) => {
  res.json({
    success: true,
    message: 'Rate limiting test endpoint',
    note: 'Make multiple rapid requests to test rate limiting'
  });
});

export default router;