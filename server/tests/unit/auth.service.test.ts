import { AuthService } from '../../src/api/auth/auth.service';
import { prisma } from '../../src/lib/prisma';
import { hashPassword, comparePassword } from '../../src/lib/password';
import { ConflictError, AuthenticationError } from '../../src/middlewares/error.middleware';
import { UserRole } from '../../src/types/roles';

// Mock dependencies
jest.mock('../../src/lib/prisma');
jest.mock('../../src/lib/password');
jest.mock('../../src/lib/jwt');

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockComparePassword = comparePassword as jest.MockedFunction<typeof comparePassword>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupData = {
      email: 'test@example.com',
      password: 'Test123!',
      confirmPassword: 'Test123!',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.STUDENT,
    };

    it('should create a new user successfully', async () => {
      // Mock user doesn't exist
      mockPrisma.user.findUnique.mockResolvedValue(null);
      
      // Mock password hashing
      mockHashPassword.mockResolvedValue('hashed-password');
      
      // Mock user creation
      const mockUser = {
        id: 'user-123',
        email: signupData.email,
        role: signupData.role,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        isActive: true,
        createdAt: new Date(),
      };
      mockPrisma.user.create.mockResolvedValue(mockUser as any);

      const result = await authService.signup(signupData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: signupData.email },
      });
      expect(mockHashPassword).toHaveBeenCalledWith(signupData.password);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: signupData.email,
          passwordHash: 'hashed-password',
          role: signupData.role,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          isActive: true,
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictError if email already exists', async () => {
      // Mock user exists
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: signupData.email,
      } as any);

      await expect(authService.signup(signupData)).rejects.toThrow(ConflictError);
      expect(mockHashPassword).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockHashPassword.mockResolvedValue('hashed-password');
      mockPrisma.user.create.mockRejectedValue(new Error('Database error'));

      await expect(authService.signup(signupData)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Test123!',
    };

    const mockUser = {
      id: 'user-123',
      email: loginData.email,
      passwordHash: 'hashed-password',
      role: UserRole.STUDENT,
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    };

    it('should login successfully with valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockComparePassword.mockResolvedValue(true);
      mockPrisma.user.update.mockResolvedValue(mockUser as any);

      const result = await authService.login(loginData);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(mockComparePassword).toHaveBeenCalledWith(
        loginData.password,
        mockUser.passwordHash
      );
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) },
        select: expect.any(Object),
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw AuthenticationError if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
      expect(mockComparePassword).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError if password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);
      mockComparePassword.mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw AuthenticationError if user is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockPrisma.user.findUnique.mockResolvedValue(inactiveUser as any);
      mockComparePassword.mockResolvedValue(true);

      await expect(authService.login(loginData)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token for valid user', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        role: UserRole.STUDENT,
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await authService.refreshToken(userId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Object),
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
    });

    it('should throw AuthenticationError if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.refreshToken('invalid-id')).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError if user is inactive', async () => {
      const inactiveUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.STUDENT,
        isActive: false,
      };

      mockPrisma.user.findUnique.mockResolvedValue(inactiveUser as any);

      await expect(authService.refreshToken('user-123')).rejects.toThrow(AuthenticationError);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const result = await authService.logout();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});