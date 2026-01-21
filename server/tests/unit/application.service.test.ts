import { ApplicationService } from '../../src/api/applications/application.service';
import { prisma } from '../../src/lib/prisma';
import { NotFoundError, ValidationError } from '../../src/middlewares/error.middleware';
import { UserRole } from '../../src/types/roles';

// Mock dependencies
jest.mock('../../src/lib/prisma');
jest.mock('../../src/lib/cache');

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('ApplicationService', () => {
  let applicationService: ApplicationService;

  beforeEach(() => {
    applicationService = new ApplicationService();
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: UserRole.STUDENT,
  };

  const mockApplication = {
    id: 'app-123',
    userId: 'user-123',
    company: 'Test Company',
    role: 'Software Engineer',
    platform: 'LINKEDIN',
    status: 'APPLIED',
    notes: 'Test notes',
    appliedDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('createApplication', () => {
    const applicationData = {
      company: 'Test Company',
      role: 'Software Engineer',
      platform: 'LINKEDIN',
      status: 'APPLIED',
      notes: 'Test notes',
      appliedDate: new Date(),
    };

    it('should create application successfully', async () => {
      mockPrisma.application.count.mockResolvedValue(5); // Under limit
      mockPrisma.application.findFirst.mockResolvedValue(null); // No duplicate
      mockPrisma.application.create.mockResolvedValue(mockApplication as any);

      const result = await applicationService.createApplication(mockUser, applicationData as any);

      expect(mockPrisma.application.count).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
      expect(mockPrisma.application.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          company: applicationData.company,
          role: applicationData.role,
        },
      });
      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: {
          ...applicationData,
          userId: mockUser.id,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockApplication);
    });

    it('should throw ValidationError if application limit exceeded', async () => {
      mockPrisma.application.count.mockResolvedValue(100); // At limit

      await expect(
        applicationService.createApplication(mockUser, applicationData as any)
      ).rejects.toThrow(ValidationError);

      expect(mockPrisma.application.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError if duplicate application exists', async () => {
      mockPrisma.application.count.mockResolvedValue(5);
      mockPrisma.application.findFirst.mockResolvedValue(mockApplication as any);

      await expect(
        applicationService.createApplication(mockUser, applicationData as any)
      ).rejects.toThrow(ValidationError);

      expect(mockPrisma.application.create).not.toHaveBeenCalled();
    });
  });

  describe('getApplicationById', () => {
    it('should return application if user owns it', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication as any);

      const result = await applicationService.getApplicationById(mockUser, 'app-123');

      expect(mockPrisma.application.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-123' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundError if application not found', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      await expect(
        applicationService.getApplicationById(mockUser, 'invalid-id')
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError if user does not own application', async () => {
      const otherUserApp = { ...mockApplication, userId: 'other-user' };
      mockPrisma.application.findUnique.mockResolvedValue(otherUserApp as any);

      await expect(
        applicationService.getApplicationById(mockUser, 'app-123')
      ).rejects.toThrow(NotFoundError);
    });

    it('should allow admin to access any application', async () => {
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      const otherUserApp = { ...mockApplication, userId: 'other-user' };
      mockPrisma.application.findUnique.mockResolvedValue(otherUserApp as any);

      const result = await applicationService.getApplicationById(adminUser, 'app-123');

      expect(result).toEqual(otherUserApp);
    });
  });

  describe('listApplications', () => {
    const query = {
      page: 1,
      limit: 10,
      search: 'test',
      status: 'APPLIED',
    };

    it('should list applications for student user', async () => {
      const mockApplications = [mockApplication];
      mockPrisma.application.findMany.mockResolvedValue(mockApplications as any);
      mockPrisma.application.count.mockResolvedValue(1);

      const result = await applicationService.listApplications(mockUser, query as any);

      expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          userId: mockUser.id,
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
      expect(result).toHaveProperty('items', mockApplications);
      expect(result).toHaveProperty('pagination');
    });

    it('should list all applications for admin user', async () => {
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      const mockApplications = [mockApplication];
      mockPrisma.application.findMany.mockResolvedValue(mockApplications as any);
      mockPrisma.application.count.mockResolvedValue(1);

      await applicationService.listApplications(adminUser, query as any);

      expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
        where: expect.not.objectContaining({
          userId: expect.any(String),
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
    });

    it('should apply search filter correctly', async () => {
      mockPrisma.application.findMany.mockResolvedValue([]);
      mockPrisma.application.count.mockResolvedValue(0);

      await applicationService.listApplications(mockUser, query as any);

      expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { company: { contains: 'test', mode: 'insensitive' } },
            { role: { contains: 'test', mode: 'insensitive' } },
          ]),
        }),
        include: expect.any(Object),
        orderBy: expect.any(Object),
        skip: 0,
        take: 10,
      });
    });
  });

  describe('updateApplication', () => {
    const updateData = {
      status: 'INTERVIEW',
      notes: 'Updated notes',
    };

    it('should update application successfully', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication as any);
      const updatedApp = { ...mockApplication, ...updateData };
      mockPrisma.application.update.mockResolvedValue(updatedApp as any);

      const result = await applicationService.updateApplication(
        mockUser,
        'app-123',
        updateData as any
      );

      expect(mockPrisma.application.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
      expect(mockPrisma.application.update).toHaveBeenCalledWith({
        where: { id: 'app-123' },
        data: updateData,
        include: expect.any(Object),
      });
      expect(result).toEqual(updatedApp);
    });

    it('should throw NotFoundError if application not found', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      await expect(
        applicationService.updateApplication(mockUser, 'invalid-id', updateData as any)
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.application.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if user does not own application', async () => {
      const otherUserApp = { ...mockApplication, userId: 'other-user' };
      mockPrisma.application.findUnique.mockResolvedValue(otherUserApp as any);

      await expect(
        applicationService.updateApplication(mockUser, 'app-123', updateData as any)
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.application.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteApplication', () => {
    it('should delete application successfully', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(mockApplication as any);
      mockPrisma.application.delete.mockResolvedValue(mockApplication as any);

      const result = await applicationService.deleteApplication(mockUser, 'app-123');

      expect(mockPrisma.application.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
      expect(mockPrisma.application.delete).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
      expect(result).toEqual({ message: 'Application deleted successfully' });
    });

    it('should throw NotFoundError if application not found', async () => {
      mockPrisma.application.findUnique.mockResolvedValue(null);

      await expect(
        applicationService.deleteApplication(mockUser, 'invalid-id')
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.application.delete).not.toHaveBeenCalled();
    });
  });

  describe('getApplicationStats', () => {
    it('should return application statistics', async () => {
      const mockStats = [
        { status: 'APPLIED', _count: { status: 5 } },
        { status: 'INTERVIEW', _count: { status: 3 } },
        { status: 'OFFER', _count: { status: 1 } },
      ];
      mockPrisma.application.groupBy.mockResolvedValue(mockStats as any);
      mockPrisma.application.count.mockResolvedValue(9);

      const result = await applicationService.getApplicationStats(mockUser);

      expect(mockPrisma.application.groupBy).toHaveBeenCalledWith({
        by: ['status'],
        where: { userId: mockUser.id },
        _count: { status: true },
      });
      expect(result).toHaveProperty('totalApplications', 9);
      expect(result).toHaveProperty('statusBreakdown');
      expect(result.statusBreakdown).toHaveProperty('APPLIED', 5);
      expect(result.statusBreakdown).toHaveProperty('INTERVIEW', 3);
      expect(result.statusBreakdown).toHaveProperty('OFFER', 1);
    });

    it('should return stats for all users if admin', async () => {
      const adminUser = { ...mockUser, role: UserRole.ADMIN };
      mockPrisma.application.groupBy.mockResolvedValue([]);
      mockPrisma.application.count.mockResolvedValue(0);

      await applicationService.getApplicationStats(adminUser);

      expect(mockPrisma.application.groupBy).toHaveBeenCalledWith({
        by: ['status'],
        where: {}, // No userId filter for admin
        _count: { status: true },
      });
    });
  });
});