import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../src/app'; // Make sure this path is correct relative to tests/
import { prisma } from '../src/lib/prisma';
import { verifyToken } from '../src/lib/jwt';
import { UserRole } from '../src/types/roles';

// Mock prisma
jest.mock('../src/lib/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
}));

// Mock jwt
jest.mock('../src/lib/jwt', () => ({
    __esModule: true,
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
const verifyTokenMock = verifyToken as jest.Mock;

describe('Application API', () => {
    let app: any;

    beforeAll(() => {
        app = createApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const studentUser = {
        id: 'student-id-123',
        email: 'student@example.com',
        role: UserRole.STUDENT,
    };

    const applicationData = {
        company: 'Tech Corp',
        role: 'Frontend Intern',
        platform: 'LinkedIn',
        status: 'APPLIED',
        resumeUrl: 'https://example.com/resume.pdf',
        notes: 'Referral'
    };

    describe('POST /api/applications', () => {
        it('should create an application for logged in student', async () => {
            // Mock authentication
            verifyTokenMock.mockReturnValue(studentUser);

            // Mock database
            prismaMock.application.count.mockResolvedValue(0); // For limits check
            prismaMock.application.findFirst.mockResolvedValue(null); // For duplicate check
            prismaMock.application.create.mockResolvedValue({
                id: 'app-id-1',
                userId: studentUser.id,
                ...applicationData,
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any);

            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', 'Bearer valid-token')
                .send(applicationData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.application.company).toBe('Tech Corp');
        });

        it('should deny non-student users', async () => {
            // Mock mentor user
            verifyTokenMock.mockReturnValue({
                ...studentUser,
                role: 'MENTOR'
            });

            const response = await request(app)
                .post('/api/applications')
                .set('Authorization', 'Bearer valid-token')
                .send(applicationData);

            expect(response.status).toBe(403);
        });

        it('should return 401 if not authenticated', async () => {
            verifyTokenMock.mockImplementation(() => { throw new Error('Invalid token'); });

            const response = await request(app)
                .post('/api/applications')
                .send(applicationData);

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/applications', () => {
        it('should list applications for the user', async () => {
            verifyTokenMock.mockReturnValue(studentUser);

            prismaMock.application.findMany.mockResolvedValue([
                {
                    id: 'app-id-1',
                    userId: studentUser.id,
                    company: 'Microsoft',
                    role: 'SDE Intern',
                    status: 'APPLIED',
                    createdAt: new Date(),
                } as any
            ]);
            prismaMock.application.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/applications')
                .set('Authorization', 'Bearer valid-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.items).toHaveLength(1);
            expect(response.body.data.items[0].company).toBe('Microsoft');
        });
    });
});
