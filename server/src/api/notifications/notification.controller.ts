import { Request, Response } from "express";
import { notificationService } from "./notification.service";
import { ApiResponse, PaginatedResponse } from "../../types/api";
import { asyncHandler } from "../../middlewares/error.middleware";
import { AuthenticationError, ValidationError } from "../../middlewares/error.middleware";
import { logger } from "../../lib/logger";

export class NotificationController {
  /**
   * Get user notifications with pagination
   */
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const result = await notificationService.getNotifications(req.user.id, req.query);

    const response: PaginatedResponse<any> = {
      items: result.notifications,
      pagination: result.pagination,
    };

    res.json(response);
  });

  /**
   * Get unread notifications count
   */
  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const count = await notificationService.getUnreadCount(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: { count },
    };

    res.json(response);
  });

  /**
   * Mark notification as read
   */
  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { id } = req.params;

    if (!id) {
      throw new ValidationError("Notification ID is required");
    }

    await notificationService.markAsRead(id, req.user.id);

    logger.info("Notification marked as read", {
      userId: req.user.id,
      notificationId: id,
    });

    const response: ApiResponse = {
      success: true,
      message: "Notification marked as read",
    };

    res.json(response);
  });

  /**
   * Mark all notifications as read
   */
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const count = await notificationService.markAllAsRead(req.user.id);

    logger.info("All notifications marked as read", {
      userId: req.user.id,
      count,
    });

    const response: ApiResponse = {
      success: true,
      data: { count },
      message: `${count} notifications marked as read`,
    };

    res.json(response);
  });

  /**
   * Delete notification
   */
  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    const { id } = req.params;

    if (!id) {
      throw new ValidationError("Notification ID is required");
    }

    await notificationService.deleteNotification(id, req.user.id);

    logger.info("Notification deleted", {
      userId: req.user.id,
      notificationId: id,
    });

    const response: ApiResponse = {
      success: true,
      message: "Notification deleted successfully",
    };

    res.json(response);
  });
}

export const notificationController = new NotificationController();