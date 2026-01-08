import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { RequestUser } from "../types/api";
import { ApiResponse } from "../types/api";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies["auth-token"] || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      };
      return res.status(401).json(response);
    }

    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: error instanceof Error ? error.message : "Invalid or expired token",
      },
    };
    return res.status(401).json(response);
  }
}

