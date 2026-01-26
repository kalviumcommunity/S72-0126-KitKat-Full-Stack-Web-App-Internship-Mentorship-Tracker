import { prisma } from "../../lib/prisma";
import { CreateApplicationInput, UpdateApplicationInput, ListApplicationsQuery, BulkUpdateStatusInput, ExportApplicationsQuery } from "../../lib/validation";
import { RequestUser, PaginationMeta } from "../../types/api";
import { logger } from "../../lib/logger";
import { UserRole } from "../../types/roles";
import { NotFoundError, AuthorizationError, ConflictError } from "../../middlewares/error.middleware";

export class ApplicationService {
  async createApplication(userId: string, input: CreateApplicationInput) {
    try {
      // Validate user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: userId, isActive: true },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new NotFoundError("User");
      }

      if (user.role !== UserRole.STUDENT) {
        throw new AuthorizationError("Only students can create applications");
      }

      // Check for duplicate applications (same company + role)
      const existingApplication = await prisma.application.findFirst({
        where: {
          userId,
          company: input.company,
          role: input.role,
          status: { not: "REJECTED" }, // Allow reapplying to rejected applications
        },
      });

      if (existingApplication) {
        throw new ConflictError("You already have an active application for this role at this company");
      }

      // Create application with transaction for data integrity
      const application = await prisma.$transaction(async (tx) => {
        const newApplication = await tx.application.create({
          data: {
            userId,
            company: input.company.trim(),
            role: input.role.trim(),
            platform: input.platform,
            status: input.status || "DRAFT",
            resumeUrl: input.resumeUrl?.trim() || null,
            notes: input.notes?.trim() || null,
            deadline: input.deadline ? new Date(input.deadline) : null,
            appliedDate: input.appliedDate ? new Date(input.appliedDate) : null,
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        // Log application creation for audit
        logger.info("Application created", {
          applicationId: newApplication.id,
          userId,
          company: input.company,
          role: input.role,
          platform: input.platform,
        });

        return newApplication;
      });

      return application;
    } catch (error) {
      logger.error("Create application error", { error, userId, input });
      throw error;
    }
  }

  async getApplicationById(applicationId: string, user: RequestUser) {
    try {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          feedback: {
            include: {
              mentor: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!application) {
        throw new NotFoundError("Application");
      }

      // Authorization checks
      await this.checkApplicationAccess(application, user);

      return application;
    } catch (error) {
      logger.error("Get application error", { error, applicationId, userId: user.id });
      throw error;
    }
  }

  async listApplications(user: RequestUser, query: ListApplicationsQuery) {
    try {
      const page = Math.max(1, query.page || 1);
      const limit = Math.min(Math.max(1, query.limit || 10), 100); // Max 100 items per page
      const skip = (page - 1) * limit;

      // Build secure where clause based on user role
      const where = await this.buildApplicationsWhereClause(user, query);

      // Build order by clause
      const orderBy = this.buildOrderByClause((query as any).sortBy, (query as any).sortOrder);

      const [applications, total] = await Promise.all([
        prisma.application.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
            _count: {
              select: {
                feedback: true,
              },
            },
          },
        }),
        prisma.application.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);
      const pagination: PaginationMeta = {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };

      return { applications, pagination };
    } catch (error) {
      logger.error("List applications error", { error, userId: user.id, query });
      throw error;
    }
  }

  async updateApplication(applicationId: string, userId: string, input: UpdateApplicationInput) {
    try {
      // Check ownership and get existing application
      const existingApplication = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { id: true, userId: true, status: true, company: true, role: true },
      });

      if (!existingApplication) {
        throw new NotFoundError("Application");
      }

      if (existingApplication.userId !== userId) {
        throw new AuthorizationError("You can only update your own applications");
      }

      // Prevent updates to certain statuses
      if (existingApplication.status === "OFFER" && input.status && input.status !== "OFFER") {
        throw new ConflictError("Cannot change status from OFFER");
      }

      // Check for duplicate if company/role is being changed
      if (input.company || input.role) {
        const newCompany = input.company || existingApplication.company;
        const newRole = input.role || existingApplication.role;

        if (newCompany !== existingApplication.company || newRole !== existingApplication.role) {
          const duplicateCheck = await prisma.application.findFirst({
            where: {
              userId,
              company: newCompany,
              role: newRole,
              id: { not: applicationId },
              status: { not: "REJECTED" },
            },
          });

          if (duplicateCheck) {
            throw new ConflictError("You already have an active application for this role at this company");
          }
        }
      }

      // Build update data with proper sanitization
      const updateData: any = { updatedAt: new Date() };
      
      if (input.company !== undefined) updateData.company = input.company.trim();
      if (input.role !== undefined) updateData.role = input.role.trim();
      if (input.platform !== undefined) updateData.platform = input.platform;
      if (input.status !== undefined) updateData.status = input.status;
      if (input.resumeUrl !== undefined) updateData.resumeUrl = input.resumeUrl?.trim() || null;
      if (input.notes !== undefined) updateData.notes = input.notes?.trim() || null;
      if (input.deadline !== undefined) {
        updateData.deadline = input.deadline ? new Date(input.deadline) : null;
      }
      if (input.appliedDate !== undefined) {
        updateData.appliedDate = input.appliedDate ? new Date(input.appliedDate) : null;
      }

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      logger.info("Application updated", {
        applicationId,
        userId,
        updatedFields: Object.keys(updateData),
      });

      return application;
    } catch (error) {
      logger.error("Update application error", { error, applicationId, userId, input });
      throw error;
    }
  }

  async deleteApplication(applicationId: string, userId: string) {
    try {
      // Check ownership
      const existingApplication = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { id: true, userId: true, status: true },
      });

      if (!existingApplication) {
        throw new NotFoundError("Application");
      }

      if (existingApplication.userId !== userId) {
        throw new AuthorizationError("You can only delete your own applications");
      }

      // Prevent deletion of applications with offers
      if (existingApplication.status === "OFFER") {
        throw new ConflictError("Cannot delete applications with offers");
      }

      // Soft delete with transaction to maintain referential integrity
      await prisma.$transaction(async (tx) => {
        // Delete related feedback first
        await tx.feedback.deleteMany({
          where: { applicationId },
        });

        // Delete the application
        await tx.application.delete({
          where: { id: applicationId },
        });
      });

      logger.info("Application deleted", { applicationId, userId });
    } catch (error) {
      logger.error("Delete application error", { error, applicationId, userId });
      throw error;
    }
  }

  async getApplicationStats(user: RequestUser) {
    try {
      const where = await this.buildApplicationsWhereClause(user, { page: 1, limit: 10 });

      const [statusStats, platformStats, totalCount, recentCount] = await Promise.all([
        // Status distribution
        prisma.application.groupBy({
          by: ['status'],
          where,
          _count: { status: true },
        }),
        // Platform distribution
        prisma.application.groupBy({
          by: ['platform'],
          where,
          _count: { platform: true },
        }),
        // Total applications
        prisma.application.count({ where }),
        // Recent applications (last 30 days)
        prisma.application.count({
          where: {
            ...where,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

      return {
        total: totalCount,
        recent: recentCount,
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {} as Record<string, number>),
        byPlatform: platformStats.reduce((acc, stat) => {
          acc[stat.platform] = stat._count.platform;
          return acc;
        }, {} as Record<string, number>),
      };
    } catch (error) {
      logger.error("Get application stats error", { error, userId: user.id });
      throw error;
    }
  }

  async bulkUpdateStatus(applicationIds: string[], status: string, userId: string) {
    try {
      // Validate all applications belong to the user
      const applications = await prisma.application.findMany({
        where: {
          id: { in: applicationIds },
          userId,
        },
        select: { id: true, status: true },
      });

      if (applications.length !== applicationIds.length) {
        throw new AuthorizationError("Some applications do not belong to you or do not exist");
      }

      // Prevent invalid status transitions
      const invalidTransitions = applications.filter(app => 
        app.status === "OFFER" && status !== "OFFER"
      );

      if (invalidTransitions.length > 0) {
        throw new ConflictError("Cannot change status from OFFER for some applications");
      }

      const result = await prisma.application.updateMany({
        where: {
          id: { in: applicationIds },
          userId,
        },
        data: {
          status: status as any,
          updatedAt: new Date(),
        },
      });

      logger.info("Bulk status update", {
        userId,
        applicationIds,
        status,
        updatedCount: result.count,
      });

      return { updatedCount: result.count };
    } catch (error) {
      logger.error("Bulk update status error", { error, applicationIds, status, userId });
      throw error;
    }
  }

  async exportApplications(userId: string, query: ExportApplicationsQuery) {
    try {
      const where: any = { userId };

      // Apply filters
      if (query.status) where.status = query.status;
      if (query.platform) where.platform = query.platform;
      if ((query as any).startDate) {
        where.createdAt = { ...where.createdAt, gte: new Date((query as any).startDate) };
      }
      if ((query as any).endDate) {
        where.createdAt = { ...where.createdAt, lte: new Date((query as any).endDate) };
      }

      const applications = await prisma.application.findMany({
        where,
        select: {
          id: true,
          company: true,
          role: true,
          platform: true,
          status: true,
          notes: true,
          deadline: true,
          appliedDate: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return applications;
    } catch (error) {
      logger.error("Export applications error", { error, userId, query });
      throw error;
    }
  }

  // Private helper methods
  private async checkApplicationAccess(application: any, user: RequestUser) {
    switch (user.role) {
      case UserRole.STUDENT:
        if (application.userId !== user.id) {
          throw new AuthorizationError("You can only access your own applications");
        }
        break;

      case UserRole.MENTOR:
        // Check if mentor is assigned to the student
        const mentorAssignment = await prisma.mentorAssignment.findFirst({
          where: {
            mentorId: user.id,
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
  }

  private async buildApplicationsWhereClause(user: RequestUser, query: ListApplicationsQuery) {
    const where: any = {};

    // Role-based filtering
    switch (user.role) {
      case UserRole.STUDENT:
        where.userId = user.id;
        break;

      case UserRole.MENTOR:
        // Get assigned student IDs
        const assignments = await prisma.mentorAssignment.findMany({
          where: { mentorId: user.id, isActive: true },
          select: { studentId: true },
        });
        const studentIds = assignments.map(a => a.studentId);
        where.userId = { in: studentIds };
        break;

      case UserRole.ADMIN:
        // No additional filtering for admins
        break;
    }

    // Apply query filters
    if (query.status) where.status = query.status;
    if (query.platform) where.platform = query.platform;
    if (query.company) {
      where.company = { contains: query.company, mode: 'insensitive' };
    }
    if (query.search) {
      where.OR = [
        { company: { contains: query.search, mode: 'insensitive' } },
        { role: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildOrderByClause(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc') {
    const validSortFields = ['createdAt', 'updatedAt', 'company', 'role', 'status', 'deadline'];
    const field = validSortFields.includes(sortBy || '') ? sortBy : 'createdAt';
    
    return { [field!]: sortOrder };
  }
}

export const applicationService = new ApplicationService();

