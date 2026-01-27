import request from 'supertest';
import { createApp } from '../../src/app';
import { 
  TestDataFactory, 
  createAuthHeaders, 
  expectApiSuccess, 
  expectApiError, 
  expectValidationError 
} from '../utils/test-helpers';
import { UserRole } from "@prisma/client";

describe('Feedback API Integration Tests', () => {
  let app: any;
  let student: any;
  let mentor: any;
  let admin: any;
  let application: any;

  beforeAll(async () => {
    app = createApp();
  });

  beforeEach(async () => {
    await TestDataFactory.cleanupTestData();
    
    // Create test users
    student = await TestDataFactory.createTestUser(UserRole.STUDENT);
    mentor = await TestDataFactory.createTestUser(UserRole.MENTOR);
    admin = await TestDataFactory.createTestUser(UserRole.ADMIN);
    
    // Create test application
    application = await TestDataFactory.createTestApplication(student.id);
    
    // Create mentor assignment
    await TestDataFactory.createMentorAssignment(mentor.id, student.id);
  });

  afterAll(async () => {
    await TestDataFactory.cleanupTestData();
  });

  describe('POST /api/feedback', () => {
    const validFeedbackData = {
      applicationId: '',
      content: 'Great application! Your resume shows strong technical skills. Consider adding more quantifiable achievements.',
      tags: ['RESUME', 'COMMUNICATION'],
      priority: 'HIGH',
    };

    beforeEach(() => {
      validFeedbackData.applicationId = application.id;
    });

    it('should create feedback successfully for assigned mentor', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send(validFeedbackData);

      expectApiSuccess(response, 201);
      expect(response.body.data.feedback).toHaveProperty('id');
      expect(response.body.data.feedback.content).toBe(validFeedbackData.content);
      expect(response.body.data.feedback.mentorId).toBe(mentor.id);
      expect(response.body.data.feedback.applicationId).toBe(application.id);
      expect(response.body.data.feedback.tags).toEqual(validFeedbackData.tags);
    });

    it('should create feedback for admin without assignment check', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(admin.token))
        .send(validFeedbackData);

      expectApiSuccess(response, 201);
      expect(response.body.data.feedback.mentorId).toBe(admin.id);
    });

    it('should deny access to students', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(student.token))
        .send(validFeedbackData);

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });

    it('should deny access to unassigned mentors', async () => {
      const unassignedMentor = await TestDataFactory.createTestUser(UserRole.MENTOR);
      
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(unassignedMentor.token))
        .send(validFeedbackData);

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send({});

      expectValidationError(response);
    });

    it('should validate applicationId format', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send({ ...validFeedbackData, applicationId: 'invalid-uuid' });

      expectValidationError(response, 'applicationId');
    });

    it('should validate tags enum', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send({ ...validFeedbackData, tags: ['INVALID_TAG'] });

      expectValidationError(response, 'tags');
    });

    it('should validate priority enum', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send({ ...validFeedbackData, priority: 'INVALID_PRIORITY' });

      expectValidationError(response, 'priority');
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send({ 
          ...validFeedbackData, 
          applicationId: '00000000-0000-0000-0000-000000000000' 
        });

      expectApiError(response, 404, 'NOT_FOUND');
    });
  });

  describe('GET /api/feedback', () => {
    let feedback1: any;
    let feedback2: any;

    beforeEach(async () => {
      feedback1 = await TestDataFactory.createTestFeedback(mentor.id, application.id, {
        tags: ['RESUME'],
        priority: 'HIGH',
      });
      
      feedback2 = await TestDataFactory.createTestFeedback(mentor.id, application.id, {
        tags: ['COMMUNICATION'],
        priority: 'MEDIUM',
      });
    });

    it('should list feedback for student (only their feedback)', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
      
      // Verify all feedback is for student's applications
      response.body.data.items.forEach((feedback: any) => {
        expect(feedback.application.userId).toBe(student.id);
      });
    });

    it('should list feedback for mentor (only feedback they created)', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .set(createAuthHeaders(mentor.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(2);
      
      // Verify all feedback is created by mentor
      response.body.data.items.forEach((feedback: any) => {
        expect(feedback.mentorId).toBe(mentor.id);
      });
    });

    it('should list all feedback for admin', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.items.length).toBeGreaterThanOrEqual(2);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/feedback?page=1&limit=1')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 1);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
    });

    it('should support tag filtering', async () => {
      const response = await request(app)
        .get('/api/feedback?tags=RESUME')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].tags).toContain('RESUME');
    });

    it('should support priority filtering', async () => {
      const response = await request(app)
        .get('/api/feedback?priority=HIGH')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].priority).toBe('HIGH');
    });

    it('should deny access to unauthenticated users', async () => {
      const response = await request(app)
        .get('/api/feedback');

      expectApiError(response, 401, 'AUTHENTICATION_ERROR');
    });
  });

  describe('GET /api/feedback/:id', () => {
    let feedback: any;

    beforeEach(async () => {
      feedback = await TestDataFactory.createTestFeedback(mentor.id, application.id);
    });

    it('should get feedback by ID for student (if it\'s their feedback)', async () => {
      const response = await request(app)
        .get(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.feedback.id).toBe(feedback.id);
      expect(response.body.data.feedback.application.userId).toBe(student.id);
    });

    it('should get feedback by ID for mentor (if they created it)', async () => {
      const response = await request(app)
        .get(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(mentor.token));

      expectApiSuccess(response);
      expect(response.body.data.feedback.id).toBe(feedback.id);
      expect(response.body.data.feedback.mentorId).toBe(mentor.id);
    });

    it('should get feedback by ID for admin', async () => {
      const response = await request(app)
        .get(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.feedback.id).toBe(feedback.id);
    });

    it('should deny access to other students', async () => {
      const otherStudent = await TestDataFactory.createTestUser(UserRole.STUDENT);
      
      const response = await request(app)
        .get(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(otherStudent.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });

    it('should deny access to other mentors', async () => {
      const otherMentor = await TestDataFactory.createTestUser(UserRole.MENTOR);
      
      const response = await request(app)
        .get(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(otherMentor.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });

    it('should return 404 for non-existent feedback', async () => {
      const response = await request(app)
        .get('/api/feedback/00000000-0000-0000-0000-000000000000')
        .set(createAuthHeaders(student.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });
  });

  describe('GET /api/feedback/application/:applicationId', () => {
    let feedback1: any;
    let feedback2: any;

    beforeEach(async () => {
      feedback1 = await TestDataFactory.createTestFeedback(mentor.id, application.id);
      feedback2 = await TestDataFactory.createTestFeedback(mentor.id, application.id);
    });

    it('should get all feedback for application (student owner)', async () => {
      const response = await request(app)
        .get(`/api/feedback/application/${application.id}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.feedback).toHaveLength(2);
      response.body.data.feedback.forEach((feedback: any) => {
        expect(feedback.applicationId).toBe(application.id);
      });
    });

    it('should get all feedback for application (assigned mentor)', async () => {
      const response = await request(app)
        .get(`/api/feedback/application/${application.id}`)
        .set(createAuthHeaders(mentor.token));

      expectApiSuccess(response);
      expect(response.body.data.feedback).toHaveLength(2);
    });

    it('should get all feedback for application (admin)', async () => {
      const response = await request(app)
        .get(`/api/feedback/application/${application.id}`)
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.feedback).toHaveLength(2);
    });

    it('should deny access to other students', async () => {
      const otherStudent = await TestDataFactory.createTestUser(UserRole.STUDENT);
      
      const response = await request(app)
        .get(`/api/feedback/application/${application.id}`)
        .set(createAuthHeaders(otherStudent.token));

      expectApiError(response, 404, 'NOT_FOUND');
    });
  });

  describe('PATCH /api/feedback/:id', () => {
    let feedback: any;

    beforeEach(async () => {
      feedback = await TestDataFactory.createTestFeedback(mentor.id, application.id);
    });

    const updateData = {
      content: 'Updated feedback content with more details',
      tags: ['RESUME', 'INTERVIEW'],
      priority: 'MEDIUM',
    };

    it('should update feedback successfully for mentor who created it', async () => {
      const response = await request(app)
        .patch(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(mentor.token))
        .send(updateData);

      expectApiSuccess(response);
      expect(response.body.data.feedback.content).toBe(updateData.content);
      expect(response.body.data.feedback.tags).toEqual(updateData.tags);
      expect(response.body.data.feedback.priority).toBe(updateData.priority);
    });

    it('should update feedback for admin', async () => {
      const response = await request(app)
        .patch(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(admin.token))
        .send(updateData);

      expectApiSuccess(response);
      expect(response.body.data.feedback.content).toBe(updateData.content);
    });

    it('should deny access to students', async () => {
      const response = await request(app)
        .patch(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(student.token))
        .send(updateData);

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });

    it('should deny access to other mentors', async () => {
      const otherMentor = await TestDataFactory.createTestUser(UserRole.MENTOR);
      
      const response = await request(app)
        .patch(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(otherMentor.token))
        .send(updateData);

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });

    it('should validate update data', async () => {
      const response = await request(app)
        .patch(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(mentor.token))
        .send({ priority: 'INVALID_PRIORITY' });

      expectValidationError(response, 'priority');
    });
  });

  describe('DELETE /api/feedback/:id', () => {
    let feedback: any;

    beforeEach(async () => {
      feedback = await TestDataFactory.createTestFeedback(mentor.id, application.id);
    });

    it('should delete feedback successfully for mentor who created it', async () => {
      const response = await request(app)
        .delete(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(mentor.token));

      expectApiSuccess(response);
      expect(response.body.data.message).toBe('Feedback deleted successfully');

      // Verify feedback is deleted
      const getResponse = await request(app)
        .get(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(mentor.token));

      expectApiError(getResponse, 404);
    });

    it('should delete feedback for admin', async () => {
      const response = await request(app)
        .delete(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
    });

    it('should deny access to students', async () => {
      const response = await request(app)
        .delete(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(student.token));

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });

    it('should deny access to other mentors', async () => {
      const otherMentor = await TestDataFactory.createTestUser(UserRole.MENTOR);
      
      const response = await request(app)
        .delete(`/api/feedback/${feedback.id}`)
        .set(createAuthHeaders(otherMentor.token));

      expectApiError(response, 403, 'AUTHORIZATION_ERROR');
    });
  });

  describe('GET /api/feedback/stats', () => {
    beforeEach(async () => {
      // Create feedback with different priorities
      await TestDataFactory.createTestFeedback(mentor.id, application.id, { priority: 'HIGH' });
      await TestDataFactory.createTestFeedback(mentor.id, application.id, { priority: 'HIGH' });
      await TestDataFactory.createTestFeedback(mentor.id, application.id, { priority: 'MEDIUM' });
    });

    it('should return feedback statistics for student', async () => {
      const response = await request(app)
        .get('/api/feedback/stats')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(response);
      expect(response.body.data.stats).toHaveProperty('totalFeedback', 3);
      expect(response.body.data.stats).toHaveProperty('priorityBreakdown');
      expect(response.body.data.stats.priorityBreakdown).toHaveProperty('HIGH', 2);
      expect(response.body.data.stats.priorityBreakdown).toHaveProperty('MEDIUM', 1);
    });

    it('should return feedback statistics for mentor', async () => {
      const response = await request(app)
        .get('/api/feedback/stats')
        .set(createAuthHeaders(mentor.token));

      expectApiSuccess(response);
      expect(response.body.data.stats).toHaveProperty('totalFeedback', 3);
    });

    it('should return global statistics for admin', async () => {
      const response = await request(app)
        .get('/api/feedback/stats')
        .set(createAuthHeaders(admin.token));

      expectApiSuccess(response);
      expect(response.body.data.stats.totalFeedback).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Feedback Workflow Integration', () => {
    it('should complete full feedback lifecycle', async () => {
      const feedbackData = {
        applicationId: application.id,
        content: 'Initial feedback on your application',
        tags: ['RESUME'],
        priority: 'HIGH',
      };

      // 1. Create feedback
      const createResponse = await request(app)
        .post('/api/feedback')
        .set(createAuthHeaders(mentor.token))
        .send(feedbackData);

      expectApiSuccess(createResponse, 201);
      const feedbackId = createResponse.body.data.feedback.id;

      // 2. Student views feedback
      const viewResponse = await request(app)
        .get(`/api/feedback/${feedbackId}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(viewResponse);
      expect(viewResponse.body.data.feedback.content).toBe(feedbackData.content);

      // 3. Mentor updates feedback
      const updateResponse = await request(app)
        .patch(`/api/feedback/${feedbackId}`)
        .set(createAuthHeaders(mentor.token))
        .send({
          content: 'Updated feedback with more details',
          tags: ['RESUME', 'COMMUNICATION'],
          priority: 'MEDIUM',
        });

      expectApiSuccess(updateResponse);

      // 4. Check feedback in application context
      const appFeedbackResponse = await request(app)
        .get(`/api/feedback/application/${application.id}`)
        .set(createAuthHeaders(student.token));

      expectApiSuccess(appFeedbackResponse);
      expect(appFeedbackResponse.body.data.feedback).toHaveLength(1);

      // 5. Check stats
      const statsResponse = await request(app)
        .get('/api/feedback/stats')
        .set(createAuthHeaders(student.token));

      expectApiSuccess(statsResponse);
      expect(statsResponse.body.data.stats.totalFeedback).toBe(1);

      // 6. Delete feedback
      const deleteResponse = await request(app)
        .delete(`/api/feedback/${feedbackId}`)
        .set(createAuthHeaders(mentor.token));

      expectApiSuccess(deleteResponse);

      // 7. Verify deletion
      const verifyResponse = await request(app)
        .get(`/api/feedback/${feedbackId}`)
        .set(createAuthHeaders(student.token));

      expectApiError(verifyResponse, 404);
    });
  });
});