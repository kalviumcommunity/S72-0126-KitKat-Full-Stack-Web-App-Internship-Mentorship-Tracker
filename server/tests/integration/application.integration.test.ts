import request from 'supertest';
import { createApp } from '../../src/app';
import { 
  TestDataFactory, 
  createAuthHeaders, 
  expectApiSuccess, 
  expectApiError, 
  expectValidationError 
} from '../utils/test-helpers';
import { UserRole } from '../../src/types/roles';

describe('Application API Integration Tests', () => {
  let app: any;
  let student: any;
  let mentor: any;
  let admin: any;

  beforeAll(async () => {
    app = createApp();
  });

  beforeEach(async () => {
    await TestDataFactory.cleanupTestData();
    
    // Create test users
    student = await TestDataFactory.createTestUser(UserRole.STUDENT);
    mentor = await TestDataFactory.createTestUser(UserRole.MENTOR);
    admin = await TestDataFactory.createTestUser(UserRole.ADMIN);
  });

  afterAll(async () => {
    await TestDataFactory.cleanupTestData();
  });

  describe('POST /api/applications', () => {
    const validApplicationData = {
      company: 'Tech Corp',
      role: 'Software Engineer Intern',
      platform: 'LINKEDIN',
      status: 'APPLIED',
      notes: 'Applied through referral',
      appliedDate: new Date().toISOString(),
    };

    it('should create application successfully for student', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send(validApplicationData);

      expectApiSuccess(response, 201);
      expect(response.body.data.application).toHaveProperty('id');
      expect(response.body.data.application.company).toBe(validApplicationData.company);
      expect(response.body.data.application.userId).toBe(student.id);
    });

    it('should deny access to mentors', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(mentor.token))
        .send(validApplicationData);

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });

    it('should deny access to unauthenticated users', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send(validApplicationData);

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send({});

      expectValidationError(response);
    });

    it('should validate platform enum', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send({ ...validApplicationData, platform: 'INVALID_PLATFORM' });

      expectValidationError(response, 'platform');
    });

    it('should validate status enum', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send({ ...validApplicationData, status: 'INVALID_STATUS' });

      expectValidationError(response, 'status');
    });

    it('should prevent duplicate applications', async () => {
      // Create first application
      await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send(validApplicationData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send(validApplicationData);

      expectApiError(response, 422, 'VALIDATION_ERROR');
    });
  });

  describe('GET /api/applications', () => {
    let studentApplication: any;
    let otherStudentApplication: any;

    beforeEach(async () => {
      // Create applications for different students
      studentApplication = await TestDataFactory.createTestApplication(student.id);
      
      const otherStudent = await TestDataFactory.createTestUser(UserRole.STUDENT);
      otherStudentApplication = await TestDataFactory.createTestApplication(otherStudent.id);
    });

    it('should list applications for student (only their own)', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].id).toBe(studentApplication.id);
      expect(response.body.data.items[0].userId).toBe(student.id);
      expect(response.body.data.pagination).toHaveProperty('total', 1);
    });

    it('should list all applications for admin', async () => {
      const response = await request(app)
        .get('/api/applications')
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.items.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data.pagination.total).toBeGreaterThanOrEqual(2);
    });

    it('should support pagination', async () => {
      // Create more applications
      await TestDataFactory.createTestApplication(student.id, { company: 'Company 2' });
      await TestDataFactory.createTestApplication(student.id, { company: 'Company 3' });

      const response = await request(app)
        .get('/api/applications?page=1&limit=2')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 2);
      expect(response.body.data.pagination).toHaveProperty('total', 3);
    });

    it('should support search filtering', async () => {
      await TestDataFactory.createTestApplication(student.id, { 
        company: 'Google',
        role: 'Software Engineer' 
      });

      const response = await request(app)
        .get('/api/applications?search=Google')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].company).toBe('Google');
    });

    it('should support status filtering', async () => {
      await TestDataFactory.createTestApplication(student.id, { status: 'INTERVIEW' });

      const response = await request(app)
        .get('/api/applications?status=INTERVIEW')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].status).toBe('INTERVIEW');
    });

    it('should deny access to unauthenticated users', async () => {
      const response = await request(app)
        .get('/api/applications');

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });
  });

  describe('GET /api/applications/:id', () => {
    let application: any;

    beforeEach(async () => {
      application = await TestDataFactory.createTestApplication(student.id);
    });

    it('should get application by ID for owner', async () => {
      const response = await request(app)
        .get(`/api/applications/${application.id}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.application.id).toBe(application.id);
      expect(response.body.data.application.company).toBe(application.company);
    });

    it('should get application by ID for admin', async () => {
      const response = await request(app)
        .get(`/api/applications/${application.id}`)
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.application.id).toBe(application.id);
    });

    it('should deny access to other students', async () => {
      const otherStudent = await TestDataFactory.createTestUser(UserRole.STUDENT);
      
      const response = await request(app)
        .get(`/api/applications/${application.id}`)
        .set(createAuthHeaders(otherStudent.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .get('/api/applications/00000000-0000-0000-0000-000000000000')
        .set(createAuthHeaders(student.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });

    it('should validate UUID format', async () => {
      const response = await request(app)
        .get('/api/applications/invalid-uuid')
        .set(createAuthHeaders(student.token));

      expectValidationError(response);
    });
  });

  describe('PATCH /api/applications/:id', () => {
    let application: any;

    beforeEach(async () => {
      application = await TestDataFactory.createTestApplication(student.id);
    });

    const updateData = {
      status: 'INTERVIEW',
      notes: 'Updated notes',
    };

    it('should update application successfully for owner', async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}`)
        .set(createAuthHeaders(student.token))
        .send(updateData);

      expectApiSuccess(response);
      expect(response.body.data.application.status).toBe(updateData.status);
      expect(response.body.data.application.notes).toBe(updateData.notes);
    });

    it('should update application for admin', async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}`)
        .set(createAuthHeaders(admin.token))
        .send(updateData);

      expectApiSuccess(response);
      expect(response.body.data.application.status).toBe(updateData.status);
    });

    it('should deny access to other students', async () => {
      const otherStudent = await TestDataFactory.createTestUser(UserRole.STUDENT);
      
      const response = await request(app)
        .patch(`/api/applications/${application.id}`)
        .set(createAuthHeaders(otherStudent.token))
        .send(updateData);

      expectApiError(response, 404, 'NOT_FOUND');
    });

    it('should validate status enum', async () => {
      const response = await request(app)
        .patch(`/api/applications/${application.id}`)
        .set(createAuthHeaders(student.token))
        .send({ status: 'INVALID_STATUS' });

      expectValidationError(response, 'status');
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .patch('/api/applications/00000000-0000-0000-0000-000000000000')
        .set(createAuthHeaders(student.token))
        .send(updateData);

      expectApiError(response, 404, 'NOT_FOUND');
    });
  });

  describe('DELETE /api/applications/:id', () => {
    let application: any;

    beforeEach(async () => {
      application = await TestDataFactory.createTestApplication(student.id);
    });

    it('should delete application successfully for owner', async () => {
      const response = await request(app)
        .delete(`/api/applications/${application.id}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.message).toBe('Application deleted successfully');

      // Verify application is deleted
      const getResponse = await request(app)
        .get(`/api/applications/${application.id}`)
        .set(createAuthHeaders(student.token));

      expectApiError(getResponse, 404);
    });

    it('should delete application for admin', async () => {
      const response = await request(app)
        .delete(`/api/applications/${application.id}`)
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
    });

    it('should deny access to other students', async () => {
      const otherStudent = await TestDataFactory.createTestUser(UserRole.STUDENT);
      
      const response = await request(app)
        .delete(`/api/applications/${application.id}`)
        .set(createAuthHeaders(otherStudent.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .delete('/api/applications/00000000-0000-0000-0000-000000000000')
        .set(createAuthHeaders(student.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });
  });

  describe('GET /api/applications/stats', () => {
    beforeEach(async () => {
      // Create applications with different statuses
      await TestDataFactory.createTestApplication(student.id, { status: 'APPLIED' });
      await TestDataFactory.createTestApplication(student.id, { status: 'APPLIED' });
      await TestDataFactory.createTestApplication(student.id, { status: 'INTERVIEW' });
      await TestDataFactory.createTestApplication(student.id, { status: 'OFFER' });
    });

    it('should return application statistics for student', async () => {
      const response = await request(app)
        .get('/api/applications/stats')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.stats).toHaveProperty('totalApplications', 4);
      expect(response.body.data.stats).toHaveProperty('statusBreakdown');
      expect(response.body.data.stats.statusBreakdown).toHaveProperty('APPLIED', 2);
      expect(response.body.data.stats.statusBreakdown).toHaveProperty('INTERVIEW', 1);
      expect(response.body.data.stats.statusBreakdown).toHaveProperty('OFFER', 1);
    });

    it('should return global statistics for admin', async () => {
      const response = await request(app)
        .get('/api/applications/stats')
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.stats).toHaveProperty('totalApplications');
      expect(response.body.data.stats.totalApplications).toBeGreaterThanOrEqual(4);
    });

    it('should deny access to unauthenticated users', async () => {
      const response = await request(app)
        .get('/api/applications/stats');

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });
  });

  describe('Application Workflow Integration', () => {
    it('should complete full application lifecycle', async () => {
      const applicationData = {
        company: 'Workflow Corp',
        role: 'Full Stack Developer',
        platform: 'COMPANY_WEBSITE',
        status: 'DRAFT',
        notes: 'Initial draft',
        appliedDate: new Date().toISOString(),
      };

      // 1. Create application
      const createResponse = await request(app)
        .post('/api/applications')
        .set(createAuthHeaders(student.token))
        .send(applicationData);

      expectApiSuccess(createResponse, 201);
      const applicationId = createResponse.body.data.application.id;

      // 2. Update to applied
      const updateResponse = await request(app)
        .patch(`/api/applications/${applicationId}`)
        .set(createAuthHeaders(student.token))
        .send({ status: 'APPLIED', notes: 'Application submitted' });

      expectApiSuccess(updateResponse);

      // 3. Get updated application
      const getResponse = await request(app)
        .get(`/api/applications/${applicationId}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(getResponse);
      expect(getResponse.body.data.application.status).toBe('APPLIED');

      // 4. Update to interview
      const interviewResponse = await request(app)
        .patch(`/api/applications/${applicationId}`)
        .set(createAuthHeaders(student.token))
        .send({ status: 'INTERVIEW', notes: 'Got interview call!' });

      expectApiSuccess(interviewResponse);

      // 5. Check stats
      const statsResponse = await request(app)
        .get('/api/applications/stats')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(statsResponse);
      expect(statsResponse.body.data.stats.statusBreakdown).toHaveProperty('INTERVIEW');

      // 6. Delete application
      const deleteResponse = await request(app)
        .delete(`/api/applications/${applicationId}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(deleteResponse);

      // 7. Verify deletion
      const verifyResponse = await request(app)
        .get(`/api/applications/${applicationId}`)
        .set(createAuthHeaders(student.token));

      expectApiError(verifyResponse, 404);
    });
  });
});