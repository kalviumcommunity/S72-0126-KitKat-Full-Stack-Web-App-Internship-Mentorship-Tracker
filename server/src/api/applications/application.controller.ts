import { Request, Response } from "express";
import { applicationService } from "./application.service";
import { ApiResponse, PaginatedResponse } from "../../types/api";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, AuthorizationError, NotFoundError } from "../../middlewares/error.middleware";
import { SUCCESS_MESSAGES } from "../../constants/errors";
import { logger } from "../../lib/logger";
import { UserRole } from "@prisma/client";

export class ApplicationController {
  // Create new application (Students only)
  createApplication = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    // Only students can create applications
    if (req.user.role !== UserRole.STUDENT) {
      throw new AuthorizationError("Only students can create applications");
    }

    const application = await applicationService.createApplication(req.user.id, req.body);

    logger.info("Application created", {
      applicationId: application.id,
      userId: req.user.id,
      company: application.company,
      role: application.role,
    });

    const response: ApiResponse = {
      success: true,
      data: { application },
      message: SUCCESS_MESSAGES.APPLICATION_CREATED,
    };

    res.status(201).json(response);
  });

  // Get application by ID (Owner, assigned mentor, or admin)
  getApplication = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { id } = req.params;
    const application = await applicationService.getApplicationById(id, req.user);

    const response: ApiResponse = {
      success: true,
      data: { application },
    };

    res.json(response);
  });

  // List applications with filtering and pagination
  listApplications = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const result = await applicationService.listApplications(req.user, req.query as any);

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        items: result.applications,
        pagination: result.pagination,
      },
    };

    res.json(response);
  });

  // Update application (Owner only)
  updateApplication = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    // Only students can update applications
    if (req.user.role !== UserRole.STUDENT) {
      throw new AuthorizationError("Only students can update applications");
    }

    const { id } = req.params;
    const application = await applicationService.updateApplication(id, req.user.id, req.body);

    logger.info("Application updated", {
      applicationId: id,
      userId: req.user.id,
      updatedFields: Object.keys(req.body),
    });

    const response: ApiResponse = {
      success: true,
      data: { application },
      message: SUCCESS_MESSAGES.APPLICATION_UPDATED,
    };

    res.json(response);
  });

  // Delete application (Owner only)
  deleteApplication = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    // Only students can delete applications
    if (req.user.role !== UserRole.STUDENT) {
      throw new AuthorizationError("Only students can delete applications");
    }

    const { id } = req.params;
    await applicationService.deleteApplication(id, req.user.id);

    logger.info("Application deleted", {
      applicationId: id,
      userId: req.user.id,
    });

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.APPLICATION_DELETED,
    };

    res.json(response);
  });

  // Get application statistics (Owner, assigned mentor, or admin)
  getApplicationStats = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const stats = await applicationService.getApplicationStats(req.user);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.json(response);
  });

  // Bulk update application status (Students only)
  bulkUpdateStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (req.user.role !== UserRole.STUDENT) {
      throw new AuthorizationError("Only students can update application status");
    }

    const { applicationIds, status } = req.body;
    const result = await applicationService.bulkUpdateStatus(applicationIds, status, req.user.id);

    logger.info("Bulk status update", {
      userId: req.user.id,
      applicationIds,
      status,
      updatedCount: result.updatedCount,
    });

    const response: ApiResponse = {
      success: true,
      data: { updatedCount: result.updatedCount },
      message: `${result.updatedCount} applications updated successfully`,
    };

    res.json(response);
  });

  // Export applications (Owner only)
  exportApplications = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (req.user.role !== UserRole.STUDENT) {
      throw new AuthorizationError("Only students can export their applications");
    }

    const exportData = await applicationService.exportApplications(req.user.id, req.query as any);

    const response: ApiResponse = {
      success: true,
      data: { applications: exportData },
      message: "Applications exported successfully",
    };

    res.json(response);
  });
}

export const applicationController = new ApplicationController();

