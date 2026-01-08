# API Contracts - UIMP Backend

This document defines the API contracts for the Unified Internship & Mentorship Portal (UIMP) backend.

**Base URL**: `/api`  
**Content-Type**: `application/json` (unless specified otherwise)  
**Authentication**: JWT token in HttpOnly cookie (`auth-token`)

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Application APIs](#application-apis)
3. [Feedback APIs](#feedback-apis)
4. [Common Response Formats](#common-response-formats)
5. [Error Handling](#error-handling)

---

## Authentication APIs

### POST /api/auth/signup

**Purpose**: Register a new user account

**Authorization**: Public (no authentication required)

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!",
  "role": "STUDENT"
}
```

**Request Schema**:
- `email` (string, required): Valid email address, must be unique
- `password` (string, required): Minimum 8 characters
- `role` (enum, required): One of `STUDENT`, `MENTOR`, `ADMIN`

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "User created successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists
- `422 Validation Error`: Validation failed

---

### POST /api/auth/login

**Purpose**: Authenticate user and receive JWT token

**Authorization**: Public (no authentication required)

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "SecurePass123!"
}
```

**Request Schema**:
- `email` (string, required): User email address
- `password` (string, required): User password

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "STUDENT"
    }
  },
  "message": "Login successful"
}
```

**Cookies Set**:
- `auth-token`: JWT token (HttpOnly, Secure, SameSite=Strict)
  - Expires: 24 hours
  - Contains: `userId`, `email`, `role`

**Error Responses**:
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `422 Validation Error`: Invalid email format

---

### POST /api/auth/logout

**Purpose**: Logout current user and invalidate session

**Authorization**: Authenticated users only

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookies Cleared**:
- `auth-token`: Removed

**Error Responses**:
- `401 Unauthorized`: Not authenticated

---

### GET /api/auth/me

**Purpose**: Get current authenticated user information

**Authorization**: Authenticated users only

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@example.com",
      "role": "STUDENT",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated or invalid token

---

## Application APIs

### GET /api/applications

**Purpose**: List internship applications

**Authorization**: 
- `STUDENT`: Own applications only
- `MENTOR`: Applications of assigned students
- `ADMIN`: All applications

**Query Parameters**:
- `status` (string, optional): Filter by status (`DRAFT`, `APPLIED`, `SHORTLISTED`, `INTERVIEW`, `OFFER`, `REJECTED`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `company` (string, optional): Filter by company name (partial match)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "company": "Tech Corp",
        "role": "Software Engineer Intern",
        "platform": "LINKEDIN",
        "status": "APPLIED",
        "resumeUrl": "https://s3.amazonaws.com/bucket/resume.pdf",
        "notes": "Applied through LinkedIn referral",
        "deadline": "2024-02-15T00:00:00Z",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-16T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions

---

### POST /api/applications

**Purpose**: Create a new internship application

**Authorization**: `STUDENT` role only

**Request Body**:
```json
{
  "company": "Tech Corp",
  "role": "Software Engineer Intern",
  "platform": "LINKEDIN",
  "status": "DRAFT",
  "resumeUrl": "https://s3.amazonaws.com/bucket/resume.pdf",
  "notes": "Found through LinkedIn job posting",
  "deadline": "2024-02-15T00:00:00Z"
}
```

**Request Schema**:
- `company` (string, required): Company name (max 255 chars)
- `role` (string, required): Position role/title (max 255 chars)
- `platform` (enum, required): One of `LINKEDIN`, `COMPANY_WEBSITE`, `REFERRAL`, `JOB_BOARD`, `CAREER_FAIR`, `OTHER`
- `status` (enum, optional): One of `DRAFT`, `APPLIED`, `SHORTLISTED`, `INTERVIEW`, `OFFER`, `REJECTED` (default: `DRAFT`)
- `resumeUrl` (string, optional): URL to uploaded resume file
- `notes` (string, optional): Additional notes (max 5000 chars)
- `deadline` (ISO 8601 date, optional): Application deadline

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "company": "Tech Corp",
      "role": "Software Engineer Intern",
      "platform": "LINKEDIN",
      "status": "DRAFT",
      "resumeUrl": "https://s3.amazonaws.com/bucket/resume.pdf",
      "notes": "Found through LinkedIn job posting",
      "deadline": "2024-02-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  },
  "message": "Application created successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a STUDENT role
- `422 Validation Error`: Validation failed

---

### GET /api/applications/:id

**Purpose**: Get a specific application by ID

**Authorization**: 
- `STUDENT`: Own applications only
- `MENTOR`: Applications of assigned students
- `ADMIN`: All applications

**Path Parameters**:
- `id` (UUID, required): Application ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "company": "Tech Corp",
      "role": "Software Engineer Intern",
      "platform": "LINKEDIN",
      "status": "APPLIED",
      "resumeUrl": "https://s3.amazonaws.com/bucket/resume.pdf",
      "notes": "Applied through LinkedIn referral",
      "deadline": "2024-02-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-16T14:20:00Z",
      "feedback": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440000",
          "mentorId": "880e8400-e29b-41d4-a716-446655440000",
          "content": "Great resume! Consider adding more projects.",
          "tags": ["RESUME"],
          "priority": "MEDIUM",
          "createdAt": "2024-01-16T09:00:00Z"
        }
      ]
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Application not found

---

### PUT /api/applications/:id

**Purpose**: Update an existing application

**Authorization**: `STUDENT` role, own applications only

**Path Parameters**:
- `id` (UUID, required): Application ID

**Request Body** (all fields optional, only provided fields will be updated):
```json
{
  "company": "Updated Tech Corp",
  "role": "Senior Software Engineer Intern",
  "platform": "COMPANY_WEBSITE",
  "status": "SHORTLISTED",
  "resumeUrl": "https://s3.amazonaws.com/bucket/resume-v2.pdf",
  "notes": "Updated notes after interview",
  "deadline": "2024-03-01T00:00:00Z"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "company": "Updated Tech Corp",
      "role": "Senior Software Engineer Intern",
      "platform": "COMPANY_WEBSITE",
      "status": "SHORTLISTED",
      "resumeUrl": "https://s3.amazonaws.com/bucket/resume-v2.pdf",
      "notes": "Updated notes after interview",
      "deadline": "2024-03-01T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-17T11:45:00Z"
    }
  },
  "message": "Application updated successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the owner of the application
- `404 Not Found`: Application not found
- `422 Validation Error`: Validation failed

---

### DELETE /api/applications/:id

**Purpose**: Delete an application

**Authorization**: `STUDENT` role, own applications only

**Path Parameters**:
- `id` (UUID, required): Application ID

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the owner of the application
- `404 Not Found`: Application not found

---

## Feedback APIs

### GET /api/feedback

**Purpose**: List feedback entries

**Authorization**: 
- `STUDENT`: Feedback on own applications
- `MENTOR`: Own feedback entries
- `ADMIN`: All feedback

**Query Parameters**:
- `applicationId` (UUID, optional): Filter by application ID
- `mentorId` (UUID, optional): Filter by mentor ID
- `priority` (enum, optional): Filter by priority (`LOW`, `MEDIUM`, `HIGH`)
- `tags` (string[], optional): Filter by tags (comma-separated: `RESUME,DSA`)
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "applicationId": "660e8400-e29b-41d4-a716-446655440000",
        "mentorId": "880e8400-e29b-41d4-a716-446655440000",
        "mentor": {
          "id": "880e8400-e29b-41d4-a716-446655440000",
          "email": "mentor@example.com"
        },
        "application": {
          "id": "660e8400-e29b-41d4-a716-446655440000",
          "company": "Tech Corp",
          "role": "Software Engineer Intern"
        },
        "content": "Your resume looks good overall. Consider adding more details about your projects and their impact.",
        "tags": ["RESUME", "COMMUNICATION"],
        "priority": "MEDIUM",
        "createdAt": "2024-01-16T09:00:00Z",
        "updatedAt": "2024-01-16T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions

---

### POST /api/feedback

**Purpose**: Create new feedback for an application

**Authorization**: `MENTOR` role only

**Request Body**:
```json
{
  "applicationId": "660e8400-e29b-41d4-a716-446655440000",
  "content": "Great progress! Your DSA skills have improved significantly. Focus on system design concepts next.",
  "tags": ["DSA", "SYSTEM_DESIGN"],
  "priority": "HIGH"
}
```

**Request Schema**:
- `applicationId` (UUID, required): ID of the application to provide feedback for
- `content` (string, required): Feedback text content (max 5000 chars)
- `tags` (string[], required): Array of skill tags, at least one required
  - Valid values: `RESUME`, `DSA`, `SYSTEM_DESIGN`, `COMMUNICATION`
- `priority` (enum, required): One of `LOW`, `MEDIUM`, `HIGH`

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "feedback": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "applicationId": "660e8400-e29b-41d4-a716-446655440000",
      "mentorId": "880e8400-e29b-41d4-a716-446655440000",
      "content": "Great progress! Your DSA skills have improved significantly. Focus on system design concepts next.",
      "tags": ["DSA", "SYSTEM_DESIGN"],
      "priority": "HIGH",
      "createdAt": "2024-01-16T09:00:00Z",
      "updatedAt": "2024-01-16T09:00:00Z"
    }
  },
  "message": "Feedback created successfully"
}
```

**Side Effects**:
- Creates an in-app notification for the student
- Sends email notification to the student (if configured)

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not a MENTOR role or not assigned to student
- `404 Not Found`: Application not found
- `422 Validation Error`: Validation failed

---

### GET /api/feedback/:id

**Purpose**: Get a specific feedback entry by ID

**Authorization**: 
- `STUDENT`: Feedback on own applications
- `MENTOR`: Own feedback entries
- `ADMIN`: All feedback

**Path Parameters**:
- `id` (UUID, required): Feedback ID

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "feedback": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "applicationId": "660e8400-e29b-41d4-a716-446655440000",
      "mentorId": "880e8400-e29b-41d4-a716-446655440000",
      "mentor": {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "email": "mentor@example.com"
      },
      "application": {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "company": "Tech Corp",
        "role": "Software Engineer Intern",
        "status": "APPLIED"
      },
      "content": "Great progress! Your DSA skills have improved significantly. Focus on system design concepts next.",
      "tags": ["DSA", "SYSTEM_DESIGN"],
      "priority": "HIGH",
      "createdAt": "2024-01-16T09:00:00Z",
      "updatedAt": "2024-01-16T09:00:00Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Feedback not found

---

### PUT /api/feedback/:id

**Purpose**: Update an existing feedback entry

**Authorization**: `MENTOR` role, own feedback only

**Path Parameters**:
- `id` (UUID, required): Feedback ID

**Request Body** (all fields optional, only provided fields will be updated):
```json
{
  "content": "Updated feedback content with more details.",
  "tags": ["RESUME", "DSA", "SYSTEM_DESIGN"],
  "priority": "MEDIUM"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "feedback": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "applicationId": "660e8400-e29b-41d4-a716-446655440000",
      "mentorId": "880e8400-e29b-41d4-a716-446655440000",
      "content": "Updated feedback content with more details.",
      "tags": ["RESUME", "DSA", "SYSTEM_DESIGN"],
      "priority": "MEDIUM",
      "createdAt": "2024-01-16T09:00:00Z",
      "updatedAt": "2024-01-17T10:15:00Z"
    }
  },
  "message": "Feedback updated successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the author of the feedback
- `404 Not Found`: Feedback not found
- `422 Validation Error`: Validation failed

---

### DELETE /api/feedback/:id

**Purpose**: Delete a feedback entry

**Authorization**: `MENTOR` role, own feedback only

**Path Parameters**:
- `id` (UUID, required): Feedback ID

**Request Body**: None

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not the author of the feedback
- `404 Not Found`: Feedback not found

---

## Common Response Formats

### Success Response Format

All successful API responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response-specific data
  },
  "message": "Optional success message"
}
```

### Pagination Format

List endpoints that support pagination include:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Error Handling

### Error Response Format

All error responses follow this consistent structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PUT, DELETE requests
- `201 Created`: Successful POST requests (resource created)
- `400 Bad Request`: Invalid request format or parameters
- `401 Unauthorized`: Authentication required or invalid token
- `403 Forbidden`: Authenticated but insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server error

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_EMAIL`: Email already exists
- `INVALID_CREDENTIALS`: Wrong email or password
- `INVALID_TOKEN`: Invalid or expired JWT token
- `RESOURCE_NOT_OWNED`: User doesn't own the resource
- `MENTOR_NOT_ASSIGNED`: Mentor not assigned to student

### Validation Error Details

When validation fails (422), the response includes field-level errors:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required", "Invalid email format"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

---

## Rate Limiting

- **General APIs**: 100 requests per minute per IP
- **Authentication APIs**: 5 requests per 15 minutes per IP
- **File Upload APIs**: 10 requests per hour per user

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Versioning

Current API version: `v1`

Future versions will be accessible via URL prefix: `/api/v2/...`

---

**Last Updated**: 2024-01-15  
**Maintained By**: Backend Team (Heramb)  
**Review Schedule**: Weekly during development, monthly post-deployment

