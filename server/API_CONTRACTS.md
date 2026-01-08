# API Contracts - UIMP Backend

## Authentication APIs

### POST /api/auth/signup
**Purpose**: User registration
**Request Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "role": "STUDENT | MENTOR | ADMIN (required)"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "string",
      "createdAt": "timestamp"
    }
  },
  "message": "User created successfully"
}
```

### POST /api/auth/login
**Purpose**: User authentication
**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "string"
    }
  },
  "message": "Login successful"
}
```
**Sets HttpOnly Cookie**: `auth-token` with JWT

### POST /api/auth/logout
**Purpose**: User logout
**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Application APIs

### GET /api/applications
**Purpose**: List user applications
**Authorization**: Student (own), Mentor (assigned students), Admin (all)
**Query Parameters**:
- `status`: Filter by status (optional)
- `page`: Pagination (default: 1)
- `limit`: Items per page (default: 10)

**Response**:
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "company": "string",
        "role": "string",
        "platform": "string",
        "status": "DRAFT | APPLIED | SHORTLISTED | INTERVIEW | OFFER | REJECTED",
        "resumeUrl": "string",
        "notes": "string",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
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

### POST /api/applications
**Purpose**: Create new application
**Authorization**: Student only
**Request Body**:
```json
{
  "company": "string (required)",
  "role": "string (required)",
  "platform": "string (required)",
  "resumeUrl": "string (optional)",
  "notes": "string (optional)"
}
```

### GET /api/applications/:id
**Purpose**: Get application details
**Authorization**: Owner, assigned mentor, admin

### PUT /api/applications/:id
**Purpose**: Update application
**Authorization**: Owner only

### DELETE /api/applications/:id
**Purpose**: Delete application
**Authorization**: Owner only

## Feedback APIs

### GET /api/feedback
**Purpose**: List feedback
**Authorization**: Student (own), Mentor (own feedback), Admin (all)
**Query Parameters**:
- `applicationId`: Filter by application
- `mentorId`: Filter by mentor

### POST /api/feedback
**Purpose**: Create feedback
**Authorization**: Mentor only
**Request Body**:
```json
{
  "applicationId": "uuid (required)",
  "content": "string (required)",
  "tags": ["RESUME", "DSA", "SYSTEM_DESIGN", "COMMUNICATION"],
  "priority": "LOW | MEDIUM | HIGH (required)"
}
```

### GET /api/feedback/:id
**Purpose**: Get feedback details

### PUT /api/feedback/:id
**Purpose**: Update feedback
**Authorization**: Feedback author only

## Upload APIs

### POST /api/upload/resume
**Purpose**: Upload resume file
**Authorization**: Student only
**Request**: Multipart form data with PDF file
**Response**:
```json
{
  "success": true,
  "data": {
    "fileUrl": "string",
    "fileName": "string",
    "fileSize": "number"
  }
}
```

## Notification APIs

### GET /api/notifications
**Purpose**: List user notifications
**Authorization**: Own notifications only

### PUT /api/notifications/:id/read
**Purpose**: Mark notification as read

## Error Responses

All APIs return consistent error format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": "Additional error details (optional)"
  }
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error