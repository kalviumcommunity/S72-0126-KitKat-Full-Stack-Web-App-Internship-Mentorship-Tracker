import { prisma } from "../../lib/prisma";
import { NotFoundError, AuthorizationError, ValidationError } from "../../middlewares/error.middleware";
import { UserRole } from "../../types/roles";
import { RequestUser } from "../../types/api";
import { CreateFeedbackInput, UpdateFeedbackInput, FeedbackQueryParams } from "./feedback.schema";
import { logger } from "../../lib/logger";

export class FeedbackService {
  // Create feedback (Mentors only)
  async createFeedback(mentorId: string, data: CreateFeedbackInput) {
    // Verify application exists
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { user: true },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Verify mentor is assigned to the student
    const assignment = await prisma.mentorAssignment.findFirst({
      where: {
        mentorId: mentorId,
        studentId: application.userId,
        isActive: true,
      },
    });

    if (!assignment) {
      throw new AuthorizationError(
        "You are not assigned as a mentor to this student"
      );
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        applicationId: data.applicationId,
        mentorId: mentorId,
        content: data.content,
        tags: data.tags,
        priority: data.priority,
      },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
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

    // Create notification for student
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: "FEEDBACK_RECEIVED",
        title: "New Feedback Received",
        message: `You received new feedback from ${feedback.mentor.firstName || "your mentor"} on your ${application.company} application`,
      },
    });

    logger.info("Feedback created", {
      feedbackId: feedback.id,
      mentorId,
      applicationId: data.applicationId,
      studentId: application.userId,
    });

    return feedback;
  }

  // Get feedback by ID
  async getFeedbackById(feedbackId: string, user: RequestUser) {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        application: {
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
        },
      },
    });

    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    // Authorization check
    await this.checkFeedbackAccess(feedback, user);

    return feedback;
  }

  // List feedback with filters
  async listFeedback(user: RequestUser, queryParams: FeedbackQueryParams) {
    const {
      page = 1,
      limit = 20,
      applicationId,
      mentorId,
      tags,
      priority,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryParams;

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};

    // Role-based filtering
    if (user.role === UserRole.STUDENT) {
      // Students can only see feedback on their applications
      where.application = {
        userId: user.id,
      };
    } else if (user.role === UserRole.MENTOR) {
      // Mentors can only see feedback they gave or on their assigned students' applications
      where.OR = [
        { mentorId: user.id },
        {
          application: {
            user: {
              studentAssignments: {
                some: {
                  mentorId: user.id,
                  isActive: true,
                },
              },
            },
          },
        },
      ];
    }
    // Admins can see all feedback (no additional filter)

    // Apply query filters
    if (applicationId) {
      where.applicationId = applicationId;
    }

    if (mentorId) {
      where.mentorId = mentorId;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.tags = {
        hasSome: tagArray,
      };
    }

    if (priority) {
      const priorityArray = Array.isArray(priority) ? priority : [priority];
      where.priority = {
        in: priorityArray,
      };
    }

    // Execute query
    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          mentor: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          application: {
            select: {
              id: true,
              company: true,
              role: true,
              status: true,
              userId: true,
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
  }

  // Update feedback (Mentor who created it only)
  async updateFeedback(feedbackId: string, mentorId: string, data: UpdateFeedbackInput) {
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        application: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingFeedback) {
      throw new NotFoundError("Feedback not found");
    }

    // Only the mentor who created the feedback can update it
    if (existingFeedback.mentorId !== mentorId) {
      throw new AuthorizationError("You can only update your own feedback");
    }

    const feedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        ...(data.content && { content: data.content }),
        ...(data.tags && { tags: data.tags }),
        ...(data.priority && { priority: data.priority }),
      },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
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

    logger.info("Feedback updated", {
      feedbackId,
      mentorId,
      updatedFields: Object.keys(data),
    });

    return feedback;
  }

  // Delete feedback (Mentor who created it or admin)
  async deleteFeedback(feedbackId: string, user: RequestUser) {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    // Only the mentor who created the feedback or admin can delete it
    if (user.role !== UserRole.ADMIN && feedback.mentorId !== user.id) {
      throw new AuthorizationError("You can only delete your own feedback");
    }

    await prisma.feedback.delete({
      where: { id: feedbackId },
    });

    logger.info("Feedback deleted", {
      feedbackId,
      userId: user.id,
      userRole: user.role,
    });
  }

  // Get feedback statistics
  async getFeedbackStats(user: RequestUser) {
    const where: any = {};

    // Role-based filtering
    if (user.role === UserRole.STUDENT) {
      where.application = {
        userId: user.id,
      };
    } else if (user.role === UserRole.MENTOR) {
      where.mentorId = user.id;
    }
    // Admins see all stats

    const [total, byPriority, byTag, recent] = await Promise.all([
      prisma.feedback.count({ where }),
      prisma.feedback.groupBy({
        by: ["priority"],
        where,
        _count: true,
      }),
      prisma.feedback.findMany({
        where,
        select: { tags: true },
      }),
      prisma.feedback.findMany({
        where,
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          mentor: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
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
    ]);

    // Count tags
    const tagCounts: Record<string, number> = {};
    byTag.forEach((feedback) => {
      feedback.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      total,
      byPriority: byPriority.reduce(
        (acc, item) => {
          acc[item.priority] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      byTag: tagCounts,
      recent,
    };
  }

  // Get feedback for a specific application
  async getFeedbackForApplication(applicationId: string, user: RequestUser) {
    // Verify application exists and user has access
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
      },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Check access
    if (user.role === UserRole.STUDENT && application.userId !== user.id) {
      throw new AuthorizationError("You can only view feedback on your own applications");
    }

    if (user.role === UserRole.MENTOR) {
      const assignment = await prisma.mentorAssignment.findFirst({
        where: {
          mentorId: user.id,
          studentId: application.userId,
          isActive: true,
        },
      });

      if (!assignment) {
        throw new AuthorizationError("You can only view feedback for your assigned students");
      }
    }

    const feedback = await prisma.feedback.findMany({
      where: { applicationId },
      orderBy: { createdAt: "desc" },
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
    });

    return feedback;
  }

  // Private helper: Check feedback access
  private async checkFeedbackAccess(feedback: any, user: RequestUser) {
    // Admins can access all feedback
    if (user.role === UserRole.ADMIN) {
      return;
    }

    // Students can only see feedback on their applications
    if (user.role === UserRole.STUDENT) {
      if (feedback.application.userId !== user.id) {
        throw new AuthorizationError("You can only view feedback on your own applications");
      }
      return;
    }

    // Mentors can see feedback they gave or on their assigned students' applications
    if (user.role === UserRole.MENTOR) {
      if (feedback.mentorId === user.id) {
        return;
      }

      const assignment = await prisma.mentorAssignment.findFirst({
        where: {
          mentorId: user.id,
          studentId: feedback.application.userId,
          isActive: true,
        },
      });

      if (!assignment) {
        throw new AuthorizationError("You can only view feedback for your assigned students");
      }
      return;
    }

    throw new AuthorizationError("Access denied");
  }
}

export const feedbackService = new FeedbackService();
