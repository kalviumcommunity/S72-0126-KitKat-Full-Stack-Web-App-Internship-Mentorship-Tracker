import { prisma } from "../../lib/prisma";
import { logger } from "../../lib/logger";
import { NotFoundError, ConflictError } from "../../middlewares/error.middleware";
import { UserRole } from "@prisma/client";

export class UserService {
  async listUsers(query: any) {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      isActive,
    } = query;

    const skip = (page - 1) * limit;
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          profileImageUrl: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        isActive: true,
        updatedAt: true,
      },
    });

    logger.info("User profile updated", { userId, updatedFields: Object.keys(updateData) });

    return user;
  }

  async deactivateUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    if (!user.isActive) {
      throw new ConflictError("User is already deactivated");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    logger.info("User deactivated", { userId });
  }

  async activateUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    if (user.isActive) {
      throw new ConflictError("User is already active");
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        updatedAt: new Date(),
      },
    });

    logger.info("User activated", { userId });
  }

  async getUserMentors(studentId: string) {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundError("Student");
    }

    const assignments = await prisma.mentorAssignment.findMany({
      where: {
        studentId,
        isActive: true,
      },
      include: {
        mentor: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return assignments.map(assignment => ({
      ...assignment.mentor,
      assignedAt: assignment.assignedAt,
    }));
  }

  async getMentorStudents(mentorId: string) {
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      throw new NotFoundError("Mentor");
    }

    const assignments = await prisma.mentorAssignment.findMany({
      where: {
        mentorId,
        isActive: true,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return assignments.map(assignment => ({
      ...assignment.student,
      assignedAt: assignment.assignedAt,
    }));
  }

  async assignMentor(data: { mentorId: string; studentId: string }) {
    const { mentorId, studentId } = data;

    // Verify mentor exists and has correct role
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
    });

    if (!mentor) {
      throw new NotFoundError("Mentor");
    }

    if (mentor.role !== UserRole.MENTOR) {
      throw new ConflictError("User is not a mentor");
    }

    // Verify student exists and has correct role
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundError("Student");
    }

    if (student.role !== UserRole.STUDENT) {
      throw new ConflictError("User is not a student");
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.mentorAssignment.findFirst({
      where: {
        mentorId,
        studentId,
        isActive: true,
      },
    });

    if (existingAssignment) {
      throw new ConflictError("Mentor is already assigned to this student");
    }

    const assignment = await prisma.mentorAssignment.create({
      data: {
        mentorId,
        studentId,
        isActive: true,
        assignedAt: new Date(),
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
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    logger.info("Mentor assigned to student", { mentorId, studentId });

    return assignment;
  }

  async unassignMentor(data: { mentorId: string; studentId: string }) {
    const { mentorId, studentId } = data;

    const assignment = await prisma.mentorAssignment.findFirst({
      where: {
        mentorId,
        studentId,
        isActive: true,
      },
    });

    if (!assignment) {
      throw new NotFoundError("Active mentor assignment");
    }

    await prisma.mentorAssignment.update({
      where: { id: assignment.id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    logger.info("Mentor unassigned from student", { mentorId, studentId });
  }
}

export const userService = new UserService();