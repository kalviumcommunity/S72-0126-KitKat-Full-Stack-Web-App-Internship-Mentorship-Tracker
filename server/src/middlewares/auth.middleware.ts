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
    let token = req.cookies["auth-token"];
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7); // Remove "Bearer " prefix
      } else {
        throw new AuthenticationError("Invalid authorization header format");
      }
    }

    if (!token || token.trim() === "") {
      throw new AuthenticationError("Authentication token required");
    }

    // Verify and decode the token
    const user = verifyToken(token);
    
    // Additional validation
    if (!user || !user.id || !user.email || !user.role) {
      throw new AuthenticationError("Invalid token payload");
    }

    // Check if user is active (if this field exists)
    if (user.isActive === false) {
      throw new AuthenticationError("Account is deactivated");
    }

    req.user = user;

    logger.debug("User authenticated", { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      ip: req.ip 
    });
    
    next();
  } catch (error) {
    logger.warn("Authentication failed", { 
      error: error instanceof Error ? error.message : "Unknown error",
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      hasToken: !!(req.cookies["auth-token"] || req.headers.authorization),
    });

    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      // Handle JWT-specific errors
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("jwt expired")) {
        next(new AuthenticationError("Authentication token has expired"));
      } else if (errorMessage.includes("jwt malformed")) {
        next(new AuthenticationError("Invalid authentication token format"));
      } else if (errorMessage.includes("invalid signature")) {
        next(new AuthenticationError("Authentication token signature is invalid"));
      } else {
        next(new AuthenticationError("Invalid or expired authentication token"));
      }
    }
  }
}

// Optional authentication - doesn't throw error if no token
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.cookies["auth-token"];
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (token && token.trim() !== "") {
      const user = verifyToken(token);
      
      // Additional validation for optional auth
      if (user && user.id && user.email && user.role) {
        // Only set user if token is valid and user is active
        if (user.isActive !== false) {
          req.user = user;
          logger.debug("User optionally authenticated", { 
            userId: user.id,
            ip: req.ip 
          });
        }
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    logger.debug("Optional authentication failed", { 
      error: error instanceof Error ? error.message : "Unknown error",
      ip: req.ip,
      url: req.url,
    });
    next();
  }
}

