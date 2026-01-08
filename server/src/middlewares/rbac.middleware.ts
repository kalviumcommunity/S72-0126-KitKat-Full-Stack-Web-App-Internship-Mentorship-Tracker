import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/roles";
import { ApiResponse } from "../types/api";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      };
      return res.status(401).json(response);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Insufficient permissions",
        },
      };
      return res.status(403).json(response);
    }

    next();
  };
}

