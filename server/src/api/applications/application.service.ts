import { prisma } from "../../lib/prisma";
import { CreateApplicationInput, UpdateApplicationInput, ListApplicationsQuery } from "./application.schema";
import { RequestUser } from "../../types/api";
import { PAGINATION } from "../../config/constants";
import { logger } from "../../lib/logger";
import { UserRole } from "../../types/roles";

export class ApplicationService {
  async createApplication(userId: string, input: CreateApplicationInput) {
    try {
      const application = await prisma.application.create({
        data: {
          userId,
          company: input.company,
          role: input.role,
          platform: input.platform,
          status: input.status || "DRAFT",
          resumeUrl: input.resumeUrl || null,
          notes: input.notes || null,
          deadline: input.deadline ? new Date(input.deadline) : null,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return application;
    } catch (error) {
      logger.error("Create application error", error);
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
            },
          },
          feedback: {
            include: {
              mentor: {
                select: {
                  id: true,
                  email: true,
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
        throw new Error("Application not found");
      }

      // Check permissions
      if (user.role === UserRole.STUDENT && application.userId !== user.id) {
        throw new Error("Forbidden");
      }

      // TODO: Check mentor assignment for MENTOR role

      return application;
    } catch (error) {
      logger.error("Get application error", error);
      throw error;
    }
  }

  async listApplications(user: RequestUser, query: ListApplicationsQuery) {
    try {
      const page = query.page || PAGINATION.DEFAULT_PAGE;
      const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
      const skip = (page - 1) * limit;

      // Build where clause based on user role
      const where: any = {};

      if (user.role === UserRole.STUDENT) {
        where.userId = user.id;
      } else if (user.role === UserRole.MENTOR) {
        // TODO: Filter by assigned students
        // For now, allow mentors to see all applications
        // where.userId = { in: assignedStudentIds }
      }
      // ADMIN can see all, so no filter

      if (query.status) {
        where.status = query.status;
      }

      if (query.company) {
        where.company = {
          contains: query.company,
          mode: "insensitive",
        };
      }

      const applications = await prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      const total = await prisma.application.count({ where });

      const totalPages = Math.ceil(total / limit);

      return {
        applications,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error("List applications error", error);
      throw error;
    }
  }

  async updateApplication(applicationId: string, userId: string, input: UpdateApplicationInput) {
    try {
      // Check ownership
      const existing = await prisma.application.findUnique({
        where: { id: applicationId },
      });

      if (!existing) {
        throw new Error("Application not found");
      }

      if (existing.userId !== userId) {
        throw new Error("Forbidden");
      }

      const updateData: any = {};
      if (input.company !== undefined) updateData.company = input.company;
      if (input.role !== undefined) updateData.role = input.role;
      if (input.platform !== undefined) updateData.platform = input.platform;
      if (input.status !== undefined) updateData.status = input.status;
      if (input.resumeUrl !== undefined) updateData.resumeUrl = input.resumeUrl;
      if (input.notes !== undefined) updateData.notes = input.notes;
      if (input.deadline !== undefined) {
        updateData.deadline = input.deadline ? new Date(input.deadline) : null;
      }

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return application;
    } catch (error) {
      logger.error("Update application error", error);
      throw error;
    }
  }

  async deleteApplication(applicationId: string, userId: string) {
    try {
      // Check ownership
      const existing = await prisma.application.findUnique({
        where: { id: applicationId },
      });

      if (!existing) {
        throw new Error("Application not found");
      }

      if (existing.userId !== userId) {
        throw new Error("Forbidden");
      }

      await prisma.application.delete({
        where: { id: applicationId },
      });

      return { success: true };
    } catch (error) {
      logger.error("Delete application error", error);
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();

