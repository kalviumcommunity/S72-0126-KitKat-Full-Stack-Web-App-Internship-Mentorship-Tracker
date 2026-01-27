import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  // BYPASS AUTHENTICATION
  // Injecting a mock Super Admin user for all requests
  req.user = {
    id: "mock-admin-id",
    email: "admin@example.com",
    role: "SUPER_ADMIN" as any
  };

  logger.warn("Authentication bypassed - Mock Super Admin injected", {
    path: req.path,
    ip: req.ip
  });

  next();
}

