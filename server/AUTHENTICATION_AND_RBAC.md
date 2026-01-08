# Authentication and RBAC System

This document describes the comprehensive authentication and Role-Based Access Control (RBAC) system implemented in the UIMP server.

## Overview

The system provides:
- **JWT Authentication**: Secure token-based authentication with HttpOnly cookies
- **Role-Based Access Control**: Three-tier role system (Student, Mentor, Admin)
- **Resource Ownership**: Users can access their own resources
- **Mentor-Student Relationships**: Mentors can access assigned students' data
- **Rate Limiting**: Protection against brute force attacks
- **Comprehensive Logging**: Security event logging and monitoring

## Authentication Flow

### 1. User Registration (Signup)

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "role": "STUDENT",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Features:**
- Email uniqueness validation
- Password hashing with bcrypt (12 salt rounds)
- Role assignment (STUDENT, MENTOR, ADMIN)
- Rate limiting: 3 signups per hour per email
- Comprehensive input validation

### 2. User Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Features:**
- Secure password verification
- JWT token generation (24-hour expiry)
- HttpOnly cookie with security flags
- Last login timestamp update
- Rate limiting: 5 attempts per 15 minutes per email

**Cookie Settings:**
```javascript
{
  httpOnly: true,           // Prevents XSS attacks
  secure: true,             // HTTPS only (production)
  sameSite: "strict",       // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: "/"
}
```

### 3. Token Verification

The system supports two authentication methods:
- **HttpOnly Cookie**: `auth-token` cookie (recommended)
- **Authorization Header**: `Bearer <token>` (for API clients)

### 4. Logout

```bash
POST /api/auth/logout
```

Clears the authentication cookie and invalidates the session.

## Role-Based Access Control (RBAC)

### Role Hierarchy

```
ADMIN (Level 3)
├── Full system access
├── User management
├── Mentor assignments
└── All data access

MENTOR (Level 2)
├── View assigned students
├── Create/manage feedback
├── View student applications
└── Limited admin functions

STUDENT (Level 1)
├── Manage own applications
├── View own feedback
├── Update own profile
└── Basic user functions
```

### RBAC Middleware Functions

#### Basic Role Checks

```typescript
import { 
  requireStudent, 
  requireMentor, 
  requireAdmin,
  requireMentorOrAdmin,
  requireMinMentor 
} from "../middlewares/rbac.middleware";

// Single role requirement
router.get("/student-only", authenticate, requireStudent, handler);
router.get("/mentor-only", authenticate, requireMentor, handler);
router.get("/admin-only", authenticate, requireAdmin, handler);

// Multiple role options
router.get("/mentor-or-admin", authenticate, requireMentorOrAdmin, handler);

// Minimum role level (mentor or above)
router.get("/min-mentor", authenticate, requireMinMentor, handler);
```

#### Resource Ownership

```typescript
import { requireSelfOrAdmin, requireOwnershipOrAdmin } from "../middlewares/rbac.middleware";

// User can access their own profile or admin can access any
router.get("/profile/:id", 
  authenticate, 
  requireSelfOrAdmin, 
  handler
);

// Custom ownership check
router.get("/resource/:id", 
  authenticate,
  requireOwnershipOrAdmin((req) => getResourceOwnerId(req.params.id)),
  handler
);
```

#### Mentor-Student Access

```typescript
import { requireMentorAccess } from "../middlewares/rbac.middleware";

// Mentor can access assigned student's data
router.get("/student/:id/applications", 
  authenticate,
  requireMentorAccess((req) => req.params.id),
  handler
);
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Rate Limit | Auth Required |
|--------|----------|-------------|------------|---------------|
| POST | `/api/auth/signup` | User registration | 3/hour per email | No |
| POST | `/api/auth/login` | User login | 5/15min per email | No |
| POST | `/api/auth/logout` | User logout | - | Yes |
| GET | `/api/auth/me` | Get current user | - | Yes |
| POST | `/api/auth/refresh` | Refresh token | - | Yes |
| POST | `/api/auth/change-password` | Change password | 5/15min | Yes |

### User Management Endpoints

| Method | Endpoint | Description | Required Role | Rate Limit |
|--------|----------|-------------|---------------|------------|
| GET | `/api/users` | List all users | Admin | 100/min |
| GET | `/api/users/:id` | Get user by ID | Self/Mentor/Admin | 100/min |
| PUT | `/api/users/:id` | Update profile | Self/Admin | 100/min |
| POST | `/api/users/:id/activate` | Activate user | Admin | - |
| POST | `/api/users/:id/deactivate` | Deactivate user | Admin | - |
| GET | `/api/users/:id/mentors` | Get user's mentors | Self/Admin | 100/min |
| GET | `/api/users/:id/students` | Get mentor's students | Self/Admin | 100/min |
| POST | `/api/users/assign-mentor` | Assign mentor | Admin | - |
| POST | `/api/users/unassign-mentor` | Unassign mentor | Admin | - |

## Security Features

### 1. Password Security
- Minimum 8 characters
- bcrypt hashing with 12 salt rounds
- No plaintext storage
- Secure password change flow

### 2. JWT Security
- 24-hour token expiry
- Secure secret key (32+ characters)
- HttpOnly cookie storage
- Proper cookie flags (secure, sameSite)

### 3. Rate Limiting
- Authentication: 5 attempts per 15 minutes
- General API: 100 requests per minute
- Email-specific limits for signup/login
- Redis-based distributed rate limiting

### 4. Input Validation
- Zod schema validation
- Email format validation
- Role enum validation
- UUID parameter validation

### 5. Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HTTPS)
- Content-Security-Policy

### 6. Logging and Monitoring
- Authentication attempts
- Authorization failures
- Role violations
- Security events with context

## Testing the System

### 1. Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'

# Access protected route
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt
```

### 2. Test RBAC

```bash
# Test role-specific endpoints
curl -X GET http://localhost:3001/api/auth-test/student-only -b cookies.txt
curl -X GET http://localhost:3001/api/auth-test/mentor-only -b cookies.txt
curl -X GET http://localhost:3001/api/auth-test/admin-only -b cookies.txt

# Test role hierarchy
curl -X GET http://localhost:3001/api/auth-test/min-mentor -b cookies.txt

# Test resource ownership
curl -X GET http://localhost:3001/api/auth-test/profile/{user-id} -b cookies.txt
```

### 3. Test Rate Limiting

```bash
# Test authentication rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "wrong"}'
done
```

## Error Handling

### Authentication Errors

```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Authentication required"
  }
}
```

### Authorization Errors

```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Access denied. Required roles: ADMIN"
  }
}
```

### Rate Limit Errors

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_ERROR",
    "message": "Too many authentication attempts, please try again in 15 minutes"
  }
}
```

## Best Practices

### 1. Route Protection
```typescript
// Always authenticate first, then authorize
router.get("/protected-route",
  authenticate,           // Check if user is logged in
  requireMentorOrAdmin,   // Check if user has required role
  handler
);
```

### 2. Resource Access
```typescript
// Check ownership for user-specific resources
router.get("/user/:id/data",
  authenticate,
  requireOwnershipOrAdmin((req) => req.params.id),
  handler
);
```

### 3. Error Handling
```typescript
// Use asyncHandler for automatic error catching
const handler = asyncHandler(async (req, res) => {
  // Throw specific errors
  if (!resource) {
    throw new NotFoundError("Resource");
  }
  
  if (!hasPermission) {
    throw new AuthorizationError("Insufficient permissions");
  }
});
```

### 4. Logging
```typescript
// Log security events
logger.warn("Access denied", {
  userId: req.user.id,
  requiredRole: "ADMIN",
  userRole: req.user.role,
  resource: req.url
});
```

## Environment Configuration

Required environment variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secure-secret-key-32-chars-min
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/uimp

# Redis (for rate limiting)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=http://localhost:3000

# Environment
NODE_ENV=development|production
```

## Monitoring and Alerts

Set up monitoring for:
- Failed authentication attempts
- Rate limit violations
- Authorization failures
- Unusual access patterns
- Token expiration issues
- Database connection problems

## Security Checklist

- [ ] JWT secret is secure (32+ characters)
- [ ] Passwords are hashed with bcrypt
- [ ] HttpOnly cookies are used
- [ ] Rate limiting is configured
- [ ] HTTPS is enforced in production
- [ ] Security headers are set
- [ ] Input validation is comprehensive
- [ ] Error messages don't leak sensitive info
- [ ] Logging captures security events
- [ ] Role permissions are properly enforced

This authentication and RBAC system provides enterprise-grade security with comprehensive role management, resource protection, and monitoring capabilities.