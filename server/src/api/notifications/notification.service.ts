import { prisma } from "../../lib/prisma";
import { NotFoundError, AuthorizationError } from "../../middlewares/error.middleware";
import { logger } from "../../lib/logger";
import { NotificationQueryParams } from "./notification.schema";
import { NotificationType } from "@prisma/client";

export class NotificationService {
  /**
   * Get user notifications with pagination
   */
  async getNotifications(userId: string, queryParams: any) {
    const {
      page = 1,
      limit = 20,
      read,
      type,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryParams;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId,
    };

    if (read !== undefined) {
      where.read = read;
    }

    if (type) {
      where.type = type;
    }

    // Get notifications with pagination
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    // Update notification
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    logger.info("Notification marked as read", {
      notificationId,
      userId,
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    logger.info("All notifications marked as read", {
      userId,
      count: result.count,
    });

    return result.count;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<void> {
    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    // Delete notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    logger.info("Notification deleted", {
      notificationId,
      userId,
    });
  }

  /**
   * Create notification
   */
  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
  }): Promise<void> {
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        read: false,
      },
    });

    logger.info("Notification created", {
      userId: data.userId,
      type: data.type,
      title: data.title,
    });
  }
}

export const notificationService = new NotificationService();