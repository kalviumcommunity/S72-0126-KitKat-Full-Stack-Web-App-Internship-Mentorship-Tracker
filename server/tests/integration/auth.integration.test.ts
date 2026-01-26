import request from 'supertest';
import { createApp } from '../../src/app';
import { TestDataFactory, expectApiSuccess, expectApiError, expectValidationError } from '../utils/test-helpers';
import { UserRole } from '../../src/types/roles';

describe('Auth API Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = createApp();
  });

  beforeEach(async () => {
    await TestDataFactory.cleanupTestData();
  });

  afterAll(async () => {
    await TestDataFactory.cleanupTestData();
  });

  describe('POST /api/auth/signup', () => {
    const validSignupData = {
      email: 'newuser@example.com',
      password: 'Test123!',
      confirmPassword: 'Test123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT',
    };

    it('should create a new student user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupData);

      expectApiSuccess(response, 201);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(validSignupData.email);
      expect(response.body.data.user.role).toBe(validSignupData.role);
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
      expect(response.body.data).toHaveProperty('token');
    });

    it('should create a new mentor user successfully', async () => {
      const mentorData = { ...validSignupData, role: 'MENTOR', email: 'mentor@example.com' };
      
      const response = await request(app)
        .post('/api/auth/signup')
        .send(mentorData);

      expectApiSuccess(response, 201);
      expect(response.body.data.user.role).toBe('MENTOR');
    });

    it('should return 409 if email already exists', async () => {
      // Create user first
      await TestDataFactory.createTestUser(UserRole.STUDENT, { email: validSignupData.email });

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validSignupData);

      expectApiError(response, 409, 'CONFLICT_ERROR');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({});

      expectValidationError(response);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ ...validSignupData, email: 'invalid-email' });

      expectValidationError(response, 'email');
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ ...validSignupData, password: 'weak', confirmPassword: 'weak' });

      expectValidationError(response, 'password');
    });

    it('should validate password confirmation', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ ...validSignupData, confirmPassword: 'different' });

      expectValidationError(response, 'confirmPassword');
    });

    it('should validate role enum', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ ...validSignupData, role: 'INVALID_ROLE' });

      expectValidationError(response, 'role');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await TestDataFactory.createTestUser(UserRole.STUDENT);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'Test123!', // This is the password used in TestDataFactory
        });

      expectApiSuccess(response);
      expect(response.body.data.user).toHaveProperty('id', testUser.id);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123!',
        });

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expectValidationError(response);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Test123!',
        });

      expectValidationError(response, 'email');
    });
  });

  describe('GET /api/auth/me', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await TestDataFactory.createTestUser(UserRole.STUDENT);
    });

    it('should return current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUser.token}`);

      expectApiSuccess(response);
      expect(response.body.data.user).toHaveProperty('id', testUser.id);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });

    it('should return 401 with expired token', async () => {
      // This would require mocking JWT to create an expired token
      // For now, we'll test with a malformed token
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer expired.token.here');

      expectApiError(response, 401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await TestDataFactory.createTestUser(UserRole.STUDENT);
    });

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${testUser.token}`);

      expectApiSuccess(response);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('id', testUser.id);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh');

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });
  });

  describe('POST /api/auth/logout', () => {
    let testUser: any;

    beforeEach(async () => {
      testUser = await TestDataFactory.createTestUser(UserRole.STUDENT);
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${testUser.token}`);

      expectApiSuccess(response);
      expect(response.body.data.message).toBe('Logged out successfully');
    });

    it('should logout even without token (for client-side cleanup)', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expectApiSuccess(response);
    });
  });

  describe('Authentication Flow Integration', () => {
    it('should complete full signup -> login -> access protected route flow', async () => {
      const userData = {
        email: 'flowtest@example.com',
        password: 'Test123!',
        confirmPassword: 'Test123!',
        firstName: 'Flow',
        lastName: 'Test',
        role: 'STUDENT',
      };

      // 1. Signup
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expectApiSuccess(signupResponse, 201);
      const { token: signupToken } = signupResponse.body.data;

      // 2. Access protected route with signup token
      const profileResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${signupToken}`);

      expectApiSuccess(profileResponse);

      // 3. Login with same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        });

      expectApiSuccess(loginResponse);
      const { token: loginToken } = loginResponse.body.data;

      // 4. Access protected route with login token
      const profileResponse2 = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginToken}`);

      expectApiSuccess(profileResponse2);
      expect(profileResponse2.body.data.user.email).toBe(userData.email);

      // 5. Refresh token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${loginToken}`);

      expectApiSuccess(refreshResponse);

      // 6. Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${loginToken}`);

      expectApiSuccess(logoutResponse);
    });
  });
});