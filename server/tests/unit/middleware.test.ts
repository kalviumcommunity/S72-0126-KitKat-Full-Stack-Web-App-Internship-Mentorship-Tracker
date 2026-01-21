import { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuthenticate } from '../../src/middlewares/auth.middleware';
import { requireRole, requireMinRole } from '../../src/middlewares/rbac.middleware';
import { validateRequest } from '../../src/middlewares/validation.middleware';
import { errorHandler } from '../../src/middlewares/error.middleware';
import { verifyToken } from '../../src/lib/jwt';
import { UserRole } from '../../src/types/roles';
import { z } from 'zod';

// Mock dependencies
jest.mock('../../src/lib/jwt');

const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('Middleware Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {},
      body: {},
      query: {},
      params: {},
      ip: '127.0.0.1',
      url: '/test',
      method: 'GET',
      get: jest.fn().mockReturnValue('test-user-agent'),
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate middleware', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: UserRole.STUDENT,
    };

    it('should authenticate user with valid Bearer token', () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockVerifyToken.mockReturnValue(mockUser);

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should authenticate user with valid cookie token', () => {
      mockReq.cookies = { 'auth-token': 'valid-token' };
      mockVerifyToken.mockReturnValue(mockUser);

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with error if no token provided', () => {
      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockReq.user).toBeUndefined();
    });

    it('should call next with error if token is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      expect(mockReq.user).toBeUndefined();
    });

    it('should prefer Authorization header over cookie', () => {
      mockReq.headers = { authorization: 'Bearer header-token' };
      mockReq.cookies = { 'auth-token': 'cookie-token' };
      mockVerifyToken.mockReturnValue(mockUser);

      authenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockVerifyToken).toHaveBeenCalledWith('header-token');
    });
  });

  describe('optionalAuthenticate middleware', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: UserRole.STUDENT,
    };

    it('should authenticate user if valid token provided', () => {
      mockReq.headers = { authorization: 'Bearer valid-token' };
      mockVerifyToken.mockReturnValue(mockUser);

      optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without authentication if no token provided', () => {
      optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without authentication if token is invalid', () => {
      mockReq.headers = { authorization: 'Bearer invalid-token' };
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      optionalAuthenticate(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('requireRole middleware', () => {
    it('should allow access if user has required role', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.STUDENT,
      };

      const middleware = requireRole(UserRole.STUDENT);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access if user has one of multiple required roles', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.MENTOR,
      };

      const middleware = requireRole(UserRole.STUDENT, UserRole.MENTOR);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access if user does not have required role', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.STUDENT,
      };

      const middleware = requireRole(UserRole.MENTOR);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should deny access if user is not authenticated', () => {
      const middleware = requireRole(UserRole.STUDENT);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('requireMinRole middleware', () => {
    it('should allow access if user has exact minimum role', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.MENTOR,
      };

      const middleware = requireMinRole(UserRole.MENTOR);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow access if user has higher role than minimum', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };

      const middleware = requireMinRole(UserRole.MENTOR);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should deny access if user has lower role than minimum', () => {
      mockReq.user = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.STUDENT,
      };

      const middleware = requireMinRole(UserRole.MENTOR);
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('validateRequest middleware', () => {
    it('should validate request body successfully', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      mockReq.body = { name: 'John', age: 25 };

      const middleware = validateRequest({ body: schema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.body).toEqual({ name: 'John', age: 25 });
    });

    it('should validate query parameters successfully', () => {
      const schema = z.object({
        page: z.coerce.number(),
        limit: z.coerce.number(),
      });

      mockReq.query = { page: '1', limit: '10' };

      const middleware = validateRequest({ query: schema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(mockReq.query).toEqual({ page: 1, limit: 10 });
    });

    it('should call next with validation error for invalid data', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      mockReq.body = { name: 'John', age: 'invalid' };

      const middleware = validateRequest({ body: schema });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should validate multiple request parts', () => {
      const bodySchema = z.object({ name: z.string() });
      const querySchema = z.object({ page: z.coerce.number() });

      mockReq.body = { name: 'John' };
      mockReq.query = { page: '1' };

      const middleware = validateRequest({ 
        body: bodySchema, 
        query: querySchema 
      });
      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('errorHandler middleware', () => {
    it('should handle custom AppError', () => {
      const error = new Error('Test error');
      error.name = 'ValidationError';
      (error as any).statusCode = 422;
      (error as any).code = 'VALIDATION_ERROR';

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Test error',
        },
      });
    });

    it('should handle Zod validation errors', () => {
      const zodError = new z.ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string, received number',
        },
      ]);

      errorHandler(zodError, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(422);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: {
            name: ['Expected string, received number'],
          },
        },
      });
    });

    it('should handle JWT errors', () => {
      const jwtError = new Error('Invalid token');
      jwtError.name = 'JsonWebTokenError';

      errorHandler(jwtError, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token',
        },
      });
    });

    it('should handle generic errors', () => {
      const error = new Error('Generic error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Generic error',
        },
      });
    });
  });
});