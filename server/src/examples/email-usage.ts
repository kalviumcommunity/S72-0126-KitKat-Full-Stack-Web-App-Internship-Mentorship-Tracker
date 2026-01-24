/**
 * Email Service Usage Examples
 * Demonstrates how to use the mail service in different scenarios
 */

import { mailService } from '../services/mail.service';
import { logger } from '../lib/logger';

/**
 * Example 1: Send a simple test email
 */
export async function exampleTestEmail() {
  try {
    const result = await mailService.sendTestEmail('user@example.com');
    
    if (result.success) {
      logger.info('Test email sent successfully', { messageId: result.messageId });
    } else {
      logger.error('Failed to send test email', { error: result.error });
    }
  } catch (error) {
    logger.error('Test email example failed', { error });
  }
}

/**
 * Example 2: Send welcome email to new user
 */
export async function exampleWelcomeEmail() {
  try {
    const result = await mailService.sendWelcomeEmail(
      'newuser@example.com',
      'John Doe'
    );
    
    if (result.success) {
      logger.info('Welcome email sent successfully', { messageId: result.messageId });
    } else {
      logger.error('Failed to send welcome email', { error: result.error });
    }
  } catch (error) {
    logger.error('Welcome email example failed', { error });
  }
}

/**
 * Example 3: Send password reset email
 */
export async function examplePasswordResetEmail() {
  try {
    const resetToken = 'sample-reset-token-123';
    const result = await mailService.sendPasswordResetEmail(
      'user@example.com',
      resetToken,
      'John Doe'
    );
    
    if (result.success) {
      logger.info('Password reset email sent successfully', { messageId: result.messageId });
    } else {
      logger.error('Failed to send password reset email', { error: result.error });
    }
  } catch (error) {
    logger.error('Password reset email example failed', { error });
  }
}

/**
 * Example 4: Send custom notification email
 */
export async function exampleNotificationEmail() {
  try {
    const result = await mailService.sendNotificationEmail(
      'user@example.com',
      'Application Status Update',
      'Your internship application has been reviewed and approved!'
    );
    
    if (result.success) {
      logger.info('Notification email sent successfully', { messageId: result.messageId });
    } else {
      logger.error('Failed to send notification email', { error: result.error });
    }
  } catch (error) {
    logger.error('Notification email example failed', { error });
  }
}

/**
 * Example 5: Send custom email with advanced options
 */
export async function exampleAdvancedEmail() {
  try {
    const result = await mailService.sendEmail({
      to: ['user1@example.com', 'user2@example.com'],
      cc: 'manager@example.com',
      subject: 'Project Update - Q1 2024',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Project Update</h2>
          <p>Dear Team,</p>
          <p>Here's the latest update on our Q1 2024 project milestones:</p>
          <ul>
            <li>✅ Phase 1: Completed</li>
            <li>🔄 Phase 2: In Progress</li>
            <li>⏳ Phase 3: Scheduled</li>
          </ul>
          <p>Please review the attached documents for detailed information.</p>
          <p>Best regards,<br>Project Manager</p>
        </div>
      `,
      text: 'Project Update - Q1 2024. Phase 1: Completed, Phase 2: In Progress, Phase 3: Scheduled.',
      replyTo: 'noreply@example.com',
    });
    
    if (result.success) {
      logger.info('Advanced email sent successfully', { messageId: result.messageId });
    } else {
      logger.error('Failed to send advanced email', { error: result.error });
    }
  } catch (error) {
    logger.error('Advanced email example failed', { error });
  }
}

/**
 * Example 6: Check email service status
 */
export function exampleEmailStatus() {
  const status = mailService.getStatus();
  
  logger.info('Email service status', {
    configured: status.configured,
    transporterAvailable: status.transporterAvailable,
    host: status.host,
    port: status.port,
    from: status.from,
  });
  
  return status;
}

/**
 * Example 7: Bulk email sending with error handling
 */
export async function exampleBulkEmails() {
  const recipients = [
    { email: 'user1@example.com', name: 'User One' },
    { email: 'user2@example.com', name: 'User Two' },
    { email: 'user3@example.com', name: 'User Three' },
  ];

  const results: Array<{
    email: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }> = [];

  for (const recipient of recipients) {
    try {
      const result = await mailService.sendWelcomeEmail(recipient.email, recipient.name);
      results.push({
        email: recipient.email,
        success: result.success,
        messageId: result.messageId,
        error: result.error,
      });
      
      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        email: recipient.email,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  logger.info('Bulk email results', { results });
  return results;
}

/**
 * Run all examples (for testing purposes)
 */
export async function runAllExamples() {
  logger.info('Running all email examples...');
  
  // Check status first
  exampleEmailStatus();
  
  // Run examples with delays
  await exampleTestEmail();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleWelcomeEmail();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await examplePasswordResetEmail();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleNotificationEmail();
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await exampleAdvancedEmail();
  
  logger.info('All email examples completed');
}