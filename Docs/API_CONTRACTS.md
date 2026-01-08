# API Contracts - UIMP Backend

Single source of truth for backend contract. All routes return JSON with
`success`, `data` (when applicable), and `message`/`error`.

---

## Authentication APIs

### POST /api/auth/signup
- **Purpose**: Register user
- **Auth**: Public
- **Body**:
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "role": "STUDENT | MENTOR | ADMIN (required)"
}
```
- **Response 201**:
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
- **Purpose**: Authenticate user
- **Auth**: Public
- **Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
- **Response 200**:
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
- **Side effect**: Sets HttpOnly cookie `auth-token` (JWT)

### POST /api/auth/logout
- **Purpose**: Clear session
- **Auth**: Authenticated
- **Response 200**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
- **Purpose**: Return current user from JWT
- **Auth**: Authenticated
- **Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "role": "STUDENT | MENTOR | ADMIN"
    }
  }
}
```

---

## Application APIs

### GET /api/applications
- **Purpose**: List applications
- **Auth**: Student (own), Mentor (assigned), Admin (all)
- **Query**: `status?`, `page?=1`, `limit?=10`
- **Response 200**:
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
        "resumeUrl": "string|null",
        "notes": "string|null",
        "deadline": "timestamp|null",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }
  }
}
```

### POST /api/applications
- **Purpose**: Create application
- **Auth**: Student
- **Body**:
```json
{
  "company": "string (required)",
  "role": "string (required)",
  "platform": "LINKEDIN | COMPANY_WEBSITE | REFERRAL | JOB_BOARD | CAREER_FAIR | OTHER (required)",
  "resumeUrl": "string (optional)",
  "notes": "string (optional)",
  "deadline": "timestamp (optional)"
}
```
- **Response 201**: Created application object

### GET /api/applications/:id
- **Purpose**: Fetch application
- **Auth**: Owner, assigned mentor, admin
- **Response 200**: Application object

### PUT /api/applications/:id
- **Purpose**: Update application
- **Auth**: Owner
- **Body**: Same shape as create (all optional)
- **Response 200**: Updated application

### DELETE /api/applications/:id
- **Purpose**: Delete application
- **Auth**: Owner
- **Response 204**: No content

---

## Feedback APIs

### GET /api/feedback
- **Purpose**: List feedback
- **Auth**: Student (own), Mentor (authored), Admin (all)
- **Query**: `applicationId?`, `mentorId?`
- **Response 200**: Array of feedback objects

### POST /api/feedback
- **Purpose**: Create feedback
- **Auth**: Mentor
- **Body**:
```json
{
  "applicationId": "uuid (required)",
  "content": "string (required)",
  "tags": ["RESUME", "DSA", "SYSTEM_DESIGN", "COMMUNICATION"],
  "priority": "LOW | MEDIUM | HIGH (required)"
}
```
- **Response 201**: Created feedback

### GET /api/feedback/:id
- **Purpose**: Fetch feedback detail
- **Auth**: Owner or related student/admin
- **Response 200**: Feedback object

### PUT /api/feedback/:id
- **Purpose**: Update feedback
- **Auth**: Feedback author
- **Response 200**: Updated feedback

### DELETE /api/feedback/:id
- **Purpose**: Delete feedback
- **Auth**: Feedback author or admin
- **Response 204**: No content

---

## Upload APIs

### POST /api/upload/resume
- **Purpose**: Upload resume (PDF)
- **Auth**: Student
- **Request**: Multipart form data; single `file` field (PDF max 5MB)
- **Response 201**:
```json
{
  "success": true,
  "data": {
    "fileUrl": "string",
    "fileName": "string",
    "fileSize": 12345
  }
}
```

---

## Notification APIs

### GET /api/notifications
- **Purpose**: List notifications for current user
- **Auth**: Authenticated user
- **Response 200**: Array of notifications

### PUT /api/notifications/:id/read
- **Purpose**: Mark notification as read
- **Auth**: Owner
- **Response 200**: Updated notification

### DELETE /api/notifications/:id
- **Purpose**: Delete notification
- **Auth**: Owner
- **Response 204**: No content

---

## Standard Error Response
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
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 500: Internal Server Error