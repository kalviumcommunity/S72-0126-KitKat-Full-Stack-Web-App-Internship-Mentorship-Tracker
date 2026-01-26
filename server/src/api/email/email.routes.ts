import { Router } from 'express';
import {
  sendTestEmail,
  getEmailStatus,
  sendWelcomeEmail,
  sendNotificationEmail,
} from './email.controller';

/**
 * Email Routes
 * Handles email-related API endpoints
 */

const router = Router();

/**
 * @route   POST /api/email/test
 * @desc    Send test email to verify Mailtrap integration
 * @access  Public (in development) / Private (in production)
 * @body    { email: string }
 */
router.post('/test', sendTestEmail);

/**
 * @route   GET /api/email/status
 * @desc    Get email service configuration status
 * @access  Public (in development) / Private (in production)
 */
router.get('/status', getEmailStatus);

/**
 * @route   POST /api/email/welcome
 * @desc    Send welcome email to new user
 * @access  Private
 * @body    { email: string, userName: string }
 */
router.post('/welcome', sendWelcomeEmail);

/**
 * @route   POST /api/email/notification
 * @desc    Send custom notification email
 * @access  Private
 * @body    { email: string, subject: string, message: string }
 */
router.post('/notification', sendNotificationEmail);

export default router;