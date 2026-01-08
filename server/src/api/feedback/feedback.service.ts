import { prisma } from "../../lib/prisma";
import { CreateFeedbackInput, UpdateFeedbackInput, ListFeedbackQuery } from "./feedback.schema";
import { RequestUser } from "../../types/api";
import { PAGINATION } from "../../config/constants";
import { logger } from "../../lib/logger";
import { UserRole } from "../../types/roles";

export class FeedbackService {
  async createFeedback(mentorId: string, input: CreateFeedbackInput) {
    try {
      // Verify application exists
      const application = await prisma.application.findUnique({
        where: { id: input.applicationId },
      });

      if (!application) {
        throw new Error("Application not found");
      }

      // TODO: Verify mentor is assigned to the student
      // For now, allow any mentor to provide feedback

      const feedback = await prisma.feedback.create({
        data: {
          applicationId: input.applicationId,
          mentorId,
          content: input.content,
          tags: input.tags,
          priority: input.priority,
        },
        include: {
          mentor: {
            select: {
              id: true,
              email: true,
            },
          },
          application: {
            select: {
              id: true,
              company: true,
              role: true,
              status: true,
            },
          },
        },
      });

      // TODO: Create notification for student
      // TODO: Send email notification

      return feedback;
    } catch (error) {
      logger.error("Create feedback error", error);
      throw error;
    }
  }

  async getFeedbackById(feedbackId: string, user: RequestUser) {
    try {
      const feedback = await prisma.feedback.findUnique({
        where: { id: feedbackId },
        include: {
          mentor: {
            select: {
              id: true,
              email: true,
            },
          },
          application: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!feedback) {
        throw new Error("Feedback not found");
      }

      // Check permissions
      if (user.role === UserRole.STUDENT) {
        // Student can only see feedback on their own applications
        if (feedback.application.userId !== user.id) {
          throw new Error("Forbidden");
        }
      } else if (user.role === UserRole.MENTOR) {
        // Mentor can only see their own feedback
        if (feedback.mentorId !== user.id) {
          throw new Error("Forbidden");
        }
      }
      // ADMIN can see all

      return feedback;
    } catch (error) {
      logger.error("Get feedback error", error);
      throw error;
    }
  }

  async listFeedback(user: RequestUser, query: ListFeedbackQuery) {
    try {
      const page = query.page || PAGINATION.DEFAULT_PAGE;
      const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
      const skip = (page - 1) * limit;

      // Build where clause based on user role
      const where: any = {};

      if (user.role === UserRole.STUDENT) {
        // Students see feedback on their own applications
        where.application = {
          userId: user.id,
        };
      } else if (user.role === UserRole.MENTOR) {
        // Mentors see their own feedback
        where.mentorId = user.id;
      }
      // ADMIN can see all, so no filter

      if (query.applicationId) {
        where.applicationId = query.applicationId;
      }

      if (query.mentorId) {
        where.mentorId = query.mentorId;
      }

      if (query.priority) {
        where.priority = query.priority;
      }

      if (query.tags && query.tags.length > 0) {
        where.tags = {
          hasSome: query.tags,
        };
      }

      const [feedback, total] = await Promise.all([
        prisma.feedback.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            mentor: {
              select: {
                id: true,
                email: true,
              },
            },
            application: {
              select: {
                id: true,
                company: true,
                role: true,
                status: true,
              },
            },
          },
        }),
        prisma.feedback.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        feedback,
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
      logger.error("List feedback error", error);
      throw error;
    }
  }

  async updateFeedback(feedbackId: string, mentorId: string, input: UpdateFeedbackInput) {
    try {
      // Check ownership
      const existing = await prisma.feedback.findUnique({
        where: { id: feedbackId },
      });

      if (!existing) {
        throw new Error("Feedback not found");
      }

      if (existing.mentorId !== mentorId) {
        throw new Error("Forbidden");
      }

      const updateData: any = {};
      if (input.content !== undefined) updateData.content = input.content;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.priority !== undefined) updateData.priority = input.priority;

      const feedback = await prisma.feedback.update({
        where: { id: feedbackId },
        data: updateData,
        include: {
          mentor: {
            select: {
              id: true,
              email: true,
            },
          },
          application: {
            select: {
              id: true,
              company: true,
              role: true,
              status: true,
            },
          },
        },
      });

      return feedback;
    } catch (error) {
      logger.error("Update feedback error", error);
      throw error;
    }
  }

  async deleteFeedback(feedbackId: string, mentorId: string) {
    try {
      // Check ownership
      const existing = await prisma.feedback.findUnique({
        where: { id: feedbackId },
      });

      if (!existing) {
        throw new Error("Feedback not found");
      }

      if (existing.mentorId !== mentorId) {
        throw new Error("Forbidden");
      }

      await prisma.feedback.delete({
        where: { id: feedbackId },
      });

      return { success: true };
    } catch (error) {
      logger.error("Delete feedback error", error);
      throw error;
    }
  }
}

export const feedbackService = new FeedbackService();

