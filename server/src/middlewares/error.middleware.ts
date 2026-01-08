import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "../types/api";
import { logger } from "../lib/logger";
import { env } from "../config/env";

// Custom error classes
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  public details?: Record<string, string[]>;

  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 422, "VALIDATION_ERROR");
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

// Error handler middleware
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error details
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
  });

  // Handle custom application errors
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err instanceof ValidationError && err.details && { details: err.details }),
      },
    };
    return res.status(err.statusCode).json(response);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((error: any) => {
      const path = error.path.join(".");
      if (!details[path]) {
        details[path] = [];
      }
      details[path].push(error.message);
    });

    const response: ApiResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details,
      },
    };
    return res.status(422).json(response);
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case "P2002": // Unique constraint violation
        const field = prismaError.meta?.target?.[0] || "field";
        const response: ApiResponse = {
          success: false,
          error: {
            code: "DUPLICATE_ENTRY",
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
          },
        };
        return res.status(409).json(response);
        
      case "P2025": // Record not found
        const notFoundResponse: ApiResponse = {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Record not found",
          },
        };
        return res.status(404).json(notFoundResponse);
        
      case "P2003": // Foreign key constraint violation
        const foreignKeyResponse: ApiResponse = {
          success: false,
          error: {
            code: "INVALID_REFERENCE",
            message: "Referenced record does not exist",
          },
        };
        return res.status(400).json(foreignKeyResponse);
        
      default:
        logger.error("Unhandled Prisma error", { code: prismaError.code, meta: prismaError.meta });
    }
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid authentication token",
      },
    };
    return res.status(401).json(response);
  }

  if (err.name === "TokenExpiredError") {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Authentication token has expired",
      },
    };
    return res.status(401).json(response);
  }

  // Handle multer errors (file upload)
  if (err.name === "MulterError") {
    const multerError = err as any;
    let message = "File upload error";
    let code = "UPLOAD_ERROR";

    switch (multerError.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size too large";
        code = "FILE_TOO_LARGE";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files";
        code = "TOO_MANY_FILES";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        code = "UNEXPECTED_FILE";
        break;
    }

    const response: ApiResponse = {
      success: false,
      error: { code, message },
    };
    return res.status(400).json(response);
  }

  // Handle syntax errors (malformed JSON)
  if (err instanceof SyntaxError && "body" in err) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Invalid JSON in request body",
      },
    };
    return res.status(400).json(response);
  }

  // Default error response
  const response: ApiResponse = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "An internal server error occurred"
          : err.message,
    },
  };

  res.status(500).json(response);
}

// Async error wrapper
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>
) {
  return (req: T, res: U, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

