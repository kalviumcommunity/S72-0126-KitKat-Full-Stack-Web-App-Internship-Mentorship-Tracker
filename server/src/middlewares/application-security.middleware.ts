import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthorizationError, NotFoundError, ConflictError } from "./error.middleware";
import { UserRole } from "../types/roles";
import { logger } from "../lib/logger";

/**
 * Middleware to check if user can access a specific application
 * Used for GET, PUT, DELETE operations on individual applications
 */
export function requireApplicationAccess() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthorizationError("Authentication required");
      }

      const applicationId = req.params.id;
      if (!applicationId) {
        throw new Error("Application ID is required");
      }

      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        select: {
          id: true,
          userId: true,
          status: true,
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });

      if (!application) {
        throw new NotFoundError("Application");
      }

      // Check access based on user role
      switch (req.user.role) {
        case UserRole.STUDENT:
          if (application.userId !== req.user.id) {
            throw new AuthorizationError("You can only access your own applications");
          }
          break;

        case UserRole.MENTOR:
          // Check if mentor is assigned to the student who owns this application
          const mentorAssignment = await prisma.mentorAssignment.findFirst({
            where: {
              mentorId: req.user.id,
              studentId: application.userId,
              isActive: true,
            },
          });

          if (!mentorAssignment) {
            throw new AuthorizationError("You can only access applications of your assigned students");
          }
          break;

        case UserRole.ADMIN:
          // Admins can access all applications
          break;

        default:
          throw new AuthorizationError("Invalid user role");
      }

      // Store application info in request for use in controllers
      (req as any).application = application;

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to prevent modification of applications in certain states
 * Used for PUT and DELETE operations
 */
export function requireModifiableApplication() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const application = (req as any).application;
      
      if (!application) {
        throw new Error("Application data not found in request");
      }

      // Prevent modification of applications with offers
      if (application.status === "OFFER" && req.method !== "GET") {
        throw new ConflictError("Cannot modify applications with offers");
      }

      // Additional business rules can be added here
      // For example, prevent deletion of applications that have feedback
      if (req.method === "DELETE") {
        const feedbackCount = await prisma.feedback.count({
          where: { applicationId: application.id },
        });

        if (feedbackCount > 0) {
          throw new ConflictError("Cannot delete applications that have feedback");
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to prevent duplicate applications
 * Used for POST and PUT operations
 */
export function preventDuplicateApplication() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthorizationError("Authentication required");
      }

      const { company, role } = req.body;
      if (!company || !role) {
        return next(); // Let validation middleware handle missing fields
      }

      const applicationId = req.params.id; // For updates
      const userId = req.user.id;

      // Check for existing application with same company and role
      const existingApplication = await prisma.application.findFirst({
        where: {
          userId,
          company: company.trim(),
          role: role.trim(),
          status: { not: "REJECTED" }, // Allow reapplying to rejected applications
          ...(applicationId && { id: { not: applicationId } }), // Exclude current application for updates
        },
      });

      if (existingApplication) {
        logger.warn("Duplicate application attempt", {
          userId,
          company,
          role,
          existingApplicationId: existingApplication.id,
        });

        throw new ConflictError(
          "You already have an active application for this role at this company"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to validate application status transitions
 * Used for PUT operations when status is being changed
 */
export function validateStatusTransition() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status: newStatus } = req.body;
      if (!newStatus) {
        return next(); // No status change
      }

      const application = (req as any).application;
      if (!application) {
        throw new Error("Application data not found in request");
      }

      const currentStatus = application.status;

      // Define valid status transitions
      const validTransitions: Record<string, string[]> = {
        DRAFT: ["APPLIED", "REJECTED"],
        APPLIED: ["SHORTLISTED", "REJECTED"],
        SHORTLISTED: ["INTERVIEW", "REJECTED"],
        INTERVIEW: ["OFFER", "REJECTED"],
        OFFER: ["OFFER"], // Can only stay as offer
        REJECTED: ["DRAFT", "APPLIED"], // Can reapply
      };

      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        logger.warn("Invalid status transition attempt", {
          userId: req.user?.id,
          applicationId: application.id,
          currentStatus,
          newStatus,
        });

        throw new ConflictError(
          `Cannot change status from ${currentStatus} to ${newStatus}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to log application access for security monitoring
 */
export function logApplicationAccess() {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(body) {
      // Log successful access
      if (res.statusCode < 400) {
        logger.info("Application access", {
          userId: req.user?.id,
          userRole: req.user?.role,
          method: req.method,
          applicationId: req.params.id,
          statusCode: res.statusCode,
          ip: req.ip,
          userAgent: req.get("User-Agent"),
        });
      }
      
      return originalSend.call(this, body);
    };

    next();
  };
}

/**
 * Middleware to sanitize application data before processing
 * Prevents XSS and other injection attacks
 */
export function sanitizeApplicationData() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
      // Sanitize string fields
      const stringFields = ['company', 'role', 'notes', 'resumeUrl'];
      
      stringFields.forEach(field => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          // Remove potential XSS vectors
          req.body[field] = req.body[field]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .trim();
        }
      });

      // Validate and sanitize dates
      const dateFields = ['deadline', 'appliedDate'];
      dateFields.forEach(field => {
        if (req.body[field]) {
          try {
            const date = new Date(req.body[field]);
            if (isNaN(date.getTime())) {
              delete req.body[field]; // Remove invalid dates
            }
          } catch {
            delete req.body[field];
          }
        }
      });
    }

    next();
  };
}

/**
 * Middleware to check application limits per user
 * Prevents spam and abuse
 */
export function checkApplicationLimits() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || req.method !== "POST") {
        return next();
      }

      const userId = req.user.id;

      // Check daily application creation limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayApplications = await prisma.application.count({
        where: {
          userId,
          createdAt: {
            gte: today,
          },
        },
      });

      if (todayApplications >= 20) { // Max 20 applications per day
        logger.warn("Application creation limit exceeded", {
          userId,
          todayApplications,
          limit: 20,
        });

        throw new ConflictError("Daily application creation limit exceeded (20 per day)");
      }

      // Check total active applications limit
      const activeApplications = await prisma.application.count({
        where: {
          userId,
          status: { not: "REJECTED" },
        },
      });

      if (activeApplications >= 100) { // Max 100 active applications
        logger.warn("Active application limit exceeded", {
          userId,
          activeApplications,
          limit: 100,
        });

        throw new ConflictError("Active application limit exceeded (100 maximum)");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}