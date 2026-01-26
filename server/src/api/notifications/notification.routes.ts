import { Router } from "express";
import { notificationController } from "./notification.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/notifications
 * @desc    Get user notifications with pagination
 * @access  Private
 */
router.get("/", notificationController.getNotifications);

/**
 * @route   GET /api/notifications/unread
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get("/unread", notificationController.getUnreadCount);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put("/:id/read", notificationController.markAsRead);

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put("/read-all", notificationController.markAllAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete("/:id", notificationController.deleteNotification);

export default router;