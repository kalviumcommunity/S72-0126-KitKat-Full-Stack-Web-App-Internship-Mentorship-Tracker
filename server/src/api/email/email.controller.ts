import { Request, Response } from 'express';
import { mailService } from '../../services/mail.service';
import { logger } from '../../lib/logger';
import { asyncHandler } from '../../middlewares/error.middleware';

/**
 * Email Controller
 * Handles email-related API endpoints for testing and management
 */

/**
 * Send test email to verify Mailtrap integration
 */
export const sendTestEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  // Validate email address
  if (!email) {
    res.status(400).json({
      success: false,
      message: 'Email address is required',
    });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Invalid email address format',
    });
    return;
  }

  try {
    logger.info('Sending test email', { email });

    const result = await mailService.sendTestEmail(email);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        data: {
          recipient: email,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Test email error', { error, email });
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending test email',
    });
  }
});

/**
 * Get email service status
 */
export const getEmailStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const status = mailService.getStatus();

    res.status(200).json({
      success: true,
      message: 'Email service status retrieved',
      data: status,
    });
  } catch (error) {
    logger.error('Email status error', { error });
    res.status(500).json({
      success: false,
      message: 'Failed to get email service status',
    });
  }
});

/**
 * Send welcome email (example usage)
 */
export const sendWelcomeEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, userName } = req.body;

  if (!email || !userName) {
    res.status(400).json({
      success: false,
      message: 'Email and userName are required',
    });
    return;
  }

  try {
    const result = await mailService.sendWelcomeEmail(email, userName);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Welcome email error', { error, email, userName });
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending welcome email',
    });
  }
});

/**
 * Send custom notification email
 */
export const sendNotificationEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    res.status(400).json({
      success: false,
      message: 'Email, subject, and message are required',
    });
    return;
  }

  try {
    const result = await mailService.sendNotificationEmail(email, subject, message);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Notification email sent successfully',
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send notification email',
        error: result.error,
      });
    }
  } catch (error) {
    logger.error('Notification email error', { error, email, subject });
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending notification email',
    });
  }
});