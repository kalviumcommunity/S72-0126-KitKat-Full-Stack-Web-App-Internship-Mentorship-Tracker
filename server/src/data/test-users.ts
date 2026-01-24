/**
 * Hardcoded Test Users for RBAC System Testing
 * These users demonstrate the complete role hierarchy and permissions
 */

import { UserRole } from '../types/rbac';
import { hashPassword } from '../lib/password';

export interface TestUser {
  id: string;
  email: string;
  password: string; // Plain text for testing
  passwordHash: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isActive: boolean;
  organizationId?: string;
}

// Generate password hashes (in real app, this would be done during user creation)
const generateTestUsers = async (): Promise<TestUser[]> => {
  const commonPassword = 'TestPassword123!';
  const passwordHash = await hashPassword(commonPassword);

  return [
    // STUDENTS
    {
      id: 'student-001',
      email: 'alice.student@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.STUDENT,
      firstName: 'Alice',
      lastName: 'Johnson',
      isActive: true,
      organizationId: 'org-001'
    },
    {
      id: 'student-002', 
      email: 'bob.student@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.STUDENT,
      firstName: 'Bob',
      lastName: 'Smith',
      isActive: true,
      organizationId: 'org-001'
    },
    {
      id: 'student-003',
      email: 'charlie.student@test.com', 
      password: commonPassword,
      passwordHash,
      role: UserRole.STUDENT,
      firstName: 'Charlie',
      lastName: 'Brown',
      isActive: true,
      organizationId: 'org-002'
    },

    // MENTORS
    {
      id: 'mentor-001',
      email: 'diana.mentor@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.MENTOR,
      firstName: 'Diana',
      lastName: 'Wilson',
      isActive: true,
      organizationId: 'org-001'
    },
    {
      id: 'mentor-002',
      email: 'evan.mentor@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.MENTOR,
      firstName: 'Evan',
      lastName: 'Davis',
      isActive: true,
      organizationId: 'org-001'
    },
    {
      id: 'mentor-003',
      email: 'fiona.mentor@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.MENTOR,
      firstName: 'Fiona',
      lastName: 'Garcia',
      isActive: true,
      organizationId: 'org-002'
    },

    // ADMINS
    {
      id: 'admin-001',
      email: 'george.admin@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.ADMIN,
      firstName: 'George',
      lastName: 'Martinez',
      isActive: true,
      organizationId: 'org-001'
    },
    {
      id: 'admin-002',
      email: 'helen.admin@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.ADMIN,
      firstName: 'Helen',
      lastName: 'Rodriguez',
      isActive: true,
      organizationId: 'org-002'
    },

    // SUPER ADMIN
    {
      id: 'superadmin-001',
      email: 'ivan.superadmin@test.com',
      password: commonPassword,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      firstName: 'Ivan',
      lastName: 'Thompson',
      isActive: true,
      organizationId: undefined // Super admin not tied to specific org
    }
  ];
};

// Test data relationships
export const TEST_MENTOR_ASSIGNMENTS = [
  { mentorId: 'mentor-001', studentId: 'student-001', isActive: true },
  { mentorId: 'mentor-001', studentId: 'student-002', isActive: true },
  { mentorId: 'mentor-002', studentId: 'student-002', isActive: true }, // Student can have multiple mentors
  { mentorId: 'mentor-003', studentId: 'student-003', isActive: true },
];

export const TEST_ORGANIZATIONS = [
  {
    id: 'org-001',
    name: 'TechCorp University',
    domain: 'techcorp.edu',
    subscriptionTier: 'premium',
    isActive: true
  },
  {
    id: 'org-002', 
    name: 'Innovation Institute',
    domain: 'innovation.edu',
    subscriptionTier: 'enterprise',
    isActive: true
  }
];

export const TEST_APPLICATIONS = [
  {
    id: 'app-001',
    userId: 'student-001',
    company: 'Google',
    role: 'Software Engineer Intern',
    platform: 'COMPANY_WEBSITE',
    status: 'APPLIED',
    notes: 'Applied for summer internship program'
  },
  {
    id: 'app-002',
    userId: 'student-001', 
    company: 'Microsoft',
    role: 'Product Manager Intern',
    platform: 'LINKEDIN',
    status: 'INTERVIEW',
    notes: 'Phone screening completed'
  },
  {
    id: 'app-003',
    userId: 'student-002',
    company: 'Amazon',
    role: 'Data Science Intern',
    platform: 'REFERRAL',
    status: 'SHORTLISTED',
    notes: 'Referred by alumni'
  },
  {
    id: 'app-004',
    userId: 'student-003',
    company: 'Apple',
    role: 'iOS Developer Intern',
    platform: 'JOB_BOARD',
    status: 'DRAFT',
    notes: 'Still preparing application'
  }
];

export const TEST_FEEDBACK = [
  {
    id: 'feedback-001',
    applicationId: 'app-001',
    mentorId: 'mentor-001',
    content: 'Great application! Consider highlighting your React experience more prominently.',
    tags: ['RESUME'],
    priority: 'MEDIUM'
  },
  {
    id: 'feedback-002',
    applicationId: 'app-002',
    mentorId: 'mentor-001', 
    content: 'Your technical skills look strong. Work on behavioral interview preparation.',
    tags: ['COMMUNICATION'],
    priority: 'HIGH'
  },
  {
    id: 'feedback-003',
    applicationId: 'app-003',
    mentorId: 'mentor-002',
    content: 'Excellent data science portfolio. Consider adding more visualization examples.',
    tags: ['RESUME'],
    priority: 'LOW'
  }
];

// Export the function to generate users
export { generateTestUsers };

// Helper function to get user by email (for login testing)
export async function getTestUserByEmail(email: string): Promise<TestUser | null> {
  const users = await generateTestUsers();
  return users.find(user => user.email === email) || null;
}

// Helper function to get user by ID
export async function getTestUserById(id: string): Promise<TestUser | null> {
  const users = await generateTestUsers();
  return users.find(user => user.id === id) || null;
}

// Common test password for all users
export const TEST_PASSWORD = 'TestPassword123!';