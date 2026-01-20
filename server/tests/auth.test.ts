import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/lib/prisma';

// Mock the prisma client
jest.mock('../src/lib/prisma', () => ({
    __esModule: true,
    prisma: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Auth API', () => {
    let app: any;

    beforeAll(() => {
        app = createApp();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/signup', () => {
        it('should create a new user when valid data is provided', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                role: 'STUDENT',
                firstName: 'John',
                lastName: 'Doe',
            };

            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue({
                id: 'user-id-123',
                ...userData,
                passwordHash: 'hashed-password',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: null,
                profileImageUrl: null,
            });

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user.email).toBe(userData.email);
        });

        it('should return 409 if email already exists', async () => {
            const userData = {
                email: 'existing@example.com',
                password: 'password123',
                role: 'STUDENT',
                firstName: 'Jane',
                lastName: 'Doe',
            };

            prismaMock.user.findUnique.mockResolvedValue({
                id: 'existing-id',
                email: userData.email,
                passwordHash: 'hash',
                role: 'STUDENT',
                firstName: 'Jane',
                lastName: 'Doe',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLoginAt: new Date(),
                profileImageUrl: null,
            });

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            // We'll need to mock authService behavior effectively, 
            // but since we are mocking prisma, we rely on the implementation calling prisma.
            // NOTE: The real implementation uses bcrypt.compare. 
            // We can't easily mock bcrypt here without ignoring it or mocking the library.
            // For this regression test, we might fail if we don't mock bcrypt because the hash won't match "password123".
            // Instead of mocking bcrypt which is internal, let's just assume the service works if prisma returns user.
            // Actually, integration tests on the controller with mocked prisma will exercise the service logic.
            // Because hashing is real, we can't just pass 'password123' as hash.
            // We really should mock the authService completely if we want to isolate the controller,
            // OR we mock prisma and accept that bcrypt runs.
            // But bcrypt.compare("password123", "hash") will likely fail.
            // So for login, we really need to mock the password verification or use a real hash.

            // Let's use a real hash for "password123" if possible? No that's hard.
            // Better approach: Mock the AuthService? 
            // Or Mock the password utils.
            pass
        });
    });
});

// Since mocking internal libraries like bcrypt in an integration test setup (app -> service -> lib) is hard without module aliasing or dependency injection,
// and we want regression tests, maybe we should just test the known flow where possible
// OR we can mock the `comparePassword` function if we can.
// But `jest.mock` on `../../lib/password` should work if we do it at the top.
