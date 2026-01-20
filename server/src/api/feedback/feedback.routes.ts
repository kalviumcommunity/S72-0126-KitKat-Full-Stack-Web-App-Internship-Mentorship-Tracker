import { Router } from "express";
import { z } from "zod";
import { feedbackController } from "./feedback.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole, requireMentor, requireMentorOrAdmin } from "../../middlewares/rbac.middleware";
import { validateBody, validateQuery, validateParams } from "../../middlewares/validation.middleware";
import { 
  createFeedbackSchema, 
  updateFeedbackSchema, 
  feedbackQuerySchema,
  uuidParamSchema 
} from "./feedback.schema";
import { rateLimit } from "../../middlewares/rate-limit.middleware";
import { UserRole } from "../../types/roles";

const router = Router();

// All feedback routes require authentication
router.use(authenticate);

// Rate limiters
const feedbackCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 feedback per 15 minutes
  message: "Too many feedback submissions, please try again later",
});

const feedbackReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100, // 100 requests per 15 minutes
  message: "Too many requests, please try again later",
});

/**
 * @route   POST /api/feedback
 * @desc    Create new feedback (Mentors only)
 * @access  Private (Mentor)
 */
router.post(
  "/",
  requireMentor,
  feedbackCreateLimiter,
  validateBody(createFeedbackSchema),
  feedbackController.createFeedback
);

/**
 * @route   GET /api/feedback
 * @desc    List all feedback with filters (role-based access)
 * @access  Private (All authenticated users)
 */
router.get(
  "/",
  feedbackReadLimiter,
  validateQuery(feedbackQuerySchema),
  feedbackController.listFeedback
);

/**
 * @route   GET /api/feedback/stats
 * @desc    Get feedback statistics
 * @access  Private (All authenticated users)
 */
router.get(
  "/stats",
  feedbackReadLimiter,
  feedbackController.getFeedbackStats
);

/**
 * @route   GET /api/feedback/application/:applicationId
 * @desc    Get all feedback for a specific application
 * @access  Private (Student owner, assigned mentor, or admin)
 */
router.get(
  "/application/:applicationId",
  feedbackReadLimiter,
  validateParams(z.object({
    applicationId: z.string().uuid("Invalid application ID"),
  })),
  feedbackController.getApplicationFeedback
);

/**
 * @route   GET /api/feedback/:id
 * @desc    Get feedback by ID
 * @access  Private (Student owner, mentor who created it, assigned mentor, or admin)
 */
router.get(
  "/:id",
  feedbackReadLimiter,
  validateParams(uuidParamSchema),
  feedbackController.getFeedback
);

/**
 * @route   PATCH /api/feedback/:id
 * @desc    Update feedback (Mentor who created it only)
 * @access  Private (Mentor owner)
 */
router.patch(
  "/:id",
  requireMentor,
  feedbackCreateLimiter,
  validateParams(uuidParamSchema),
  validateBody(updateFeedbackSchema),
  feedbackController.updateFeedback
);

/**
 * @route   DELETE /api/feedback/:id
 * @desc    Delete feedback (Mentor who created it or admin)
 * @access  Private (Mentor owner or Admin)
 */
router.delete(
  "/:id",
  requireMentorOrAdmin,
  validateParams(uuidParamSchema),
  feedbackController.deleteFeedback
);

export default router;
