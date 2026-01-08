import { Request, Response } from "express";
import { feedbackService } from "./feedback.service";
import { ApiResponse } from "../../types/api";
import { logger } from "../../lib/logger";
import { UserRole } from "../../types/roles";

export class FeedbackController {
  async createFeedback(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
        return res.status(401).json(response);
      }

      if (req.user.role !== UserRole.MENTOR) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only mentors can create feedback",
          },
        };
        return res.status(403).json(response);
      }

      const feedback = await feedbackService.createFeedback(req.user.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: { feedback },
        message: "Feedback created successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error("Create feedback controller error", error);
      
      if (error instanceof Error) {
        if (error.message === "Application not found") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          };
          return res.status(404).json(response);
        }
      }

      throw error;
    }
  }

  async getFeedback(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
        return res.status(401).json(response);
      }

      const feedback = await feedbackService.getFeedbackById(req.params.id, req.user);

      const response: ApiResponse = {
        success: true,
        data: { feedback },
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get feedback controller error", error);
      
      if (error instanceof Error) {
        if (error.message === "Feedback not found") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          };
          return res.status(404).json(response);
        }
        if (error.message === "Forbidden") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "Insufficient permissions",
            },
          };
          return res.status(403).json(response);
        }
      }

      throw error;
    }
  }

  async listFeedback(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
        return res.status(401).json(response);
      }

      const result = await feedbackService.listFeedback(req.user, req.query as any);

      const response: ApiResponse = {
        success: true,
        data: {
          feedback: result.feedback,
          pagination: result.pagination,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("List feedback controller error", error);
      throw error;
    }
  }

  async updateFeedback(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
        return res.status(401).json(response);
      }

      if (req.user.role !== UserRole.MENTOR) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only mentors can update feedback",
          },
        };
        return res.status(403).json(response);
      }

      const feedback = await feedbackService.updateFeedback(
        req.params.id,
        req.user.id,
        req.body
      );

      const response: ApiResponse = {
        success: true,
        data: { feedback },
        message: "Feedback updated successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Update feedback controller error", error);
      
      if (error instanceof Error) {
        if (error.message === "Feedback not found") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          };
          return res.status(404).json(response);
        }
        if (error.message === "Forbidden") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You can only update your own feedback",
            },
          };
          return res.status(403).json(response);
        }
      }

      throw error;
    }
  }

  async deleteFeedback(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        };
        return res.status(401).json(response);
      }

      if (req.user.role !== UserRole.MENTOR) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only mentors can delete feedback",
          },
        };
        return res.status(403).json(response);
      }

      await feedbackService.deleteFeedback(req.params.id, req.user.id);

      const response: ApiResponse = {
        success: true,
        message: "Feedback deleted successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete feedback controller error", error);
      
      if (error instanceof Error) {
        if (error.message === "Feedback not found") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: error.message,
            },
          };
          return res.status(404).json(response);
        }
        if (error.message === "Forbidden") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You can only delete your own feedback",
            },
          };
          return res.status(403).json(response);
        }
      }

      throw error;
    }
  }
}

export const feedbackController = new FeedbackController();

