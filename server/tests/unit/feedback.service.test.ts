import { FeedbackService } from '../../src/api/feedback/feedback.service';
import { prisma } from '../../src/lib/prisma';
import { emailService } from '../../src/lib/email';
import { NotFoundError, AuthorizationError } from '../../src/middlewares/error.middleware';
import { UserRole } from "@prisma/client";

// Mock dependencies
jest.mock('../../src/lib/prisma');
jest.mock('../../src/lib/email');

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockEmailService = emailService as jest.Mocked<typeof emailService>;

describe('FeedbackService', () => {
  let feedbackService: FeedbackService;

  beforeEach(() => {
    feedbackService = new FeedbackService();
    jest.clearAllMocks();
  });

  const mockMentor = {
    id: 'mentor-123',
    email: 'mentor@example.com',
    role: UserRole.MENTOR,
  };

  const mockStudent = {
    id: 'student-123',
    email: 'student@example.com',
    role: UserRole.STUDENT,
  };

  const mockApplication = {
    id: 'app-123',
    userId: 'student-123',
    company: 'Test Company',
    role: 'Software Engineer',
    user: mockStudent,
  };

  const mockFeedback = {
    id: 'feedback-123',
    mentorId: 'mentor-123',
    applicationId: 'app-123',
    content: 'Great application!',
    tags: ['RESUME'],
    priority: 'HIGH',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('createFeedback', () => {
    const feedbackData = {
      applicationId: 'app-123',
      content: 'Great application! Keep up the good work.',
      tags: ['RESUME', 'COMMUNICATION'],
      priority: 'HIGH',
    };

    it('should create feedback successfully', async () => {
      // Mock application exists and mentor is assigned
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication as any);
      mockPrisma.mentorAssignment.findFirst.mockResolvedValue({
        id: 'assignment-123',
        mentorId: mockMentor.id,
        studentId: mockStudent.id,
      } as any);
      mockPrisma.feedback.create.mockResolvedValue({
        ...mockFeedback,
        application: mockApplication,
        mentor: mockMentor,
      } as any);

      const result = await feedbackService.createFeedback(mockMentor, feedbackData as any);

      expect(mockPrisma.application.findUnique).toHaveBeenCalledWith({
        where: { id: feedbackData.applicationId },
        include: { user: true },
      });
      expect(mockPrisma.mentorAssignment.findFirst).toHaveBeenCalledWith({
        where: {
          mentorId: mockMentor.id,
          studentId: mockApplication.userId,
          isActive: true,
        },
      });
      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: {
          ...feedbackData,
          mentorId: mockMentor.id,
        },
        include: expect.any(Object),
      });
      expect(mockEmailService.sendFeedbackNotification).toHaveBeenCalled();
      expect(result).toHaveProperty('id', mockFeedback.id);
    });

    it('should throw NotFoundError if application not found', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      await expect(
        feedbackService.createFeedback(mockMentor, feedbackData as any)
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.feedback.create).not.toHaveBeenCalled();
    });

    it('should throw AuthorizationError if mentor not assigned to student', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication as any);
      mockPrisma.mentorAssignment.findFirst.mockResolvedValue(null);

      await expect(
        feedbackService.createFeedback(mockMentor, feedbackData as any)
      ).rejects.toThrow(AuthorizationError);

      expect(mockPrisma.feedback.create).not.toHaveBeenCalled();
    });

    it('should allow admin to create feedback without assignment check', async () => {
      const adminUser = { ...mockMentor, role: UserRole.ADMIN };
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication as any);
      mockPrisma.feedback.create.mockResolvedValue({
        ...mockFeedback,
        application: mockApplication,
        mentor: adminUser,
      } as any);

      await feedbackService.createFeedback(adminUser, feedbackData as any);

      expect(mockPrisma.mentorAssignment.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.feedback.create).toHaveBeenCalled();
    });
  });

  describe('getFeedbackById', () => {
    it('should return feedback if user has access', async () => {
      const feedbackWithDetails = {
        ...mockFeedback,
        application: mockApplication,
        mentor: mockMentor,
      };
      mockPrisma.feedback.findUnique.mockResolvedValue(feedbackWithDetails as any);

      const result = await feedbackService.getFeedbackById(mockStudent, 'feedback-123');

      expect(mockPrisma.feedback.findUnique).toHaveBeenCalledWith({
        where: { id: 'feedback-123' },
        include: expect.any(Object),
      });
      expect(result).toEqual(feedbackWithDetails);
    });

    it('should throw NotFoundError if feedback not found', async () => {
      mockPrisma.feedback.findUnique.mockResolvedValue(null);

      await expect(
        feedbackService.getFeedbackById(mockStudent, 'invalid-id')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if user has no access to feedback', async () => {
      const otherStudentFeedback = {
        ...mockFeedback,
        application: { ...mockApplication, userId: 'other-student' },
        mentor: mockMentor,
      };
      mockPrisma.feedback.findUnique.mockResolvedValue(otherStudentFeedback as any);

      await expect(
        feedbackService.getFeedbackById(mockStudent, 'feedback-123')
      ).rejects.toThrow(NotFoundError);
    });

    it('should allow mentor to access feedback they created', async () => {
      const feedbackWithDetails = {
        ...mockFeedback,
        application: mockApplication,
        mentor: mockMentor,
      };
      mockPrisma.feedback.findUnique.mockResolvedValue(feedbackWithDetails as any);

      const result = await feedbackService.getFeedbackById(mockMentor, 'feedback-123');

      expect(result).toEqual(feedbackWithDetails);
    });
  });

  describe('listFeedback', () => {
    const query = {
      page: 1,
      limit: 10,
      tags: ['RESUME'],
      priority: 'HIGH',
    };

    it('should list feedback for student (only their feedback)', async () => {
      const mockFeedbackList = [mockFeedback];
      mockPrisma.feedback.findMany.mockResolvedValue(mockFeedbackList as any);
      mockPrisma.feedback.count.mockResolvedValue(1);

      const result = await feedbackService.listFeedback(mockStudent, query as any);

      expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          application: { userId: mockStudent.id },
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
      expect(result).toHaveProperty('items', mockFeedbackList);
      expect(result).toHaveProperty('pagination');
    });

    it('should list feedback for mentor (only feedback they created)', async () => {
      const mockFeedbackList = [mockFeedback];
      mockPrisma.feedback.findMany.mockResolvedValue(mockFeedbackList as any);
      mockPrisma.feedback.count.mockResolvedValue(1);

      const result = await feedbackService.listFeedback(mockMentor, query as any);

      expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          mentorId: mockMentor.id,
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
      expect(result).toHaveProperty('items', mockFeedbackList);
    });

    it('should list all feedback for admin', async () => {
      const adminUser = { ...mockMentor, role: UserRole.ADMIN };
      mockPrisma.feedback.findMany.mockResolvedValue([]);
      mockPrisma.feedback.count.mockResolvedValue(0);

      await feedbackService.listFeedback(adminUser, query as any);

      expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith({
        where: expect.not.objectContaining({
          mentorId: expect.any(String),
          application: expect.any(Object),
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
    });

    it('should apply filters correctly', async () => {
      mockPrisma.feedback.findMany.mockResolvedValue([]);
      mockPrisma.feedback.count.mockResolvedValue(0);

      await feedbackService.listFeedback(mockStudent, query as any);

      expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          tags: { hasSome: ['RESUME'] },
          priority: 'HIGH',
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
    });
  });

  describe('updateFeedback', () => {
    const updateData = {
      content: 'Updated feedback content',
      tags: ['RESUME', 'INTERVIEW'],
      priority: 'MEDIUM',
    };

    it('should update feedback successfully if mentor owns it', async () => {
      mockPrisma.feedback.findUnique.mockResolvedValue(mockFeedback as any);
      const updatedFeedback = { ...mockFeedback, ...updateData };
      mockPrisma.feedback.update.mockResolvedValue(updatedFeedback as any);

      const result = await feedbackService.updateFeedback(
        mockMentor,
        'feedback-123',
        updateData as any
      );

      expect(mockPrisma.feedback.findUnique).toHaveBeenCalledWith({
        where: { id: 'feedback-123' },
      });
      expect(mockPrisma.feedback.update).toHaveBeenCalledWith({
        where: { id: 'feedback-123' },
        data: updateData,
        include: expect.any(Object),
      });
      expect(result).toEqual(updatedFeedback);
    });

    it('should throw NotFoundError if feedback not found', async () => {
      mockPrisma.feedback.findUnique.mockResolvedValue(null);

      await expect(
        feedbackService.updateFeedback(mockMentor, 'invalid-id', updateData as any)
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.feedback.update).not.toHaveBeenCalled();
    });

    it('should throw AuthorizationError if mentor does not own feedback', async () => {
      const otherMentorFeedback = { ...mockFeedback, mentorId: 'other-mentor' };
      mockPrisma.feedback.findUnique.mockResolvedValue(otherMentorFeedback as any);

      await expect(
        feedbackService.updateFeedback(mockMentor, 'feedback-123', updateData as any)
      ).rejects.toThrow(AuthorizationError);

      expect(mockPrisma.feedback.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteFeedback', () => {
    it('should delete feedback successfully if mentor owns it', async () => {
      mockPrisma.feedback.findUnique.mockResolvedValue(mockFeedback as any);
      mockPrisma.feedback.delete.mockResolvedValue(mockFeedback as any);

      const result = await feedbackService.deleteFeedback(mockMentor, 'feedback-123');

      expect(mockPrisma.feedback.findUnique).toHaveBeenCalledWith({
        where: { id: 'feedback-123' },
      });
      expect(mockPrisma.feedback.delete).toHaveBeenCalledWith({
        where: { id: 'feedback-123' },
      });
      expect(result).toEqual({ message: 'Feedback deleted successfully' });
    });

    it('should allow admin to delete any feedback', async () => {
      const adminUser = { ...mockMentor, role: UserRole.ADMIN };
      const otherMentorFeedback = { ...mockFeedback, mentorId: 'other-mentor' };
      mockPrisma.feedback.findUnique.mockResolvedValue(otherMentorFeedback as any);
      mockPrisma.feedback.delete.mockResolvedValue(otherMentorFeedback as any);

      const result = await feedbackService.deleteFeedback(adminUser, 'feedback-123');

      expect(mockPrisma.feedback.delete).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Feedback deleted successfully' });
    });
  });

  describe('getFeedbackStats', () => {
    it('should return feedback statistics for student', async () => {
      const mockStats = [
        { priority: 'HIGH', _count: { priority: 2 } },
        { priority: 'MEDIUM', _count: { priority: 3 } },
      ];
      mockPrisma.feedback.groupBy.mockResolvedValue(mockStats as any);
      mockPrisma.feedback.count.mockResolvedValue(5);

      const result = await feedbackService.getFeedbackStats(mockStudent);

      expect(mockPrisma.feedback.groupBy).toHaveBeenCalledWith({
        by: ['priority'],
        where: { application: { userId: mockStudent.id } },
        _count: { priority: true },
      });
      expect(result).toHaveProperty('totalFeedback', 5);
      expect(result).toHaveProperty('priorityBreakdown');
      expect(result.priorityBreakdown).toHaveProperty('HIGH', 2);
      expect(result.priorityBreakdown).toHaveProperty('MEDIUM', 3);
    });

    it('should return feedback statistics for mentor', async () => {
      mockPrisma.feedback.groupBy.mockResolvedValue([]);
      mockPrisma.feedback.count.mockResolvedValue(0);

      await feedbackService.getFeedbackStats(mockMentor);

      expect(mockPrisma.feedback.groupBy).toHaveBeenCalledWith({
        by: ['priority'],
        where: { mentorId: mockMentor.id },
        _count: { priority: true },
      });
    });
  });
});