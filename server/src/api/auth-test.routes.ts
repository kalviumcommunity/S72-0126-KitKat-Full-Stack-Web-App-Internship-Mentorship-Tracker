import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware";
import { 
  requireStudent, 
  requireMentor, 
  requireAdmin,
  requireMentorOrAdmin,
  requireMinMentor,
  requireSelfOrAdmin,
  requireMentorAccess,
} from "../middlewares/rbac.middleware";
import { validateParams } from "../middlewares/validation.middleware";
import { z } from "zod";

const router = Router();

// Public route (no authentication required)
router.get("/public", asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "This is a public route - no authentication required",
    timestamp: new Date().toISOString(),
  });
}));

// Optional authentication route
router.get("/optional-auth", 
  optionalAuthenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route has optional authentication",
      user: req.user || null,
      authenticated: !!req.user,
    });
  })
);

// Protected route (authentication required)
router.get("/protected", 
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This is a protected route - authentication required",
      user: {
        id: req.user!.id,
        email: req.user!.email,
        role: req.user!.role,
      },
    });
  })
);

// Student only route
router.get("/student-only", 
  authenticate,
  requireStudent,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route is accessible only by students",
      user: req.user,
    });
  })
);

// Mentor only route
router.get("/mentor-only", 
  authenticate,
  requireMentor,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route is accessible only by mentors",
      user: req.user,
    });
  })
);

// Admin only route
router.get("/admin-only", 
  authenticate,
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route is accessible only by admins",
      user: req.user,
    });
  })
);

// Mentor or Admin route
router.get("/mentor-or-admin", 
  authenticate,
  requireMentorOrAdmin,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route is accessible by mentors or admins",
      user: req.user,
    });
  })
);

// Minimum mentor role (mentor or admin)
router.get("/min-mentor", 
  authenticate,
  requireMinMentor,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route requires minimum mentor role (mentor or admin)",
      user: req.user,
    });
  })
);

// Self or admin access (user can access their own data or admin can access any)
router.get("/profile/:id", 
  authenticate,
  validateParams(z.object({ id: z.string().uuid() })),
  requireSelfOrAdmin,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route allows self-access or admin access",
      requestedUserId: req.params.id,
      currentUser: req.user,
      isSelf: req.user!.id === req.params.id,
      isAdmin: req.user!.role === "ADMIN",
    });
  })
);

// Mentor access to student data
router.get("/student-data/:studentId", 
  authenticate,
  validateParams(z.object({ studentId: z.string().uuid() })),
  requireMentorAccess((req) => req.params.studentId),
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "This route allows mentor access to assigned student data",
      studentId: req.params.studentId,
      currentUser: req.user,
    });
  })
);

// Role hierarchy demonstration
router.get("/role-info", 
  authenticate,
  asyncHandler(async (req, res) => {
    const roleHierarchy = {
      ADMIN: { level: 3, permissions: ["all"] },
      MENTOR: { level: 2, permissions: ["view_students", "create_feedback", "view_applications"] },
      STUDENT: { level: 1, permissions: ["view_own_data", "create_applications"] },
    };

    res.json({
      success: true,
      message: "Role hierarchy and permissions information",
      currentUser: req.user,
      roleHierarchy,
      userPermissions: roleHierarchy[req.user!.role as keyof typeof roleHierarchy],
    });
  })
);

// Test JWT token info
router.get("/token-info", 
  authenticate,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: "JWT token information",
      tokenData: req.user,
      issuedAt: req.user!.iat ? new Date(req.user!.iat * 1000).toISOString() : null,
      expiresAt: req.user!.exp ? new Date(req.user!.exp * 1000).toISOString() : null,
      timeUntilExpiry: req.user!.exp ? Math.max(0, req.user!.exp - Math.floor(Date.now() / 1000)) : null,
    });
  })
);

export default router;