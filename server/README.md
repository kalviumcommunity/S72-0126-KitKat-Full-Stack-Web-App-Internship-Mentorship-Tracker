# UIMP Backend Server

Backend API server for the Unified Internship & Mentorship Portal (UIMP).

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Language**: TypeScript
- **Validation**: Zod

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or remote)
- Redis (optional, for caching)
- npm or yarn

## Quick Start

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

### Option 2: Manual Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup database with Docker (optional)**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed database**
   ```bash
   npm run prisma:seed
   ```

### Quick Setup (All at once)
```bash
npm run db:setup
```

## Development

### Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3001` (or PORT from .env)

### View Database (Prisma Studio)
```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:migrate:deploy` - Apply migrations (production)
- `npm run prisma:migrate:reset` - Reset database
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database
- `npm run db:setup` - Complete setup (generate + migrate + seed)
- `npm run db:reset` - Reset database (⚠️ deletes all data)

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/uimp_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRES_IN="24h"

# Server
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET=""

# Email Service (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
```

## Database Setup with Docker

Start PostgreSQL and Redis:
```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432`
- Redis on port `6379`

Default credentials:
- User: `postgres`
- Password: `postgres`
- Database: `uimp_db`

## API Documentation

See [API_CONTRACTS.md](./API_CONTRACTS.md) for complete API documentation.

### Base URL
```
http://localhost:3001/api
```

### Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/feedback` - List feedback
- `POST /api/feedback` - Create feedback
- `GET /api/feedback/:id` - Get feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback

## Test Credentials (from seed data)

After running `npm run prisma:seed`, you can use:

- **Admin**: `admin@uimp.com` / `Admin123!`
- **Mentor1**: `mentor1@uimp.com` / `Mentor123!`
- **Mentor2**: `mentor2@uimp.com` / `Mentor123!`
- **Student1**: `student1@uimp.com` / `Student123!`
- **Student2**: `student2@uimp.com` / `Student123!`
- **Student3**: `student3@uimp.com` / `Student123!`

## Project Structure

```
server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts              # Seed script
│   └── migrations/         # Database migrations
├── src/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication
│   │   ├── applications/   # Applications CRUD
│   │   └── feedback/       # Feedback CRUD
│   ├── lib/                # Utilities
│   │   ├── prisma.ts       # Prisma client
│   │   ├── jwt.ts          # JWT utilities
│   │   ├── password.ts     # Password hashing
│   │   └── logger.ts       # Logging
│   ├── middlewares/        # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── config/             # Configuration
│   ├── types/              # TypeScript types
│   ├── app.ts              # Express app
│   ├── routes.ts           # Route definitions
│   └── server.ts           # Server entry point
├── tests/                  # Test files
├── docker-compose.yml      # Docker services
├── package.json
└── tsconfig.json
```

## Database Schema

See [prisma/SCHEMA_DOCUMENTATION.md](./prisma/SCHEMA_DOCUMENTATION.md) for detailed schema documentation.

### Main Entities
- **User**: Students, Mentors, Admins
- **Application**: Internship applications
- **Feedback**: Mentor feedback on applications
- **Notification**: User notifications
- **MentorAssignment**: Mentor-Student relationships

## Security

- JWT authentication with HttpOnly cookies
- Role-based access control (RBAC)
- Password hashing with bcrypt (12 rounds)
- Input validation with Zod
- SQL injection prevention via Prisma ORM

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify credentials are correct

### Prisma Client Errors
```bash
npm run prisma:generate
```

### Migration Issues
```bash
npm run db:reset  # ⚠️ Deletes all data
```

### Port Already in Use
Change `PORT` in `.env` or stop the process using port 3001

## Testing

### Quick Test

Run all tests:

**Windows:**
```powershell
.\run-all-tests.ps1
```

**Linux/Mac:**
```bash
./run-all-tests.sh
```

### Individual Test Suites

**End-to-End Tests** (45+ tests):
```bash
# Windows
.\test-e2e.ps1

# Linux/Mac
./test-e2e.sh
```

**Feedback API Tests** (15+ tests):
```bash
# Windows
.\test-feedback.ps1

# Linux/Mac
./test-feedback.sh
```

### Test Documentation

- [Testing Overview](../Docs/TESTING_OVERVIEW.md) - Complete testing strategy
- [E2E Testing Guide](../Docs/E2E_TESTING_GUIDE.md) - End-to-end test documentation
- [Feedback API](../Docs/FEEDBACK_API.md) - Feedback API tests and documentation
- [Testing Quick Start](../Docs/TESTING_QUICK_START.md) - Quick reference guide

### Prerequisites for Testing

1. Server must be running: `npm run dev`
2. Database must be migrated: `npm run db:migrate`
3. Optional: Seed test data: `npm run db:seed`

### Test Coverage

- ✅ Authentication flows (6 tests)
- ✅ User management (2 tests)
- ✅ Application CRUD (5 tests)
- ✅ Mentor assignments (1 test)
- ✅ Feedback system (20 tests)
- ✅ Authorization rules (5 tests)
- ✅ Validation (4 tests)
- ✅ Pagination (4 tests)
- ✅ Filtering (6 tests)
- ✅ Sorting (3 tests)
- ✅ Rate limiting (5 tests)
- ✅ Error handling (5 tests)

**Total: 60+ comprehensive tests**

## Additional Documentation

- [Testing Overview](../Docs/TESTING_OVERVIEW.md)
- [E2E Testing Guide](../Docs/E2E_TESTING_GUIDE.md)
- [Testing Quick Start](../Docs/TESTING_QUICK_START.md)
- [Feedback API](../Docs/FEEDBACK_API.md)
- [Upload & Email Guide](../Docs/UPLOAD_AND_EMAIL_GUIDE.md)
- [Performance Guide](../Docs/PERFORMANCE_GUIDE.md)
- [Optimization & Caching](../Docs/OPTIMIZATION_AND_CACHING.md)
- [Prisma Setup Guide](../Docs/PRISMA_SETUP.md)
- [API Contracts](../Docs/API_CONTRACTS.md)
- [Authentication & RBAC](../Docs/AUTHENTICATION_AND_RBAC.md)
- [Validation & Error Handling](../Docs/VALIDATION_AND_ERROR_HANDLING.md)

## Development Workflow

1. Make changes to code
2. If schema changed: `npm run prisma:migrate`
3. Test locally: `npm run dev`
4. View data: `npm run prisma:studio`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Build: `npm run build`
3. Run migrations: `npm run prisma:migrate:deploy`
4. Start: `npm start`

---

**Last Updated**: 2024-01-15  
**Maintained By**: Backend Team (Heramb)
