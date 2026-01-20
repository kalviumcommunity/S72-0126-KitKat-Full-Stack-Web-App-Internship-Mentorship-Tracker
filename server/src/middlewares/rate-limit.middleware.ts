import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";
import { RateLimitError } from "./error.middleware";
import { logger } from "../lib/logger";

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  message?: string; // Custom error message
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = (req) => req.ip,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = "Too many requests, please try again later",
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Check if Redis is available
      if (!redis.isReady()) {
        logger.warn("Redis not available, allowing request without rate limiting");
        next();
        return;
      }

      const client = redis.getClient();
      if (!client) {
        logger.warn("Redis client not available, allowing request without rate limiting");
        next();
        return;
      }

      // Use Redis sliding window approach with sorted sets
      const multi = client.multi();
      
      // Remove expired entries
      multi.zRemRangeByScore(key, 0, windowStart);
      
      // Count current requests in window
      multi.zCard(key);
      
      // Add current request
      const requestId = `${now}-${Math.random()}`;
      multi.zAdd(key, { score: now, value: requestId });
      
      // Set expiration
      multi.expire(key, Math.ceil(windowMs / 1000));
      
      const results = await multi.exec();
      
      if (!results) {
        throw new Error("Redis transaction failed");
      }
      
      // Get current request count (before adding new one)
      const currentRequests = results[1] as number;

      if (currentRequests >= maxRequests) {
        // Remove the request we just added since we're rejecting it
        await client.zRem(key, requestId);
        
        logger.warn("Rate limit exceeded", {
          key,
          currentRequests,
          maxRequests,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        });
        
        throw new RateLimitError(message);
      }

      // Set rate limit headers
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader("X-RateLimit-Remaining", Math.max(0, maxRequests - currentRequests - 1));
      res.setHeader("X-RateLimit-Reset", new Date(now + windowMs).toISOString());

      // Handle response counting for skip options
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function (body) {
          const shouldSkip = 
            (skipSuccessfulRequests && res.statusCode < 400) ||
            (skipFailedRequests && res.statusCode >= 400);

          if (shouldSkip) {
            // Remove the request we added
            client.zRem(key, requestId).catch((err: any) => {
              logger.error("Failed to remove rate limit entry", err);
            });
          }

          return originalSend.call(this, body);
        };
      }

      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw error;
      }
      
      logger.error("Rate limiting error", error);
      // If Redis is down, allow the request to proceed with warning
      logger.warn("Rate limiting disabled due to Redis error, allowing request");
      next();
    }
  };
}

// Predefined rate limiters
export const rateLimiters = {
  // General API rate limit: 100 requests per minute
  general: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  }),

  // Authentication rate limit: 5 attempts per 15 minutes
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyGenerator: (req) => `auth:${req.ip}`,
    message: "Too many authentication attempts, please try again in 15 minutes",
  }),

  // File upload rate limit: 10 uploads per hour
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyGenerator: (req) => `upload:${req.ip}`,
    message: "Too many file uploads, please try again in an hour",
  }),

  // Password reset rate limit: 3 attempts per hour
  passwordReset: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    keyGenerator: (req) => `password_reset:${req.ip}`,
    message: "Too many password reset attempts, please try again in an hour",
  }),

  // User-specific rate limit: 1000 requests per hour per user
  perUser: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
    keyGenerator: (req) => `user:${(req as any).user?.id || req.ip}`,
  }),
};

// Rate limit by user ID (requires authentication)
export function createUserRateLimit(maxRequests: number, windowMs: number) {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (req) => {
      const userId = (req as any).user?.id;
      if (!userId) {
        throw new Error("User rate limit requires authentication");
      }
      return `user:${userId}`;
    },
  });
}

// Rate limit by email (for registration/login)
export function createEmailRateLimit(maxRequests: number, windowMs: number) {
  return rateLimit({
    windowMs,
    maxRequests,
    keyGenerator: (req) => {
      const email = req.body?.email;
      if (!email) {
        return req.ip || 'unknown'; // Fallback to IP or 'unknown'
      }
      return `email:${email.toLowerCase()}`;
    },
  });
}