# Validation and Error Handling System

This document describes the comprehensive validation and error handling system implemented in the UIMP server.

## Overview

The system provides:
- **Global Error Handler**: Centralized error handling with consistent response format
- **Zod Validation Base**: Type-safe validation schemas for all API endpoints
- **Rate Limiting**: Configurable rate limiting for different endpoints
- **Security Headers**: Automatic security headers for all responses
- **Request Logging**: Comprehensive request/response logging

## Error Handling

### Custom Error Classes

```typescript
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ConflictError, 
  RateLimitError 
} from "./middlewares/error.middleware";

// Usage examples
throw new ValidationError("Invalid input", { email: ["Email is required"] });
throw new AuthenticationError("Invalid credentials");
throw new NotFoundError("User");
throw new ConflictError("Email already exists");
```

### Error Response Format

All errors return a consistent JSON format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "field": ["Specific validation errors"]
    }
  }
}
```

### Async Error Handling

Use the `asyncHandler` wrapper for async route handlers:

```typescript
import { asyncHandler } from "./middlewares/error.middleware";

router.get("/users", asyncHandler(async (req, res) => {
  // Any thrown error will be caught and handled by the global error handler
  const users = await getUsersFromDatabase();
  res.json({ success: true, data: users });
}));
```

## Validation System

### Basic Validation

```typescript
import { validateBody, validateParams, validateQuery } from "./middlewares/validation.middleware";
import { schemas } from "./lib/validation";

// Validate request body
router.post("/users", validateBody(schemas.auth.signup), handler);

// Validate URL parameters
router.get("/users/:id", validateParams(schemas.user.getUserById), handler);

// Validate query parameters
router.get("/users", validateQuery(schemas.user.listUsers), handler);
```

### Comprehensive Validation

```typescript
import { validateRequest } from "./middlewares/validation.middleware";

router.put("/users/:id", 
  validateRequest({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({ name: z.string().min(1) }),
    query: z.object({ notify: z.boolean().optional() })
  }),
  handler
);
```

### Available Schemas

The system includes pre-built schemas for:

- **Authentication**: signup, login, password reset
- **Users**: profile updates, user management
- **Applications**: CRUD operations with status validation
- **Feedback**: creation and management with tags and priority
- **Notifications**: system notifications
- **File Uploads**: resume uploads with type and size validation

### Custom Validation

```typescript
import { z } from "zod";
import { commonSchemas } from "./lib/validation";

const customSchema = z.object({
  email: commonSchemas.email,
  age: z.number().int().min(18).max(120),
  preferences: z.array(z.string()).optional(),
});
```

## Rate Limiting

### Pre-configured Rate Limiters

```typescript
import { rateLimiters } from "./middlewares/rate-limit.middleware";

// General API: 100 requests per minute
router.use(rateLimiters.general);

// Authentication: 5 attempts per 15 minutes
router.post("/auth/login", rateLimiters.auth, handler);

// File uploads: 10 uploads per hour
router.post("/upload", rateLimiters.upload, handler);

// Password reset: 3 attempts per hour
router.post("/auth/forgot-password", rateLimiters.passwordReset, handler);
```

### Custom Rate Limiting

```typescript
import { rateLimit, createUserRateLimit } from "./middlewares/rate-limit.middleware";

// Custom rate limit
const customLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 50,
  message: "Custom rate limit message"
});

// User-specific rate limit (requires authentication)
const userLimit = createUserRateLimit(1000, 60 * 60 * 1000); // 1000 req/hour per user
```

## File Validation

```typescript
import { validateFile } from "./middlewares/validation.middleware";

router.post("/upload/resume",
  validateFile("resume", {
    required: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ["application/pdf"],
    maxCount: 1
  }),
  handler
);
```

## Security Features

### Automatic Security Headers

The system automatically adds security headers to all responses:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: ...`
- `Strict-Transport-Security: ...` (production only)

### CORS Configuration

```typescript
// Configured in app.ts
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
```

## Request Logging

All requests are automatically logged with:

- HTTP method and URL
- Response status code and duration
- Client IP and User-Agent
- User ID (if authenticated)
- Request/response timestamps

## Usage Examples

### Complete Route Example

```typescript
import { Router } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import { validateRequest } from "../middlewares/validation.middleware";
import { rateLimiters } from "../middlewares/rate-limit.middleware";
import { schemas } from "../lib/validation";

const router = Router();

router.post("/applications",
  // Rate limiting
  rateLimiters.general,
  
  // Validation
  validateRequest({
    body: schemas.application.create,
    headers: z.object({
      authorization: z.string().optional()
    })
  }),
  
  // Handler with error handling
  asyncHandler(async (req, res) => {
    const applicationData = req.body; // Fully validated and typed
    
    // Business logic
    const application = await createApplication(applicationData);
    
    // Success response
    res.status(201).json({
      success: true,
      data: { application },
      message: "Application created successfully"
    });
  })
);
```

### Error Handling Example

```typescript
router.get("/users/:id", 
  validateParams(z.object({ id: z.string().uuid() })),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    
    // Check permissions
    if (!canAccessUser(req.user, user)) {
      throw new AuthorizationError("Cannot access this user");
    }
    
    res.json({
      success: true,
      data: { user }
    });
  })
);
```

## Testing the System

Use the example routes to test validation and error handling:

```bash
# Test validation error
curl -X POST http://localhost:3000/api/example/users \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'

# Test not found error
curl http://localhost:3000/api/example/error-demo/not-found

# Test rate limiting
for i in {1..101}; do
  curl http://localhost:3000/api/example/users
done
```

## Best Practices

1. **Always use `asyncHandler`** for async route handlers
2. **Validate all inputs** using Zod schemas
3. **Use specific error classes** instead of generic Error
4. **Apply appropriate rate limiting** to all endpoints
5. **Log errors with context** for debugging
6. **Return consistent response format** for all endpoints
7. **Use TypeScript types** inferred from Zod schemas
8. **Test error scenarios** in addition to happy paths

## Environment Configuration

Ensure these environment variables are set:

```env
NODE_ENV=development|production
CORS_ORIGIN=http://localhost:3000
REDIS_URL=redis://localhost:6379
```

## Monitoring and Alerts

The system logs all errors and rate limit violations. In production, set up monitoring for:

- High error rates
- Rate limit violations
- Authentication failures
- File upload failures
- Database connection issues

This comprehensive system ensures robust, secure, and maintainable API endpoints with excellent developer experience through TypeScript integration and clear error messages.