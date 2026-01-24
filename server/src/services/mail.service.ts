import { getMailTransporter, getDefaultMailOptions, isMailConfigured } from '../config/mail';
import { logger } from '../lib/logger';

/**
 * Mail Service
 * Production-ready email service with proper error handling and logging
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class MailService {
  private transporter = getMailTransporter();

  /**
   * Send email using Mailtrap Sandbox SMTP
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    // Check if email is configured
    if (!isMailConfigured()) {
      logger.warn('Email not configured. Skipping email send.', { to: options.to, subject: options.subject });
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    // Check if transporter is available
    if (!this.transporter) {
      logger.error('Mail transporter not available', { to: options.to, subject: options.subject });
      return {
        success: false,
        error: 'Mail transporter not available'
      };
    }

    try {
      const defaultOptions = getDefaultMailOptions();
      
      // Prepare mail options
      const mailOptions = {
        ...defaultOptions,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: Array.isArray(options.cc) ? options.cc.join(', ') : options.cc,
        bcc: Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments,
      };

      // Validate required fields
      if (!mailOptions.to) {
        throw new Error('Recipient email address is required');
      }

      if (!mailOptions.subject) {
        throw new Error('Email subject is required');
      }

      if (!mailOptions.text && !mailOptions.html) {
        throw new Error('Email content (text or html) is required');
      }

      logger.info('Sending email', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        hasHtml: !!mailOptions.html,
        hasText: !!mailOptions.text,
      });

      // Send email
      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error('Failed to send email', {
        error: errorMessage,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(to: string, userName: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: 'Welcome to Our Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome, ${userName}!</h2>
          <p>Thank you for joining our platform. We're excited to have you on board!</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
      text: `Welcome, ${userName}! Thank you for joining our platform. We're excited to have you on board!`,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, resetToken: string, userName: string): Promise<EmailResult> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
      text: `Hello ${userName}, You requested a password reset. Visit this link to reset your password: ${resetUrl}. This link will expire in 1 hour.`,
    });
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(to: string, subject: string, message: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p>${message}</p>
          <p>Best regards,<br>The Team</p>
        </div>
      `,
      text: message,
    });
  }

  /**
   * Test email functionality
   */
  async sendTestEmail(to: string): Promise<EmailResult> {
    return this.sendEmail({
      to,
      subject: 'Test Email - Mailtrap Integration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">✅ Email Test Successful!</h2>
          <p>This is a test email to verify that your Mailtrap Sandbox SMTP integration is working correctly.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>SMTP Host: ${process.env.SMTP_HOST}</li>
            <li>SMTP Port: ${process.env.SMTP_PORT}</li>
            <li>From: ${process.env.SMTP_FROM}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
          </ul>
          <p>If you received this email in your Mailtrap inbox, your email configuration is working perfectly!</p>
          <p>Best regards,<br>Your Development Team</p>
        </div>
      `,
      text: `Email Test Successful! This is a test email to verify that your Mailtrap Sandbox SMTP integration is working correctly. Timestamp: ${new Date().toISOString()}`,
    });
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      configured: isMailConfigured(),
      transporterAvailable: !!this.transporter,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      from: process.env.SMTP_FROM,
    };
  }
}

// Export singleton instance
export const mailService = new MailService();