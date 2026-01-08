import { Router } from "express";
import { feedbackController } from "./feedback.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createFeedbackSchema,
  updateFeedbackSchema,
  getFeedbackSchema,
  listFeedbackSchema,
  deleteFeedbackSchema,
} from "./feedback.schema";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { UserRole } from "../../types/roles";

const router = Router();

// All routes require authentication
router.use(authenticate);

// List feedback - all authenticated users
router.get(
  "/",
  validate(listFeedbackSchema),
  feedbackController.listFeedback.bind(feedbackController)
);

// Get feedback by ID - all authenticated users (with permission checks)
router.get(
  "/:id",
  validate(getFeedbackSchema),
  feedbackController.getFeedback.bind(feedbackController)
);

// Create feedback - MENTOR only
router.post(
  "/",
  requireRole(UserRole.MENTOR),
  validate(createFeedbackSchema),
  feedbackController.createFeedback.bind(feedbackController)
);

// Update feedback - MENTOR only
router.put(
  "/:id",
  requireRole(UserRole.MENTOR),
  validate(updateFeedbackSchema),
  feedbackController.updateFeedback.bind(feedbackController)
);

// Delete feedback - MENTOR only
router.delete(
  "/:id",
  requireRole(UserRole.MENTOR),
  validate(deleteFeedbackSchema),
  feedbackController.deleteFeedback.bind(feedbackController)
);

export default router;

