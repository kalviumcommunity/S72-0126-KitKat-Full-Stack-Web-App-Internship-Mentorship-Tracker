import { generateToken } from '../../src/lib/jwt';
import { hashPassword } from '../../src/lib/password';
import { UserRole } from "@prisma/client";

// Import the mocked prisma
import { prisma } from '../../src/lib/prisma';

// Type the mocked prisma
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

export { mockPrisma };

export interface TestUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  token: string;
}

export class TestDataFactory {
  static async createTestUser(
    role: UserRole = UserRole.STUDENT,
    overrides: Partial<any> = {}
  ): Promise<TestUser> {
    const userData = {
      id: `user-${Date.now()}-${Math.random()}`,
      email: `test-${role.toLowerCase()}-${Date.now()}@example.com`,
      passwordHash: await hashPassword('Test123!'),
      role,
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };

    const token = generateToken({
      id: userData.id,
      email: userData.email,
      role: userData.role as UserRole,
    });

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role as UserRole,
      firstName: userData.firstName,
      lastName: userData.lastName,
      token,
    };
  }

  static async createTestApplication(userId: string, overrides: Partial<any> = {}) {
    return {
      id: `app-${Date.now()}-${Math.random()}`,
      userId,
      company: 'Test Company',
      role: 'Software Engineer Intern',
      platform: 'LINKEDIN',
      status: 'APPLIED',
      notes: 'Test application',
      appliedDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static async createTestFeedback(
    mentorId: string,
    applicationId: string,
    overrides: Partial<any> = {}
  ) {
    return {
      id: `feedback-${Date.now()}-${Math.random()}`,
      mentorId,
      applicationId,
      content: 'Great application! Keep up the good work.',
      tags: ['RESUME'],
      priority: 'MEDIUM',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static async createMentorAssignment(mentorId: string, studentId: string) {
    return {
      id: `assignment-${Date.now()}-${Math.random()}`,
      mentorId,
      studentId,
      assignedAt: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static async cleanupTestData() {
    // Reset all mocks
    jest.clearAllMocks();
  }
}

export const createAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const expectApiSuccess = (response: any, expectedStatus = 200) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
};

export const expectApiError = (response: any, expectedStatus: number, expectedCode?: string) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('error');
  if (expectedCode) {
    expect(response.body.error).toHaveProperty('code', expectedCode);
  }
};

export const expectValidationError = (response: any, field?: string) => {
  expectApiError(response, 422, 'VALIDATION_ERROR');
  if (field) {
    expect(response.body.error).toHaveProperty('details');
    expect(response.body.error.details).toHaveProperty(field);
  }
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));