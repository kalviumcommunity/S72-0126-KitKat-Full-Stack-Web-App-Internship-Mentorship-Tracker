import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/env";
import { logger } from "./logger";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
        logger.warn("Email service not configured - emails will be logged only");
        this.isConfigured = false;
        return;
      }

      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      this.isConfigured = true;
      logger.info("Email service initialized", {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
      });
    } catch (error) {
      logger.error("Failed to initialize email service", { error });
      this.isConfigured = false;
    }
  }

  async send(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.isConfigured || !this.transporter) {
        logger.info("Email would be sent (service not configured)", {
          to: options.to,
          subject: options.subject,
        });
        return false;
      }

      const mailOptions = {
        from: options.from || env.SMTP_FROM || env.SMTP_USER,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info("Email sent successfully", {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error("Failed to send email", {
        error,
        to: options.to,
        subject: options.subject,
      });
      return false;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate(name);
    return this.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<boolean> {
    const template = this.getPasswordResetEmailTemplate(name, resetToken);
    return this.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendFeedbackNotification(
    to: string,
    studentName: string,
    mentorName: string,
    applicationCompany: string,
    feedbackPreview: string
  ): Promise<boolean> {
    const template = this.getFeedbackNotificationTemplate(
      studentName,
      mentorName,
      applicationCompany,
      feedbackPreview
    );
    return this.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendApplicationStatusUpdate(
    to: string,
    studentName: string,
    company: string,
    role: string,
    oldStatus: string,
    newStatus: string
  ): Promise<boolean> {
    const template = this.getApplicationStatusUpdateTemplate(
      studentName,
      company,
      role,
      oldStatus,
      newStatus
    );
    return this.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  async sendMentorAssignmentEmail(
    to: string,
    studentName: string,
    mentorName: string,
    isStudent: boolean
  ): Promise<boolean> {
    const template = this.getMentorAssignmentTemplate(studentName, mentorName, isStudent);
    return this.send({
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  // Email Templates
  private getWelcomeEmailTemplate(name: string): EmailTemplate {
    const subject = "Welcome to UIMP - Unified Internship & Mentorship Portal";
    const text = `
Hello ${name},

Welcome to the Unified Internship & Mentorship Portal (UIMP)!

We're excited to have you on board. UIMP is designed to help you track your internship applications and receive valuable feedback from experienced mentors.

Getting Started:
1. Complete your profile
2. Start tracking your applications
3. Connect with mentors
4. Receive personalized feedback

If you have any questions, feel free to reach out to our support team.

Best regards,
The UIMP Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to UIMP!</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>Welcome to the <strong>Unified Internship & Mentorship Portal (UIMP)</strong>!</p>
      <p>We're excited to have you on board. UIMP is designed to help you track your internship applications and receive valuable feedback from experienced mentors.</p>
      
      <h3>Getting Started:</h3>
      <ul>
        <li>Complete your profile</li>
        <li>Start tracking your applications</li>
        <li>Connect with mentors</li>
        <li>Receive personalized feedback</li>
      </ul>
      
      <a href="${env.CORS_ORIGIN}/dashboard" class="button">Go to Dashboard</a>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 UIMP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, text, html };
  }

  private getPasswordResetEmailTemplate(name: string, resetToken: string): EmailTemplate {
    const subject = "Password Reset Request - UIMP";
    const resetUrl = `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`;

    const text = `
Hello ${name},

We received a request to reset your password for your UIMP account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email.

Best regards,
The UIMP Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password for your UIMP account.</p>
      
      <a href="${resetUrl}" class="button">Reset Password</a>
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong>
        <ul>
          <li>This link will expire in 1 hour</li>
          <li>If you didn't request this reset, please ignore this email</li>
          <li>Never share this link with anyone</li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <p>&copy; 2024 UIMP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, text, html };
  }

  private getFeedbackNotificationTemplate(
    studentName: string,
    mentorName: string,
    applicationCompany: string,
    feedbackPreview: string
  ): EmailTemplate {
    const subject = `New Feedback from ${mentorName} - ${applicationCompany}`;

    const text = `
Hello ${studentName},

You have received new feedback from ${mentorName} on your ${applicationCompany} application.

Feedback Preview:
${feedbackPreview}

Log in to your UIMP dashboard to view the complete feedback and take action.

Best regards,
The UIMP Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10B981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .feedback-box { background: white; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 New Feedback Received!</h1>
    </div>
    <div class="content">
      <h2>Hello ${studentName},</h2>
      <p>You have received new feedback from <strong>${mentorName}</strong> on your <strong>${applicationCompany}</strong> application.</p>
      
      <div class="feedback-box">
        <h3>Feedback Preview:</h3>
        <p>${feedbackPreview}</p>
      </div>
      
      <a href="${env.CORS_ORIGIN}/dashboard/applications" class="button">View Full Feedback</a>
      
      <p>Log in to your UIMP dashboard to view the complete feedback and take action on the recommendations.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 UIMP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, text, html };
  }

  private getApplicationStatusUpdateTemplate(
    studentName: string,
    company: string,
    role: string,
    oldStatus: string,
    newStatus: string
  ): EmailTemplate {
    const subject = `Application Status Update - ${company}`;

    const text = `
Hello ${studentName},

Your application status for ${role} at ${company} has been updated.

Previous Status: ${oldStatus}
New Status: ${newStatus}

Log in to your UIMP dashboard to view more details.

Best regards,
The UIMP Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .status-box { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .status-change { display: flex; align-items: center; justify-content: center; gap: 10px; margin: 20px 0; }
    .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; }
    .status-old { background: #E5E7EB; color: #6B7280; }
    .status-new { background: #10B981; color: white; }
    .button { display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Application Status Update</h1>
    </div>
    <div class="content">
      <h2>Hello ${studentName},</h2>
      <p>Your application status for <strong>${role}</strong> at <strong>${company}</strong> has been updated.</p>
      
      <div class="status-box">
        <div class="status-change">
          <span class="status status-old">${oldStatus}</span>
          <span>→</span>
          <span class="status status-new">${newStatus}</span>
        </div>
      </div>
      
      <a href="${env.CORS_ORIGIN}/dashboard/applications" class="button">View Application</a>
      
      <p>Log in to your UIMP dashboard to view more details and next steps.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 UIMP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { subject, text, html };
  }

  private getMentorAssignmentTemplate(
    studentName: string,
    mentorName: string,
    isStudent: boolean
  ): EmailTemplate {
    const subject = isStudent
      ? `New Mentor Assigned - ${mentorName}`
      : `New Student Assigned - ${studentName}`;

    const text = isStudent
      ? `
Hello ${studentName},

Great news! ${mentorName} has been assigned as your mentor.

Your mentor will help you with:
- Application reviews
- Resume feedback
- Interview preparation
- Career guidance

Log in to your UIMP dashboard to connect with your mentor.

Best regards,
The UIMP Team
      `.trim()
      : `
Hello ${mentorName},

You have been assigned as a mentor to ${studentName}.

As a mentor, you can:
- Review their applications
- Provide feedback
- Guide their career development
- Share your expertise

Log in to your UIMP dashboard to start mentoring.

Best regards,
The UIMP Team
      `.trim();

    const html = isStudent
      ? `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .mentor-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 New Mentor Assigned!</h1>
    </div>
    <div class="content">
      <h2>Hello ${studentName},</h2>
      <p>Great news! <strong>${mentorName}</strong> has been assigned as your mentor.</p>
      
      <div class="mentor-box">
        <h3>Your Mentor: ${mentorName}</h3>
        <p>Your mentor will help you with:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Application reviews</li>
          <li>Resume feedback</li>
          <li>Interview preparation</li>
          <li>Career guidance</li>
        </ul>
      </div>
      
      <a href="${env.CORS_ORIGIN}/dashboard" class="button">Connect with Mentor</a>
    </div>
    <div class="footer">
      <p>&copy; 2024 UIMP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `.trim()
      : `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .student-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👨‍🎓 New Student Assigned!</h1>
    </div>
    <div class="content">
      <h2>Hello ${mentorName},</h2>
      <p>You have been assigned as a mentor to <strong>${studentName}</strong>.</p>
      
      <div class="student-box">
        <h3>Your Student: ${studentName}</h3>
        <p>As a mentor, you can:</p>
        <ul style="text-align: left; display: inline-block;">
          <li>Review their applications</li>
          <li>Provide feedback</li>
          <li>Guide their career development</li>
          <li>Share your expertise</li>
        </ul>
      </div>
      
      <a href="${env.CORS_ORIGIN}/dashboard" class="button">Start Mentoring</a>
    </div>
    <div class="footer">
      <p>&copy; 2024 UIMP. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `.trim();

    return { subject, text, html };
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

// Export singleton instance
export const emailService = new EmailService();
