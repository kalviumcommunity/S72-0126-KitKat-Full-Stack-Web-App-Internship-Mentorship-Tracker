import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/uimp_test';

// Mock Prisma for tests
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    application: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    feedback: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    mentorAssignment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock Redis for tests
jest.mock('../src/lib/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    flushall: jest.fn(),
    quit: jest.fn(),
    isReady: true,
    connect: jest.fn(),
    disconnect: jest.fn(),
  },
  connectRedis: jest.fn(),
  disconnectRedis: jest.fn(),
}));

// Mock email service for tests
jest.mock('../src/lib/email', () => ({
  emailService: {
    send: jest.fn().mockResolvedValue(true),
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    sendFeedbackNotification: jest.fn().mockResolvedValue(true),
    sendApplicationStatusUpdate: jest.fn().mockResolvedValue(true),
    sendMentorAssignmentEmail: jest.fn().mockResolvedValue(true),
    isServiceConfigured: jest.fn().mockReturnValue(false),
  },
}));

// Mock storage service for tests
jest.mock('../src/lib/storage', () => ({
  storageService: {
    upload: jest.fn().mockResolvedValue({
      url: 'https://test-bucket.s3.amazonaws.com/test-file.pdf',
      key: 'test-file.pdf',
      size: 1024,
      mimeType: 'application/pdf',
    }),
    delete: jest.fn().mockResolvedValue(true),
    getSignedUrl: jest.fn().mockResolvedValue('https://signed-url.com/file'),
  },
}));

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests unless explicitly needed
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: originalConsole.error, // Keep errors visible
};

// Clean up after all tests
afterAll(async () => {
  // Restore console
  global.console = originalConsole;
});