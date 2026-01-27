// Mock database for development when PostgreSQL is not available
// This provides basic CRUD operations for testing the API

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN';
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  platform: 'LINKEDIN' | 'COMPANY_WEBSITE' | 'REFERRAL' | 'JOB_BOARD' | 'CAREER_FAIR' | 'OTHER';
  status: 'DRAFT' | 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  resumeUrl?: string;
  notes?: string;
  deadline?: Date;
  appliedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockFeedback {
  id: string;
  applicationId: string;
  mentorId: string;
  content: string;
  tags: ('RESUME' | 'DSA' | 'SYSTEM_DESIGN' | 'COMMUNICATION')[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
}

class MockDatabase {
  private users: MockUser[] = [];
  private applications: MockApplication[] = [];
  private feedback: MockFeedback[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create mock users
    this.users = [
      {
        id: '1',
        email: 'student@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', // password123
        role: 'STUDENT',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'mentor@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', // password123
        role: 'MENTOR',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        email: 'admin@example.com',
        passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', // password123
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Create mock applications
    this.applications = [
      {
        id: '1',
        userId: '1',
        company: 'Tech Corp',
        role: 'Software Engineer Intern',
        platform: 'LINKEDIN',
        status: 'APPLIED',
        notes: 'Applied through LinkedIn, waiting for response',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: '1',
        company: 'StartupXYZ',
        role: 'Frontend Developer Intern',
        platform: 'COMPANY_WEBSITE',
        status: 'INTERVIEW',
        notes: 'First round interview scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Create mock feedback
    this.feedback = [
      {
        id: '1',
        applicationId: '1',
        mentorId: '2',
        content: 'Great application! Consider highlighting your React experience more prominently.',
        tags: ['RESUME'],
        priority: 'MEDIUM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  // User operations
  async findUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<MockUser | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockUser> {
    const user: MockUser = {
      ...userData,
      id: (this.users.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Application operations
  async findApplicationsByUserId(userId: string): Promise<MockApplication[]> {
    return this.applications.filter(app => app.userId === userId);
  }

  async findApplicationById(id: string): Promise<MockApplication | null> {
    return this.applications.find(app => app.id === id) || null;
  }

  async createApplication(appData: Omit<MockApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockApplication> {
    const application: MockApplication = {
      ...appData,
      id: (this.applications.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.applications.push(application);
    return application;
  }

  async updateApplication(id: string, updates: Partial<MockApplication>): Promise<MockApplication | null> {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return null;
    
    this.applications[index] = {
      ...this.applications[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.applications[index];
  }

  async deleteApplication(id: string): Promise<boolean> {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return false;
    
    this.applications.splice(index, 1);
    return true;
  }

  // Feedback operations
  async findFeedbackByApplicationId(applicationId: string): Promise<MockFeedback[]> {
    return this.feedback.filter(fb => fb.applicationId === applicationId);
  }

  async createFeedback(feedbackData: Omit<MockFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockFeedback> {
    const feedback: MockFeedback = {
      ...feedbackData,
      id: (this.feedback.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.feedback.push(feedback);
    return feedback;
  }
}

export const mockDb = new MockDatabase();