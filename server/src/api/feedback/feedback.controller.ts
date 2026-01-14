import { Request, Response } from "express";
import { feedbackService } from "./feedback.service";
import { ApiResponse, PaginatedResponse } from "../../types/api";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, AuthorizationError } from "../../middlewares/error.middleware";
import { SUCCESS_MESSAGES } from "../../constants/errors";
import { logger } from "../../lib/logger";
import { UserRole } from "../../types/roles";

export class FeedbackController {
  // Create feedback (Mentors only)
  createFeedback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    // Only mentors can create feedback
    if (req.user.role !== UserRole.MENTOR) {
      throw new AuthorizationError("Only mentors can create feedback");
    }

    const feedback = await feedbackService.createFeedback(req.user.id, req.body);

    logger.info("Feedback created", {
      feedbackId: feedback.id,
      mentorId: req.user.id,
      applicationId: req.body.applicationId,
    });

    const response: ApiResponse = {
      success: true,
      data: { feedback },
      message: SUCCESS_MESSAGES.FEEDBACK_CREATED,
    };

    res.status(201).json(response);
  });

  // Get feedback by ID
  getFeedback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { id } = req.params;
    const feedback = await feedbackService.getFeedbackById(id, req.user);

    const response: ApiResponse = {
      success: true,
      data: { feedback },
    };

    res.json(response);
  });

  // List feedback with filtering and pagination
  listFeedback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const result = await feedbackService.listFeedback(req.user, req.query);

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        items: result.feedback,
        pagination: result.pagination,
      },
    };

    res.json(response);
  });

  // Update feedback (Mentor who created it only)
  updateFeedback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    // Only mentors can update feedback
    if (req.user.role !== UserRole.MENTOR) {
      throw new AuthorizationError("Only mentors can update feedback");
    }

    const { id } = req.params;
    const feedback = await feedbackService.updateFeedback(id, req.user.id, req.body);

    logger.info("Feedback updated", {
      feedbackId: id,
      mentorId: req.user.id,
      updatedFields: Object.keys(req.body),
    });

    const response: ApiResponse = {
      success: true,
      data: { feedback },
      message: SUCCESS_MESSAGES.FEEDBACK_UPDATED,
    };

    res.json(response);
  });

  // Delete feedback (Mentor who created it or admin)
  deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { id } = req.params;
    await feedbackService.deleteFeedback(id, req.user);

    logger.info("Feedback deleted", {
      feedbackId: id,
      userId: req.user.id,
      userRole: req.user.role,
    });

    const response: ApiResponse = {
      success: true,
      message: SUCCESS_MESSAGES.FEEDBACK_DELETED,
    };

    res.json(response);
  });

  // Get feedback statistics
  getFeedbackStats = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const stats = await feedbackService.getFeedbackStats(req.user);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.json(response);
  });

  // Get feedback for a specific application
  getApplicationFeedback = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { applicationId } = req.params;
    const feedback = await feedbackService.getFeedbackForApplication(applicationId, req.user);

    const response: ApiResponse = {
      success: true,
      data: { feedback },
    };

    res.json(response);
  });
}

export const feedbackController = new FeedbackController();
