import { Router } from "express";
import { applicationController } from "./application.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createApplicationSchema,
  updateApplicationSchema,
  getApplicationSchema,
  listApplicationsSchema,
  deleteApplicationSchema,
} from "./application.schema";
import { authenticate } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { UserRole } from "../../types/roles";

const router = Router();

// All routes require authentication
router.use(authenticate);

// List applications - all authenticated users
router.get(
  "/",
  validate(listApplicationsSchema),
  applicationController.listApplications.bind(applicationController)
);

// Get application by ID - all authenticated users (with permission checks)
router.get(
  "/:id",
  validate(getApplicationSchema),
  applicationController.getApplication.bind(applicationController)
);

// Create application - STUDENT only
router.post(
  "/",
  requireRole(UserRole.STUDENT),
  validate(createApplicationSchema),
  applicationController.createApplication.bind(applicationController)
);

// Update application - STUDENT only
router.put(
  "/:id",
  requireRole(UserRole.STUDENT),
  validate(updateApplicationSchema),
  applicationController.updateApplication.bind(applicationController)
);

// Delete application - STUDENT only
router.delete(
  "/:id",
  requireRole(UserRole.STUDENT),
  validate(deleteApplicationSchema),
  applicationController.deleteApplication.bind(applicationController)
);

export default router;

