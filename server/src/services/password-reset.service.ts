import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";
import { otpService } from "./otp.service";
import { emailService } from "../lib/email";
import { logger } from "../lib/logger";
import { env } from "../config/env";
import { 
  NotFoundError, 
  AppError, 
  ValidationError 
} from "../middlewares/error.middleware";
import { 
  ForgotPasswordInput, 
  VerifyOtpInput, 
  ResetPasswordInput 
} from "../lib/validation";

/**
 * Password Reset Service
 * 
 * Handles the complete OTP-based password reset flow:
 * 1. Generate OTP and send email
 * 2. Verify OTP
 * 3. Reset password with OTP validation
 * 
 * Special email override behavior for development/testing:
 * - Production: Send OTP to user's actual email
 * - Development: Send OTP to OTP_TEST_EMAIL but use user's email for validation
 */

export class PasswordResetService {
  /**
   * Initiate password reset process
   * Generates OTP and sends email with environment-based recipient override
   */
  async initiatePasswordReset(input: ForgotPasswordInput): Promise<void> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
        },
      });

      if (!user) {
        // Security: Don't reveal if email exists or not
        // Always return success to prevent email enumeration
        logger.warn("Password reset requested for non-existent email", { 
          email: input.email 
        });
        return;
      }

      if (!user.isActive) {
        throw new ValidationError("Account is deactivated");
      }

      // Generate OTP
      const otp = await otpService.generatePasswordResetOtp(user.id, user.email);

      // Determine email recipient based on environment
      const emailRecipient = this.getEmailRecipient(user.email);
      
      // Send OTP email
      await this.sendPasswordResetEmail(
        emailRecipient,
        user.firstName || "User",
        otp,
        user.email // Pass original email for logging/context
      );

      logger.info("Password reset initiated", {
        userId: user.id,
        userEmail: user.email,
        emailSentTo: emailRecipient,
        isTestOverride: emailRecipient !== user.email,
      });

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error("Failed to initiate password reset", { 
        email: input.email, 
        error 
      });
      throw new AppError(
        "Failed to initiate password reset", 
        500, 
        "PASSWORD_RESET_INITIATION_FAILED"
      );
    }
  }

  /**
   * Verify OTP without resetting password
   * Useful for two-step verification flow
   */
  async verifyOtp(input: VerifyOtpInput): Promise<void> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true, email: true, isActive: true },
      });

      if (!user) {
        throw new NotFoundError("User");
      }

      if (!user.isActive) {
        throw new ValidationError("Account is deactivated");
      }

      // Verify OTP
      const isValid = await otpService.verifyPasswordResetOtp(
        user.id,
        user.email,
        input.otp
      );

      if (!isValid) {
        throw new ValidationError("Invalid or expired OTP");
      }

      logger.info("OTP verified successfully", {
        userId: user.id,
        email: user.email,
      });

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error("Failed to verify OTP", { 
        email: input.email, 
        error 
      });
      throw new AppError("Failed to verify OTP", 500, "OTP_VERIFICATION_FAILED");
    }
  }

  /**
   * Reset password with OTP validation
   * Verifies OTP and updates password in a single operation
   */
  async resetPassword(input: ResetPasswordInput): Promise<void> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { id: true, email: true, isActive: true },
      });

      if (!user) {
        throw new NotFoundError("User");
      }

      if (!user.isActive) {
        throw new ValidationError("Account is deactivated");
      }

      // Verify OTP (this will delete the OTP on success)
      const isValid = await otpService.verifyPasswordResetOtp(
        user.id,
        user.email,
        input.otp
      );

      if (!isValid) {
        throw new ValidationError("Invalid or expired OTP");
      }

      // Hash new password
      const newPasswordHash = await hashPassword(input.newPassword);

      // Update password in database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        },
      });

      logger.info("Password reset completed successfully", {
        userId: user.id,
        email: user.email,
      });

    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error("Failed to reset password", { 
        email: input.email, 
        error 
      });
      throw new AppError("Failed to reset password", 500, "PASSWORD_RESET_FAILED");
    }
  }

  /**
   * Determine email recipient based on environment
   * 
   * Development/Testing: Override recipient to OTP_TEST_EMAIL
   * Production: Use actual user email
   * 
   * This allows testing OTP flow without sending emails to real users
   */
  private getEmailRecipient(userEmail: string): string {
    // Check if we should override email for development/testing
    const shouldOverride = env.NODE_ENV !== "production" && env.OTP_TEST_EMAIL;
    
    if (shouldOverride) {
      logger.debug("Email override active", {
        originalEmail: userEmail,
        overrideEmail: env.OTP_TEST_EMAIL,
        environment: env.NODE_ENV,
      });
      return env.OTP_TEST_EMAIL;
    }
    
    return userEmail;
  }

  /**
   * Send password reset email with OTP
   * Includes clear instructions and security information
   */
  private async sendPasswordResetEmail(
    to: string,
    firstName: string,
    otp: string,
    originalEmail?: string
  ): Promise<void> {
    try {
      const subject = "Password Reset - Your OTP Code";
      
      // Email content with security best practices
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            
            <p>Hello ${firstName},</p>
            
            <p>You requested a password reset for your account. Use the following OTP code to reset your password:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
              <h3 style="color: #2c3e50; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h3>
            </div>
            
            <p><strong>Important Security Information:</strong></p>
            <ul>
              <li>This OTP is valid for <strong>10 minutes</strong> only</li>
              <li>This OTP can only be used <strong>once</strong></li>
              <li>Never share this OTP with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
            
            ${originalEmail && originalEmail !== to ? `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0;"><strong>Development Mode:</strong> This email was sent to a test address. The password reset is for account: ${originalEmail}</p>
            </div>
            ` : ''}
            
            <p>If you continue to have problems, please contact our support team.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </body>
        </html>
      `;

      const text = `
Password Reset Request

Hello ${firstName},

You requested a password reset for your account. Use the following OTP code to reset your password:

OTP: ${otp}

Important Security Information:
- This OTP is valid for 10 minutes only
- This OTP can only be used once
- Never share this OTP with anyone
- If you didn't request this reset, please ignore this email

${originalEmail && originalEmail !== to ? 
  `Development Mode: This email was sent to a test address. The password reset is for account: ${originalEmail}` : 
  ''
}

If you continue to have problems, please contact our support team.
      `;

      await emailService.send({
        to,
        subject,
        html,
        text,
      });

      logger.info("Password reset email sent", {
        to,
        originalEmail,
        isTestOverride: originalEmail !== to,
      });

    } catch (error) {
      logger.error("Failed to send password reset email", { 
        to, 
        originalEmail, 
        error 
      });
      throw new AppError(
        "Failed to send password reset email", 
        500, 
        "EMAIL_SEND_FAILED"
      );
    }
  }
}

export const passwordResetService = new PasswordResetService();