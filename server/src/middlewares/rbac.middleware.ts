import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/roles";
import { AuthenticationError, AuthorizationError } from "./error.middleware";
import { logger } from "../lib/logger";

// Role hierarchy for permission checking
const ROLE_HIERARCHY = {
  [UserRole.ADMIN]: 3,
  [UserRole.MENTOR]: 2,
  [UserRole.STUDENT]: 1,
} as const;

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required");
      }

      if (!allowedRoles.includes(req.user.role)) {
        logger.warn("Access denied - insufficient role", {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: allowedRoles,
          url: req.url,
          method: req.method,
        });
        
        throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(", ")}`);
      }

      logger.debug("Role authorization successful", {
        userId: req.user.id,
        userRole: req.user.role,
        url: req.url,
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Check if user has minimum role level
export function requireMinRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required");
      }

      const userRoleLevel = ROLE_HIERARCHY[req.user.role];
      const minRoleLevel = ROLE_HIERARCHY[minRole];

      if (userRoleLevel < minRoleLevel) {
        logger.warn("Access denied - insufficient role level", {
          userId: req.user.id,
          userRole: req.user.role,
          userRoleLevel,
          minRole,
          minRoleLevel,
          url: req.url,
          method: req.method,
        });
        
        throw new AuthorizationError(`Access denied. Minimum role required: ${minRole}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Check if user owns the resource or has admin privileges
export function requireOwnershipOrAdmin(getResourceUserId: (req: Request) => string | Promise<string>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required");
      }

      // Admins can access any resource
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      // Get the resource owner ID
      const resourceUserId = await getResourceUserId(req);

      // Check if user owns the resource
      if (req.user.id !== resourceUserId) {
        logger.warn("Access denied - not resource owner", {
          userId: req.user.id,
          resourceUserId,
          url: req.url,
          method: req.method,
        });
        
        throw new AuthorizationError("Access denied. You can only access your own resources");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Check if mentor can access student's resources
export function requireMentorAccess(getStudentId: (req: Request) => string | Promise<string>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthenticationError("Authentication required");
      }

      // Admins can access any resource
      if (req.user.role === UserRole.ADMIN) {
        return next();
      }

      // Students can only access their own resources
      if (req.user.role === UserRole.STUDENT) {
        const studentId = await getStudentId(req);
        if (req.user.id !== studentId) {
          throw new AuthorizationError("Students can only access their own resources");
        }
        return next();
      }

      // Mentors can access their assigned students' resources
      if (req.user.role === UserRole.MENTOR) {
        const studentId = await getStudentId(req);
        
        // Check if mentor is assigned to this student
        const { prisma } = await import("../lib/prisma");
        const assignment = await prisma.mentorAssignment.findFirst({
          where: {
            mentorId: req.user.id,
            studentId: studentId,
            isActive: true,
          },
        });

        if (!assignment) {
          logger.warn("Access denied - mentor not assigned to student", {
            mentorId: req.user.id,
            studentId,
            url: req.url,
            method: req.method,
          });
          
          throw new AuthorizationError("Access denied. You are not assigned as mentor to this student");
        }

        return next();
      }

      throw new AuthorizationError("Access denied");
    } catch (error) {
      next(error);
    }
  };
}

// Convenience functions for common role checks
export const requireStudent = requireRole(UserRole.STUDENT);
export const requireMentor = requireRole(UserRole.MENTOR);
export const requireAdmin = requireRole(UserRole.ADMIN);

export const requireMentorOrAdmin = requireRole(UserRole.MENTOR, UserRole.ADMIN);
export const requireStudentOrMentor = requireRole(UserRole.STUDENT, UserRole.MENTOR);

export const requireMinMentor = requireMinRole(UserRole.MENTOR);
export const requireMinAdmin = requireMinRole(UserRole.ADMIN);

// Self-access or admin (for profile updates, etc.)
export const requireSelfOrAdmin = requireOwnershipOrAdmin((req) => req.params.id || req.user!.id);

