import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { RequestUser } from "../types/api";
import { AuthenticationError } from "./error.middleware";
import { logger } from "../lib/logger";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get token from cookie first, then from Authorization header
    const token = req.cookies["auth-token"] || 
                  req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new AuthenticationError("Authentication token required");
    }

    const user = verifyToken(token);
    req.user = user;

    logger.debug("User authenticated", { userId: user.id, email: user.email, role: user.role });
    
    next();
  } catch (error) {
    logger.warn("Authentication failed", { 
      error: error instanceof Error ? error.message : "Unknown error",
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
    });

    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError("Invalid or expired authentication token"));
    }
  }
}

// Optional authentication - doesn't throw error if no token
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies["auth-token"] || 
                  req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const user = verifyToken(token);
      req.user = user;
      logger.debug("User optionally authenticated", { userId: user.id });
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    logger.debug("Optional authentication failed", { 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
    next();
  }
}

