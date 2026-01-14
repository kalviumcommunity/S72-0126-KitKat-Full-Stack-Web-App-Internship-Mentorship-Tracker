# Feedback API Documentation

## Overview

The Feedback API allows mentors to provide feedback on student applications. This API enforces strict authorization rules to ensure only assigned mentors can provide feedback to their students.

## Features

- ✅ **Mentor Authorization**: Only mentors can create feedback
- ✅ **Assignment Verification**: Mentors can only provide feedback to assigned students
- ✅ **Role-Based Access**: Students see their feedback, mentors see feedback they gave
- ✅ **CRUD Operations**: Create, Read, Update, Delete feedback
- ✅ **Filtering & Pagination**: Filter by tags, priority, application, mentor
- ✅ **Statistics**: Get feedback statistics by priority and tags
- ✅ **Notifications**: Students receive notifications when feedback is created
- ✅ **Validation**: Comprehensive input validation using Zod schemas

## Authorization Rules

### Create Feedback
- **Allowed**: Mentors only
- **Requirement**: Mentor must be assigned to the student who owns the application
- **Verification**: Active mentor assignment is checked before creation

### Read Feedback
- **Students**: Can view feedback on their own applications
- **Mentors**: Can view feedback they created or on their assigned students' applications
- **Admins**: Can view all feedback

### Update Feedback
- **Allowed**: Mentor who created the feedback
- **Restriction**: Cannot update other mentors' feedback

### Delete Feedback
- **Allowed**: Mentor who created the feedback, or Admin
- **Restriction**: Students cannot delete feedback

## API Endpoints

### 1. Create Feedback
```http
POST /api/feedback
Authorization: Bearer <mentor_token>
Content-Type: application/json

{
  "applicationId": "uuid",
  "content": "Detailed feedback content (10-2000 characters)",
  "tags": ["RESUME", "DSA", "SYSTEM_DESIGN", "COMMUNICATION"],
  "priority": "LOW" | "MEDIUM" | "HIGH"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": {
      "id": "uuid",
      "applicationId": "uuid",
      "mentorId": "uuid",
      "content": "Feedback content",
      "tags": ["RESUME", "COMMUNICATION"],
      "priority": "HIGH",
      "createdAt": "2024-01-14T10:00:00Z",
      "updatedAt": "2024-01-14T10:00:00Z",
      "mentor": {
        "id": "uuid",
        "email": "mentor@test.com",
        "firstName": "John",
        "lastName": "Mentor"
      },
      "application": {
        "id": "uuid",
        "company": "Tech Corp",
        "role": "Software Engineer",
        "status": "APPLIED"
      }
    }
  },
  "message": "Feedback created successfully"
}
```

### 2. Get Feedback by ID
```http
GET /api/feedback/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": {
      "id": "uuid",
      "content": "Feedback content",
      "tags": ["RESUME"],
      "priority": "MEDIUM",
      "createdAt": "2024-01-14T10:00:00Z",
      "mentor": { ... },
      "application": { ... }
    }
  }
}
```

### 3. List Feedback
```http
GET /api/feedback?page=1&limit=20&tags=RESUME&priority=HIGH&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `applicationId` (optional): Filter by application UUID
- `mentorId` (optional): Filter by mentor UUID
- `tags` (optional): Filter by tags (can be array)
- `priority` (optional): Filter by priority (can be array)
- `sortBy` (optional): Sort field (createdAt, updatedAt, priority)
- `sortOrder` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "content": "Feedback content",
        "tags": ["RESUME"],
        "priority": "HIGH",
        "mentor": { ... },
        "application": { ... }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4. Get Feedback for Application
```http
GET /api/feedback/application/:applicationId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": [
      {
        "id": "uuid",
        "content": "Feedback content",
        "tags": ["RESUME", "COMMUNICATION"],
        "priority": "HIGH",
        "createdAt": "2024-01-14T10:00:00Z",
        "mentor": {
          "id": "uuid",
          "email": "mentor@test.com",
          "firstName": "John",
          "lastName": "Mentor"
        }
      }
    ]
  }
}
```

### 5. Update Feedback
```http
PATCH /api/feedback/:id
Authorization: Bearer <mentor_token>
Content-Type: application/json

{
  "content": "Updated feedback content",
  "tags": ["DSA", "SYSTEM_DESIGN"],
  "priority": "MEDIUM"
}
```

**Note:** All fields are optional, but at least one must be provided.

**Response:**
```json
{
  "success": true,
  "data": {
    "feedback": {
      "id": "uuid",
      "content": "Updated feedback content",
      "tags": ["DSA", "SYSTEM_DESIGN"],
      "priority": "MEDIUM",
      "updatedAt": "2024-01-14T11:00:00Z",
      "mentor": { ... },
      "application": { ... }
    }
  },
  "message": "Feedback updated successfully"
}
```

### 6. Delete Feedback
```http
DELETE /api/feedback/:id
Authorization: Bearer <mentor_or_admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

### 7. Get Feedback Statistics
```http
GET /api/feedback/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 45,
      "byPriority": {
        "LOW": 10,
        "MEDIUM": 20,
        "HIGH": 15
      },
      "byTag": {
        "RESUME": 25,
        "DSA": 30,
        "SYSTEM_DESIGN": 15,
        "COMMUNICATION": 20
      },
      "recent": [
        {
          "id": "uuid",
          "content": "Recent feedback",
          "tags": ["RESUME"],
          "priority": "HIGH",
          "createdAt": "2024-01-14T10:00:00Z",
          "mentor": { ... },
          "application": { ... }
        }
      ]
    }
  }
}
```

## Validation Rules

### Content
- **Required**: Yes
- **Min Length**: 10 characters
- **Max Length**: 2000 characters
- **Type**: String (trimmed)

### Tags
- **Required**: Yes
- **Min Items**: 1
- **Max Items**: 4
- **Allowed Values**: RESUME, DSA, SYSTEM_DESIGN, COMMUNICATION

### Priority
- **Required**: Yes
- **Allowed Values**: LOW, MEDIUM, HIGH

### Application ID
- **Required**: Yes (for creation)
- **Format**: Valid UUID
- **Validation**: Application must exist and mentor must be assigned to student

## Error Responses

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "content": "Feedback content must be at least 10 characters",
      "tags": "At least one tag is required"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden - Not a Mentor
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Only mentors can create feedback"
  }
}
```

### 403 Forbidden - Not Assigned
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "You are not assigned as a mentor to this student"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Feedback not found"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_ERROR",
    "message": "Too many feedback submissions, please try again later"
  }
}
```

## Rate Limits

- **Create/Update/Delete**: 20 requests per 15 minutes
- **Read Operations**: 100 requests per 15 minutes

## Testing

### PowerShell (Windows)
```powershell
.\test-feedback.ps1
```

### Bash (Linux/Mac)
```bash
chmod +x test-feedback.sh
./test-feedback.sh
```

The test scripts will:
1. Login as student, mentor, and admin
2. Create a test application
3. Verify students cannot create feedback
4. Create feedback as mentor
5. Test read operations for all roles
6. Test update operations
7. Test filtering and statistics
8. Test delete operations
9. Verify authorization rules

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT token
2. **Role-Based Access Control**: Enforced at middleware and service level
3. **Mentor Assignment Verification**: Checked before feedback creation
4. **Input Validation**: Comprehensive validation using Zod schemas
5. **Rate Limiting**: Prevents abuse and spam
6. **SQL Injection Protection**: Prisma ORM with parameterized queries
7. **XSS Protection**: Input sanitization and output encoding
8. **Audit Logging**: All operations logged with user context

## Notifications

When feedback is created, a notification is automatically sent to the student:

```json
{
  "type": "FEEDBACK_RECEIVED",
  "title": "New Feedback Received",
  "message": "You received new feedback from John Mentor on your Tech Corp application"
}
```

## Best Practices

1. **Provide Constructive Feedback**: Be specific and actionable
2. **Use Appropriate Tags**: Select tags that match the feedback content
3. **Set Priority Correctly**: HIGH for urgent items, MEDIUM for important, LOW for suggestions
4. **Keep Content Professional**: Maintain a respectful and helpful tone
5. **Update When Needed**: If student makes improvements, update feedback accordingly
6. **Don't Delete Unnecessarily**: Feedback history is valuable for tracking progress

## Integration Example

```typescript
// Create feedback
const createFeedback = async (applicationId: string, content: string) => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mentorToken}`
    },
    body: JSON.stringify({
      applicationId,
      content,
      tags: ['RESUME', 'COMMUNICATION'],
      priority: 'HIGH'
    })
  });
  
  return response.json();
};

// Get feedback for application
const getApplicationFeedback = async (applicationId: string) => {
  const response = await fetch(`/api/feedback/application/${applicationId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

## Support

For issues or questions:
1. Check the error response for details
2. Review the validation rules
3. Verify mentor assignment is active
4. Check rate limit status
5. Review server logs for detailed error information
