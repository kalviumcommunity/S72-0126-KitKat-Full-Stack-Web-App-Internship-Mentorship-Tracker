import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { 
  requireAdmin, 
  requireSelfOrAdmin, 
  requireMentorOrAdmin,
  requireOwnershipOrAdmin,
  requireMentorAccess,
} from "../../middlewares/rbac.middleware";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validation.middleware";
import { schemas } from "../../lib/validation";
import { rateLimiters } from "../../middlewares/rate-limit.middleware";
import { z } from "zod";

const router = Router();

// All user routes require authentication
router.use(authenticate);

// List all users (Admin only)
router.get(
  "/",
  requireAdmin,
  rateLimiters.general,
  validateQuery(schemas.user.listUsers),
  userController.listUsers
);

// Get user by ID (Self, assigned mentor, or admin)
router.get(
  "/:id",
  rateLimiters.general,
  validateParams(schemas.user.getUserById),
  requireMentorAccess((req) => req.params.id),
  userController.getUserById
);

// Update user profile (Self or admin)
router.put(
  "/:id",
  rateLimiters.general,
  validateParams(schemas.user.getUserById),
  validateBody(schemas.user.updateProfile),
  requireSelfOrAdmin,
  userController.updateProfile
);

// Deactivate user (Admin only)
router.post(
  "/:id/deactivate",
  requireAdmin,
  validateParams(schemas.user.getUserById),
  userController.deactivateUser
);

// Activate user (Admin only)
router.post(
  "/:id/activate",
  requireAdmin,
  validateParams(schemas.user.getUserById),
  userController.activateUser
);

// Get user's mentors (Student or admin)
router.get(
  "/:id/mentors",
  rateLimiters.general,
  validateParams(schemas.user.getUserById),
  requireMentorAccess((req) => req.params.id),
  userController.getUserMentors
);

// Get mentor's students (Mentor or admin)
router.get(
  "/:id/students",
  rateLimiters.general,
  validateParams(schemas.user.getUserById),
  requireOwnershipOrAdmin((req) => req.params.id),
  userController.getMentorStudents
);

// Assign mentor to student (Admin only)
router.post(
  "/assign-mentor",
  requireAdmin,
  validateBody(schemas.mentorAssignment.assign),
  userController.assignMentor
);

// Unassign mentor from student (Admin only)
router.post(
  "/unassign-mentor",
  requireAdmin,
  validateBody(schemas.mentorAssignment.unassign),
  userController.unassignMentor
);

export default router;