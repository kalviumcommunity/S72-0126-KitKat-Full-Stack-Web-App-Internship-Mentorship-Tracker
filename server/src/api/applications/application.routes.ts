import { Router } from "express";
import { applicationController } from "./application.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { 
  requireStudentAccess,
  canCreateApplication,
  canReadApplication,
  canUpdateApplication,
  canDeleteApplication
} from "../../middlewares/rbac.middleware";
import { validateBody, validateParams, validateQuery } from "../../middlewares/validation.middleware";
import { schemas } from "../../lib/validation";
import { rateLimiters } from "../../middlewares/rate-limit.middleware";
import {
  requireApplicationAccess,
  requireModifiableApplication,
  preventDuplicateApplication,
  validateStatusTransition,
  logApplicationAccess,
  sanitizeApplicationData,
  checkApplicationLimits,
} from "../../middlewares/application-security.middleware";
import { z } from "zod";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Apply logging to all application routes
router.use(logApplicationAccess());

// List applications with filtering and pagination
// Students see their own, mentors see assigned students', admins see all
router.get(
  "/",
  rateLimiters.general,
  validateQuery(schemas.application.list),
  applicationController.listApplications
);

// Get application statistics
router.get(
  "/stats/overview",
  rateLimiters.general,
  applicationController.getApplicationStats
);

// Export applications (Students only, own applications)
router.get(
  "/export/data",
  requireStudentAccess,
  rateLimiters.general,
  validateQuery(z.object({
    status: schemas.application.create.shape.status.optional(),
    platform: schemas.application.create.shape.platform.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })),
  applicationController.exportApplications
);

// Get application by ID with comprehensive access control
router.get(
  "/:id",
  rateLimiters.general,
  validateParams(schemas.application.getById),
  requireApplicationAccess(),
  applicationController.getApplication
);

// Create new application (Students only) with comprehensive security
router.post(
  "/",
  requireStudentAccess,
  rateLimiters.general,
  sanitizeApplicationData(),
  checkApplicationLimits(),
  preventDuplicateApplication(),
  validateBody(schemas.application.create),
  applicationController.createApplication
);

// Update application with comprehensive security
router.put(
  "/:id",
  requireStudentAccess,
  rateLimiters.general,
  validateParams(schemas.application.getById),
  requireApplicationAccess(),
  requireModifiableApplication(),
  sanitizeApplicationData(),
  preventDuplicateApplication(),
  validateStatusTransition(),
  validateBody(schemas.application.update),
  applicationController.updateApplication
);

// Delete application with comprehensive security
router.delete(
  "/:id",
  requireStudentAccess,
  rateLimiters.general,
  validateParams(schemas.application.delete),
  requireApplicationAccess(),
  requireModifiableApplication(),
  applicationController.deleteApplication
);

// Bulk update application status (Students only) with security
router.patch(
  "/bulk/status",
  requireStudentAccess,
  rateLimiters.general,
  validateBody(z.object({
    applicationIds: z.array(z.string().uuid()).min(1).max(50), // Max 50 applications at once
    status: schemas.application.create.shape.status,
  })),
  applicationController.bulkUpdateStatus
);

export default router;

