import { redis } from "../lib/redis";
import { logger } from "../lib/logger";
import { AppError } from "../middlewares/error.middleware";
import crypto from "crypto";

/**
 * OTP Service for secure password reset functionality
 * 
 * Redis key strategy: password_reset:{userId}
 * - Stores OTP with 10-minute TTL
 * - Single-use (deleted after successful verification)
 * - Includes attempt tracking for brute-force prevention
 */

interface OtpData {
  otp: string;
  userId: string;
  email: string;
  attempts: number;
  createdAt: number;
}

export class OtpService {
  private readonly OTP_TTL = 10 * 60; // 10 minutes in seconds
  private readonly MAX_ATTEMPTS = 5; // Maximum OTP verification attempts
  private readonly ATTEMPT_WINDOW = 15 * 60; // 15 minutes for attempt tracking

  /**
   * Generate cryptographically secure 6-digit OTP
   */
  private generateOtp(): string {
    // Use crypto.randomInt for cryptographically secure random numbers
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Get Redis key for password reset OTP
   */
  private getOtpKey(userId: string): string {
    return `password_reset:${userId}`;
  }

  /**
   * Get Redis key for attempt tracking
   */
  private getAttemptKey(email: string): string {
    return `password_reset_attempts:${email}`;
  }

  /**
   * Generate and store OTP for password reset
   * Returns the generated OTP for email sending
   */
  async generatePasswordResetOtp(userId: string, email: string): Promise<string> {
    try {
      const client = redis.getClient();
      if (!client) {
        throw new AppError("Redis service unavailable", 503, "SERVICE_UNAVAILABLE");
      }

      const otp = this.generateOtp();
      const otpData: OtpData = {
        otp,
        userId,
        email,
        attempts: 0,
        createdAt: Date.now(),
      };

      const key = this.getOtpKey(userId);
      
      // Store OTP data with TTL
      await client.setEx(key, this.OTP_TTL, JSON.stringify(otpData));

      logger.info("OTP generated for password reset", {
        userId,
        email,
        ttl: this.OTP_TTL,
      });

      return otp;
    } catch (error) {
      logger.error("Failed to generate OTP", { userId, email, error });
      throw new AppError("Failed to generate OTP", 500, "OTP_GENERATION_FAILED");
    }
  }

  /**
   * Verify OTP for password reset
   * Implements brute-force protection and single-use validation
   */
  async verifyPasswordResetOtp(userId: string, email: string, providedOtp: string): Promise<boolean> {
    try {
      const client = redis.getClient();
      if (!client) {
        throw new AppError("Redis service unavailable", 503, "SERVICE_UNAVAILABLE");
      }

      // Check attempt rate limiting
      await this.checkAttemptRateLimit(email);

      const key = this.getOtpKey(userId);
      const otpDataStr = await client.get(key);

      if (!otpDataStr) {
        await this.incrementAttempts(email);
        throw new AppError("OTP expired or not found", 400, "OTP_EXPIRED");
      }

      const otpData: OtpData = JSON.parse(otpDataStr);

      // Verify email matches (additional security check)
      if (otpData.email !== email) {
        await this.incrementAttempts(email);
        throw new AppError("Invalid OTP request", 400, "INVALID_OTP_REQUEST");
      }

      // Check if too many attempts on this OTP
      if (otpData.attempts >= this.MAX_ATTEMPTS) {
        await client.del(key); // Delete the OTP
        throw new AppError("Too many OTP attempts. Please request a new OTP.", 429, "OTP_ATTEMPTS_EXCEEDED");
      }

      // Verify OTP
      if (otpData.otp !== providedOtp) {
        // Increment attempts for this specific OTP
        otpData.attempts += 1;
        await client.setEx(key, this.OTP_TTL, JSON.stringify(otpData));
        
        // Also increment global attempt counter
        await this.incrementAttempts(email);
        
        throw new AppError("Invalid OTP", 400, "INVALID_OTP");
      }

      // OTP is valid - delete it immediately (single-use)
      await client.del(key);
      
      // Clear attempt counter on successful verification
      await client.del(this.getAttemptKey(email));

      logger.info("OTP verified successfully for password reset", {
        userId,
        email,
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      logger.error("Failed to verify OTP", { userId, email, error });
      throw new AppError("Failed to verify OTP", 500, "OTP_VERIFICATION_FAILED");
    }
  }

  /**
   * Check if user has exceeded attempt rate limit
   */
  private async checkAttemptRateLimit(email: string): Promise<void> {
    try {
      const client = redis.getClient();
      if (!client) return; // Skip rate limiting if Redis unavailable

      const attemptKey = this.getAttemptKey(email);
      const attempts = await client.get(attemptKey);
      
      if (attempts && parseInt(attempts) >= this.MAX_ATTEMPTS) {
        throw new AppError(
          "Too many failed attempts. Please try again later.",
          429,
          "RATE_LIMIT_EXCEEDED"
        );
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      // Don't fail the request if rate limiting check fails
      logger.warn("Rate limit check failed", { email, error });
    }
  }

  /**
   * Increment attempt counter with TTL
   */
  private async incrementAttempts(email: string): Promise<void> {
    try {
      const client = redis.getClient();
      if (!client) return;

      const attemptKey = this.getAttemptKey(email);
      const current = await client.incr(attemptKey);
      
      // Set TTL only on first attempt
      if (current === 1) {
        await client.expire(attemptKey, this.ATTEMPT_WINDOW);
      }
    } catch (error) {
      logger.warn("Failed to increment attempt counter", { email, error });
    }
  }

  /**
   * Clean up expired OTPs (optional maintenance method)
   */
  async cleanupExpiredOtps(): Promise<void> {
    try {
      const client = redis.getClient();
      if (!client) return;

      // Redis automatically handles TTL cleanup, but we can log for monitoring
      logger.debug("OTP cleanup check completed");
    } catch (error) {
      logger.warn("OTP cleanup failed", { error });
    }
  }

  /**
   * Get OTP status for debugging (development only)
   */
  async getOtpStatus(userId: string): Promise<{ exists: boolean; ttl?: number }> {
    try {
      const client = redis.getClient();
      if (!client) {
        return { exists: false };
      }

      const key = this.getOtpKey(userId);
      const exists = await client.exists(key);
      
      if (exists) {
        const ttl = await client.ttl(key);
        return { exists: true, ttl };
      }
      
      return { exists: false };
    } catch (error) {
      logger.warn("Failed to get OTP status", { userId, error });
      return { exists: false };
    }
  }
}

export const otpService = new OtpService();