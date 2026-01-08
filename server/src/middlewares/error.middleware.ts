import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api";
import { logger } from "../lib/logger";
import { env } from "../config/env";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error occurred", err);

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;
    if (prismaError.code === "P2002") {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "DUPLICATE_EMAIL",
          message: "Email already exists",
        },
      };
      return res.status(409).json(response);
    }
  }

  // Validation errors (should be caught by validate middleware, but just in case)
  if (err.name === "ZodError") {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
      },
    };
    return res.status(422).json(response);
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

