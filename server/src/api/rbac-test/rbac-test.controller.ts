/**
 * RBAC Testing Controller
 * Provides endpoints to test the complete RBAC system with hardcoded users
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/error.middleware';
import { ApiResponse } from '../../types/api';
import { 
  generateTestUsers, 
  getTestUserByEmail, 
  TEST_MENTOR_ASSIGNMENTS,
  TEST_ORGANIZATIONS,
  TEST_APPLICATIONS,
  TEST_FEEDBACK,
  TEST_PASSWORD
} from '../../data/test-users';
import { rbacService } from '../../services/rbac.service';
import { UserRole, Resource, Action } from '../../types/rbac';
import { signToken } from '../../lib/jwt';
import { verifyPassword } from '../../lib/password';

export const rbacTestController = {
  // ============================================
  // TEST DATA ENDPOINTS
  // ============================================

  // GET /api/rbac-test/users - Get all test users
  getTestUsers: asyncHandler(async (req: Request, res: Response) => {
    const users = await generateTestUsers();
    
    // Remove password hashes from response
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      organizationId: user.organizationId,
      testPassword: TEST_PASSWORD // Include for testing convenience
    }));

    const response: ApiResponse = {
      success: true,
      data: {
        users: safeUsers,
        totalCount: safeUsers.length,
        roleDistribution: {
          STUDENT: safeUsers.filter(u => u.role === UserRole.STUDENT).length,
          MENTOR: safeUsers.filter(u => u.role === UserRole.MENTOR).length,
          ADMIN: safeUsers.filter(u => u.role === UserRole.ADMIN).length,
          SUPER_ADMIN: safeUsers.filter(u => u.role === UserRole.SUPER_ADMIN).length
        }
      }
    };

    res.json(response);
  }),

  // GET /api/rbac-test/relationships - Get test relationships
  getTestRelationships: asyncHandler(async (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      data: {
        mentorAssignments: TEST_MENTOR_ASSIGNMENTS,
        organizations: TEST_ORGANIZATIONS,
        applications: TEST_APPLICATIONS,
        feedback: TEST_FEEDBACK
      }
    };

    res.json(response);
  }),

  // ============================================
  // AUTHENTICATION TESTING
  // ============================================

  // POST /api/rbac-test/login - Test login with hardcoded users
  testLogin: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        }
      };
      return res.status(400).json(response);
    }

    // Find test user
    const user = await getTestUserByEmail(email);
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      };
      return res.status(401).json(response);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      };
      return res.status(401).json(response);
    }

    // Generate JWT token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Get user permissions
    const permissions = rbacService.getEffectivePermissions(user.role);

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          organizationId: user.organizationId
        },
        token,
        permissions,
        expiresIn: '24h'
      }
    };

    res.json(response);
  }),

  // ============================================
  // PERMISSION TESTING
  // ============================================

  // GET /api/rbac-test/permissions/:role - Get permissions for a role
  getRolePermissions: asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.params;
    
    if (!Object.values(UserRole).includes(role as UserRole)) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_ROLE',
          message: 'Invalid role specified'
        }
      };
      return res.status(400).json(response);
    }

    const permissions = rbacService.getEffectivePermissions(role as UserRole);
    const accessibleResources = rbacService.getAccessibleResources(role as UserRole, Action.READ);

    const response: ApiResponse = {
      success: true,
      data: {
        role,
        permissions,
        permissionCount: permissions.length,
        accessibleResources,
        canPerform: {
          createApplication: rbacService.canPerformAction(role as UserRole, Resource.APPLICATION, Action.CREATE),
          readFeedback: rbacService.canPerformAction(role as UserRole, Resource.FEEDBACK, Action.READ),
          manageUsers: rbacService.canPerformAction(role as UserRole, Resource.USER, Action.MANAGE),
          viewAnalytics: rbacService.canPerformAction(role as UserRole, Resource.ANALYTICS, Action.READ)
        }
      }
    };

    res.json(response);
  }),

  // POST /api/rbac-test/authorize - Test authorization for specific action
  testAuthorization: asyncHandler(async (req: Request, res: Response) => {
    const { userId, resource, action, resourceId } = req.body;

    if (!userId || !resource || !action) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'userId, resource, and action are required'
        }
      };
      return res.status(400).json(response);
    }

    // Get test user
    const users = await generateTestUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Test user not found'
        }
      };
      return res.status(404).json(response);
    }

    // Build access context
    const accessContext = {
      userId: user.id,
      role: user.role,
      permissions: rbacService.getEffectivePermissions(user.role),
      organizationId: user.organizationId
    };

    // Test authorization
    const authResult = await rbacService.authorize(
      accessContext,
      resource as Resource,
      action as Action,
      resourceId
    );

    const response: ApiResponse = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        request: {
          resource,
          action,
          resourceId
        },
        authorization: authResult,
        timestamp: new Date().toISOString()
      }
    };

    res.json(response);
  }),

  // ============================================
  // SCENARIO TESTING
  // ============================================

  // GET /api/rbac-test/scenarios - Test common RBAC scenarios
  testScenarios: asyncHandler(async (req: Request, res: Response) => {
    const users = await generateTestUsers();
    const scenarios = [];

    // Scenario 1: Student accessing own application
    const student = users.find(u => u.role === UserRole.STUDENT);
    if (student) {
      const studentContext = {
        userId: student.id,
        role: student.role,
        permissions: rbacService.getEffectivePermissions(student.role),
        organizationId: student.organizationId
      };

      const ownAppAccess = await rbacService.authorize(
        studentContext,
        Resource.APPLICATION,
        Action.READ,
        'app-001' // Assuming this belongs to the student
      );

      scenarios.push({
        name: 'Student accessing own application',
        user: student.email,
        result: ownAppAccess
      });
    }

    // Scenario 2: Mentor accessing assigned student's application
    const mentor = users.find(u => u.role === UserRole.MENTOR);
    if (mentor) {
      const mentorContext = {
        userId: mentor.id,
        role: mentor.role,
        permissions: rbacService.getEffectivePermissions(mentor.role),
        organizationId: mentor.organizationId
      };

      const studentAppAccess = await rbacService.authorize(
        mentorContext,
        Resource.APPLICATION,
        Action.READ,
        'app-001'
      );

      scenarios.push({
        name: 'Mentor accessing assigned student application',
        user: mentor.email,
        result: studentAppAccess
      });
    }

    // Scenario 3: Admin managing users
    const admin = users.find(u => u.role === UserRole.ADMIN);
    if (admin) {
      const adminContext = {
        userId: admin.id,
        role: admin.role,
        permissions: rbacService.getEffectivePermissions(admin.role),
        organizationId: admin.organizationId
      };

      const userManagement = await rbacService.authorize(
        adminContext,
        Resource.USER,
        Action.MANAGE
      );

      scenarios.push({
        name: 'Admin managing users',
        user: admin.email,
        result: userManagement
      });
    }

    // Scenario 4: Student trying to access another student's application (should fail)
    if (student) {
      const studentContext = {
        userId: student.id,
        role: student.role,
        permissions: rbacService.getEffectivePermissions(student.role),
        organizationId: student.organizationId
      };

      const otherAppAccess = await rbacService.authorize(
        studentContext,
        Resource.APPLICATION,
        Action.READ,
        'app-003' // Different student's application
      );

      scenarios.push({
        name: 'Student accessing another student\'s application (should fail)',
        user: student.email,
        result: otherAppAccess
      });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        scenarios,
        totalScenarios: scenarios.length,
        timestamp: new Date().toISOString()
      }
    };

    res.json(response);
  }),

  // ============================================
  // SYSTEM STATUS
  // ============================================

  // GET /api/rbac-test/status - Get RBAC system status
  getSystemStatus: asyncHandler(async (req: Request, res: Response) => {
    const users = await generateTestUsers();
    
    const response: ApiResponse = {
      success: true,
      data: {
        rbacSystem: {
          status: 'operational',
          version: '1.0.0',
          features: [
            'Role-based permissions',
            'Resource ownership validation',
            'Audit logging',
            'Rate limiting',
            'Security context validation',
            'Multi-tenant support (ready)'
          ]
        },
        testData: {
          users: users.length,
          organizations: TEST_ORGANIZATIONS.length,
          mentorAssignments: TEST_MENTOR_ASSIGNMENTS.length,
          applications: TEST_APPLICATIONS.length,
          feedback: TEST_FEEDBACK.length
        },
        roles: {
          available: Object.values(UserRole),
          hierarchy: {
            [UserRole.SUPER_ADMIN]: 'Full system access',
            [UserRole.ADMIN]: 'Organization management',
            [UserRole.MENTOR]: 'Student guidance',
            [UserRole.STUDENT]: 'Self-service'
          }
        },
        security: {
          auditingEnabled: true,
          rateLimitingEnabled: true,
          ownershipValidation: true,
          sessionManagement: true
        }
      }
    };

    res.json(response);
  })
};