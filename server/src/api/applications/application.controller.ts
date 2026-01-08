import { Request, Response } from "express";
import { applicationService } from "./application.service";
import { ApiResponse } from "../../types/api";
import { logger } from "../../lib/logger";
import { UserRole } from "../../types/roles";

export class ApplicationController {
  async createApplication(req: Request, res: Response) {
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

      if (req.user.role !== UserRole.STUDENT) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only students can create applications",
          },
        };
        return res.status(403).json(response);
      }

      const application = await applicationService.createApplication(req.user.id, req.body);

      const response: ApiResponse = {
        success: true,
        data: { application },
        message: "Application created successfully",
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error("Create application controller error", error);
      throw error;
    }
  }

  async getApplication(req: Request, res: Response) {
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

      const application = await applicationService.getApplicationById(req.params.id, req.user);

      const response: ApiResponse = {
        success: true,
        data: { application },
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Get application controller error", error);
      
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

  async listApplications(req: Request, res: Response) {
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

      const result = await applicationService.listApplications(req.user, req.query as any);

      const response: ApiResponse = {
        success: true,
        data: {
          applications: result.applications,
          pagination: result.pagination,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("List applications controller error", error);
      throw error;
    }
  }

  async updateApplication(req: Request, res: Response) {
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

      if (req.user.role !== UserRole.STUDENT) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only students can update applications",
          },
        };
        return res.status(403).json(response);
      }

      const application = await applicationService.updateApplication(
        req.params.id,
        req.user.id,
        req.body
      );

      const response: ApiResponse = {
        success: true,
        data: { application },
        message: "Application updated successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Update application controller error", error);
      
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
        if (error.message === "Forbidden") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You can only update your own applications",
            },
          };
          return res.status(403).json(response);
        }
      }

      throw error;
    }
  }

  async deleteApplication(req: Request, res: Response) {
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

      if (req.user.role !== UserRole.STUDENT) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Only students can delete applications",
          },
        };
        return res.status(403).json(response);
      }

      await applicationService.deleteApplication(req.params.id, req.user.id);

      const response: ApiResponse = {
        success: true,
        message: "Application deleted successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      logger.error("Delete application controller error", error);
      
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
        if (error.message === "Forbidden") {
          const response: ApiResponse = {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "You can only delete your own applications",
            },
          };
          return res.status(403).json(response);
        }
      }

      throw error;
    }
  }
}

export const applicationController = new ApplicationController();

