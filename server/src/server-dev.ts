// Development server that can run without database connection
// Uses mock data for testing the API endpoints

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { logger } from './lib/logger';

const app = express();

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'uimp-server',
    version: '0.1.0',
    environment: env.NODE_ENV,
    database: 'mock',
  });
});

// Mock API endpoints for development
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'uimp-api',
    version: '0.1.0',
    database: 'mock',
  });
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    const mockUser = {
      id: '1',
      email: email,
      role: email.includes('admin') ? 'ADMIN' : email.includes('mentor') ? 'MENTOR' : 'STUDENT',
      firstName: 'Mock',
      lastName: 'User',
    };

    // Set mock auth cookie
    res.cookie('auth-token', `dev-${mockUser.id}-${mockUser.role}`, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.json({
      success: true,
      data: {
        user: mockUser,
        token: `dev-${mockUser.id}-${mockUser.role}`
      },
      message: 'Login successful (mock)',
    });
  } else {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required',
      },
    });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password, role } = req.body;
  
  if (email && password && role) {
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      role: role,
      firstName: 'New',
      lastName: 'User',
    };

    res.json({
      success: true,
      data: mockUser,
      message: 'Signup successful (mock)',
    });
  } else {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Email, password, and role are required',
      },
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth-token');
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies['auth-token'];
  
  if (token && token.startsWith('dev-')) {
    const parts = token.split('-');
    const mockUser = {
      id: parts[1],
      email: `user${parts[1]}@example.com`,
      role: parts[2],
      firstName: 'Mock',
      lastName: 'User',
    };

    res.json({
      success: true,
      data: mockUser,
    });
  } else {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      },
    });
  }
});

// Mock applications endpoints
app.get('/api/applications', (req, res) => {
  const mockApplications = [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Software Engineer Intern',
      platform: 'LINKEDIN',
      status: 'APPLIED',
      notes: 'Applied through LinkedIn',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      company: 'StartupXYZ',
      role: 'Frontend Developer Intern',
      platform: 'COMPANY_WEBSITE',
      status: 'INTERVIEW',
      notes: 'First round interview scheduled',
      createdAt: new Date().toISOString(),
    },
  ];

  res.json({
    success: true,
    data: {
      items: mockApplications,
      pagination: {
        page: 1,
        limit: 20,
        total: mockApplications.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

app.post('/api/applications', (req, res) => {
  const { company, role, platform, status } = req.body;
  
  const mockApplication = {
    id: Math.random().toString(36).substr(2, 9),
    company,
    role,
    platform,
    status: status || 'DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    data: mockApplication,
    message: 'Application created successfully (mock)',
  });
});

// Mock feedback endpoints
app.get('/api/feedback', (req, res) => {
  const mockFeedback = [
    {
      id: '1',
      content: 'Great application! Consider highlighting your React experience more prominently.',
      tags: ['RESUME'],
      priority: 'MEDIUM',
      mentor: {
        firstName: 'Jane',
        lastName: 'Smith',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  res.json({
    success: true,
    data: {
      items: mockFeedback,
      pagination: {
        page: 1,
        limit: 15,
        total: mockFeedback.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

// Mock dashboard endpoints
app.get('/api/dashboard/student', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        totalApplications: 5,
        appliedApplications: 3,
        interviewApplications: 1,
        offerApplications: 1,
        rejectedApplications: 0,
      },
      recentApplications: [
        {
          id: '1',
          company: 'Tech Corp',
          role: 'Software Engineer Intern',
          status: 'APPLIED',
          createdAt: new Date().toISOString(),
        },
      ],
      recentFeedback: [
        {
          id: '1',
          content: 'Great application!',
          priority: 'MEDIUM',
          createdAt: new Date().toISOString(),
        },
      ],
    },
  });
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { error: error.message, stack: error.stack });
  
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
});

// Start server
const PORT = env.PORT || 3001;

app.listen(PORT, () => {
  logger.info('🚀 Development server started successfully', {
    port: PORT,
    environment: env.NODE_ENV,
    cors: env.CORS_ORIGIN,
    database: 'mock',
    timestamp: new Date().toISOString(),
  });
  
  console.log(`
🎉 UIMP Development Server Running!

📍 Server: http://localhost:${PORT}
🔗 API: http://localhost:${PORT}/api
❤️ Health: http://localhost:${PORT}/health
🌐 Frontend: http://localhost:3000

📝 Mock Data Available:
- Login with any email/password
- Applications and feedback are mocked
- All API endpoints return sample data

🔧 To use real database:
1. Start PostgreSQL (Docker or local)
2. Run: npm run prisma:migrate
3. Use: npm run dev (instead of npm run dev:mock)
  `);
});