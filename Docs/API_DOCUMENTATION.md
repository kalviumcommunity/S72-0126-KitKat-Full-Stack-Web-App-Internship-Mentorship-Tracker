# UIMP Backend API Documentation

## Overview

The Unified Internship & Mentorship Portal (UIMP) backend provides a comprehensive REST API for managing internship applications, mentorship relationships, feedback, and user management. The API is built with Node.js, Express, TypeScript, and PostgreSQL.

**Base URL:** `http://localhost:3001/api` (development)

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Applications](#applications)
4. [Feedback](#feedback)
5. [Notifications](#notifications)
6. [File Upload](#file-upload)
7. [Data Models](#data-models)
8. [Error Handling](#error-handling)
9. [Rate Limiting](#rate-limiting)
10. [Security](#security)

---

## Authentication

All API endpoints (except login/signup) require authentication via JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Endpoints

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "STUDENT",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Rate Limit:** 3 signups per hour per email

---

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "STUDENT",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here"
  }
}
```

**Rate Limit:** 5 attempts per 15 minutes per email

---

#### GET /api/auth/me
Get current authenticated user information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

#### POST /api/auth/logout
Logout current user (invalidates token).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /api/auth/change-password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Users

User management endpoints with role-based access control.

### Endpoints

#### GET /api/users
List all users (Admin only).

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `role` (string): Filter by user role (STUDENT, MENTOR, ADMIN)
- `search` (string): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "role": "STUDENT",
        "firstName": "John",
        "lastName": "Doe",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

#### GET /api/users/:id
Get user by ID (Self, assigned mentor, or admin).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "profileImageUrl": null,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### PUT /api/users/:id
Update user profile (Self or admin).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

#### GET /api/users/:id/mentors
Get user's assigned mentors (Student or admin).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "mentor@example.com",
      "firstName": "Jane",
      "lastName": "Mentor",
      "assignedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### GET /api/users/:id/students
Get mentor's assigned students (Mentor or admin).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Student",
      "assignedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST /api/users/assign-mentor
Assign mentor to student (Admin only).

**Request Body:**
```json
{
  "mentorId": "uuid",
  "studentId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mentor assigned successfully"
}
```

---

## Applications

Internship application management with comprehensive security and validation.

### Endpoints

#### GET /api/applications
List applications with filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `status` (string): Filter by status (DRAFT, APPLIED, SHORTLISTED, INTERVIEW, OFFER, REJECTED)
- `company` (string): Filter by company name
- `platform` (string): Filter by platform (LINKEDIN, COMPANY_WEBSITE, etc.)
- `search` (string): Search by company or role

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "company": "Google",
        "role": "Software Engineer Intern",
        "platform": "LINKEDIN",
        "status": "APPLIED",
        "deadline": "2024-03-15T00:00:00.000Z",
        "appliedDate": "2024-01-15T00:00:00.000Z",
        "notes": "Applied through referral",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "feedback": [
          {
            "id": "uuid",
            "content": "Great application!",
            "priority": "HIGH",
            "mentor": {
              "firstName": "Jane",
              "lastName": "Mentor"
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

#### GET /api/applications/:id
Get application by ID with comprehensive access control.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "Google",
    "role": "Software Engineer Intern",
    "platform": "LINKEDIN",
    "status": "APPLIED",
    "resumeUrl": "https://example.com/resume.pdf",
    "notes": "Applied through referral",
    "deadline": "2024-03-15T00:00:00.000Z",
    "appliedDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe"
    },
    "feedback": [
      {
        "id": "uuid",
        "content": "Great application! Consider improving your resume.",
        "tags": ["RESUME", "COMMUNICATION"],
        "priority": "HIGH",
        "createdAt": "2024-01-02T00:00:00.000Z",
        "mentor": {
          "id": "uuid",
          "firstName": "Jane",
          "lastName": "Mentor"
        }
      }
    ]
  }
}
```

---

#### POST /api/applications
Create new application (Students only).

**Request Body:**
```json
{
  "company": "Google",
  "role": "Software Engineer Intern",
  "platform": "LINKEDIN",
  "status": "DRAFT",
  "resumeUrl": "https://example.com/resume.pdf",
  "notes": "Applied through referral",
  "deadline": "2024-03-15",
  "appliedDate": "2024-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "Google",
    "role": "Software Engineer Intern",
    "platform": "LINKEDIN",
    "status": "DRAFT",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### PUT /api/applications/:id
Update application (Students only, own applications).

**Request Body:**
```json
{
  "status": "APPLIED",
  "notes": "Updated notes",
  "appliedDate": "2024-01-16"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "company": "Google",
    "role": "Software Engineer Intern",
    "status": "APPLIED",
    "notes": "Updated notes",
    "updatedAt": "2024-01-16T00:00:00.000Z"
  }
}
```

---

#### DELETE /api/applications/:id
Delete application (Students only, own applications).

**Response:**
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

#### GET /api/applications/stats/overview
Get application statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalApplications": 25,
    "statusBreakdown": {
      "DRAFT": 5,
      "APPLIED": 10,
      "SHORTLISTED": 3,
      "INTERVIEW": 2,
      "OFFER": 1,
      "REJECTED": 4
    },
    "platformBreakdown": {
      "LINKEDIN": 15,
      "COMPANY_WEBSITE": 8,
      "REFERRAL": 2
    },
    "recentActivity": [
      {
        "date": "2024-01-15",
        "count": 3
      }
    ]
  }
}
```

---

#### GET /api/applications/export/data
Export applications data (Students only, own applications).

**Query Parameters:**
- `status` (string): Filter by status
- `platform` (string): Filter by platform
- `startDate` (string): Start date (ISO format)
- `endDate` (string): End date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [...],
    "exportedAt": "2024-01-01T12:00:00.000Z",
    "totalCount": 25
  }
}
```

---

#### PATCH /api/applications/bulk/status
Bulk update application status (Students only).

**Request Body:**
```json
{
  "applicationIds": ["uuid1", "uuid2", "uuid3"],
  "status": "APPLIED"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updatedCount": 3,
    "updatedApplications": [
      {
        "id": "uuid1",
        "status": "APPLIED"
      }
    ]
  }
}
```

---

## Feedback

Feedback management system for mentor-student interactions.

### Endpoints

#### POST /api/feedback
Create new feedback (Mentors only).

**Request Body:**
```json
{
  "applicationId": "uuid",
  "content": "Great application! Consider improving your resume formatting.",
  "tags": ["RESUME", "COMMUNICATION"],
  "priority": "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "applicationId": "uuid",
    "content": "Great application! Consider improving your resume formatting.",
    "tags": ["RESUME", "COMMUNICATION"],
    "priority": "HIGH",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "mentor": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Mentor"
    }
  }
}
```

---

#### GET /api/feedback
List all feedback with filters (role-based access).

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `applicationId` (string): Filter by application ID
- `mentorId` (string): Filter by mentor ID
- `priority` (string): Filter by priority (LOW, MEDIUM, HIGH)
- `tags` (array): Filter by tags

**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": "uuid",
        "content": "Great application!",
        "tags": ["RESUME"],
        "priority": "HIGH",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "application": {
          "id": "uuid",
          "company": "Google",
          "role": "Software Engineer Intern"
        },
        "mentor": {
          "id": "uuid",
          "firstName": "Jane",
          "lastName": "Mentor"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

---

#### GET /api/feedback/:id
Get feedback by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Great application! Consider improving your resume formatting.",
    "tags": ["RESUME", "COMMUNICATION"],
    "priority": "HIGH",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "application": {
      "id": "uuid",
      "company": "Google",
      "role": "Software Engineer Intern",
      "user": {
        "firstName": "John",
        "lastName": "Doe"
      }
    },
    "mentor": {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Mentor"
    }
  }
}
```

---

#### GET /api/feedback/application/:applicationId
Get all feedback for a specific application.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "content": "Great application!",
      "tags": ["RESUME"],
      "priority": "HIGH",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "mentor": {
        "firstName": "Jane",
        "lastName": "Mentor"
      }
    }
  ]
}
```

---

#### PATCH /api/feedback/:id
Update feedback (Mentor who created it only).

**Request Body:**
```json
{
  "content": "Updated feedback content",
  "tags": ["RESUME", "DSA"],
  "priority": "MEDIUM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Updated feedback content",
    "tags": ["RESUME", "DSA"],
    "priority": "MEDIUM",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

#### DELETE /api/feedback/:id
Delete feedback (Mentor owner or admin).

**Response:**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

---

#### GET /api/feedback/stats
Get feedback statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFeedback": 50,
    "priorityBreakdown": {
      "HIGH": 15,
      "MEDIUM": 25,
      "LOW": 10
    },
    "tagBreakdown": {
      "RESUME": 20,
      "DSA": 15,
      "COMMUNICATION": 10,
      "SYSTEM_DESIGN": 5
    },
    "recentActivity": [
      {
        "date": "2024-01-15",
        "count": 5
      }
    ]
  }
}
```

---

## Notifications

Real-time notification system for user updates.

### Endpoints

#### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `type` (string): Filter by notification type
- `read` (boolean): Filter by read status

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "FEEDBACK_RECEIVED",
        "title": "New Feedback Received",
        "message": "You received new feedback on your Google application",
        "read": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "expiresAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

#### GET /api/notifications/unread
Get unread notification count.

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 3
  }
}
```

---

#### PUT /api/notifications/:id/read
Mark notification as read.

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

#### PUT /api/notifications/read-all
Mark all notifications as read.

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

#### DELETE /api/notifications/:id
Delete notification.

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## File Upload

Secure file upload system with validation and storage.

### Endpoints

#### POST /api/upload/resume
Upload resume file (PDF only, max 5MB).

**Request:** Multipart form data with file field

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://example.com/uploads/resume_uuid.pdf",
    "fileName": "resume.pdf",
    "fileSize": 1024000,
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST /api/upload/profile-image
Upload profile image (Images only, max 2MB).

**Request:** Multipart form data with file field

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://example.com/uploads/profile_uuid.jpg",
    "fileName": "profile.jpg",
    "fileSize": 512000,
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST /api/upload/document
Upload general document (PDF, DOC, DOCX, max 10MB).

**Request:** Multipart form data with file field

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "https://example.com/uploads/document_uuid.pdf",
    "fileName": "document.pdf",
    "fileSize": 2048000,
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### POST /api/upload/documents
Upload multiple documents (max 5 files, 10MB each).

**Request:** Multipart form data with files field (array)

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadedFiles": [
      {
        "fileUrl": "https://example.com/uploads/doc1_uuid.pdf",
        "fileName": "document1.pdf",
        "fileSize": 1024000
      },
      {
        "fileUrl": "https://example.com/uploads/doc2_uuid.pdf",
        "fileName": "document2.pdf",
        "fileSize": 2048000
      }
    ],
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### GET /api/upload/files/:filename
Get uploaded file (public access).

**Response:** File content with appropriate headers

---

#### DELETE /api/upload/:key
Delete uploaded file.

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

#### GET /api/upload/signed-url/:key
Get signed URL for secure file access.

**Response:**
```json
{
  "success": true,
  "data": {
    "signedUrl": "https://example.com/uploads/file.pdf?signature=...",
    "expiresAt": "2024-01-01T01:00:00.000Z"
  }
}
```

---

#### GET /api/upload/stats
Get upload statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFiles": 150,
    "totalSize": 1073741824,
    "fileTypes": {
      "pdf": 100,
      "jpg": 30,
      "png": 20
    },
    "recentUploads": [
      {
        "fileName": "resume.pdf",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
```

### Application
```typescript
interface Application {
  id: string;
  userId: string;
  company: string;
  role: string;
  platform: 'LINKEDIN' | 'COMPANY_WEBSITE' | 'REFERRAL' | 'JOB_BOARD' | 'CAREER_FAIR' | 'OTHER';
  status: 'DRAFT' | 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  resumeUrl?: string;
  notes?: string;
  deadline?: string;
  appliedDate?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  feedback?: Feedback[];
}
```

### Feedback
```typescript
interface Feedback {
  id: string;
  applicationId: string;
  mentorId: string;
  content: string;
  tags: ('RESUME' | 'DSA' | 'SYSTEM_DESIGN' | 'COMMUNICATION')[];
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  application?: Application;
  mentor?: User;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'FEEDBACK_RECEIVED' | 'APPLICATION_STATUS_CHANGED' | 'MENTOR_ASSIGNED' | 'SYSTEM_ANNOUNCEMENT';
  title: string;
  message: string;
  read: boolean;
  expiresAt?: string;
  createdAt: string;
}
```

---

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { ... }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (422): Request validation failed
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (e.g., duplicate email)
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

### Validation Error Example
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid email format"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

### Limits by Endpoint Type

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General endpoints**: 100 requests per 15 minutes per user
- **File upload endpoints**: 20 uploads per 15 minutes per user
- **Feedback creation**: 20 feedback per 15 minutes per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "retryAfter": 900
    }
  }
}
```

---

## Security

### Authentication
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Token blacklisting on logout

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Mentor-student relationship validation

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Helmet.js security headers

### File Upload Security
- File type validation
- File size limits
- Virus scanning (configurable)
- Secure file storage

### API Security
- Rate limiting
- Request size limits
- Timeout protection
- Error message sanitization

---

## Development & Testing

### Test Endpoints (Development Only)

The API includes test endpoints for development and testing purposes:

#### GET /api/auth-test/public
Public endpoint (no authentication required).

#### GET /api/auth-test/protected
Protected endpoint (authentication required).

#### GET /api/auth-test/student-only
Student role required.

#### GET /api/auth-test/mentor-only
Mentor role required.

#### GET /api/auth-test/admin-only
Admin role required.

### Health Check

#### GET /api/health
System health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600,
    "database": "connected",
    "version": "1.0.0"
  }
}
```

---

## Changelog

### Version 1.0.0
- Initial API release
- Authentication system
- User management
- Application management
- Feedback system
- Notification system
- File upload system
- Comprehensive security implementation

---

For more information or support, please contact the development team.