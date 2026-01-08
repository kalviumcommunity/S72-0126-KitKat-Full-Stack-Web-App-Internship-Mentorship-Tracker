// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication & Authorization
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  
  // Validation
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_JSON: "INVALID_JSON",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  INVALID_FORMAT: "INVALID_FORMAT",
  
  // Resource Management
  NOT_FOUND: "NOT_FOUND",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  CONFLICT_ERROR: "CONFLICT_ERROR",
  INVALID_REFERENCE: "INVALID_REFERENCE",
  
  // File Upload
  UPLOAD_ERROR: "UPLOAD_ERROR",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
  TOO_MANY_FILES: "TOO_MANY_FILES",
  UNEXPECTED_FILE: "UNEXPECTED_FILE",
  
  // Rate Limiting
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  
  // Business Logic
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  OPERATION_NOT_ALLOWED: "OPERATION_NOT_ALLOWED",
  RESOURCE_LOCKED: "RESOURCE_LOCKED",
  DEADLINE_PASSED: "DEADLINE_PASSED",
  
  // External Services
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
  STORAGE_ERROR: "STORAGE_ERROR",
  
  // System
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  DATABASE_ERROR: "DATABASE_ERROR",
  REDIS_ERROR: "REDIS_ERROR",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication & Authorization
  [ERROR_CODES.AUTHENTICATION_ERROR]: "Authentication required",
  [ERROR_CODES.AUTHORIZATION_ERROR]: "Insufficient permissions",
  [ERROR_CODES.INVALID_TOKEN]: "Invalid authentication token",
  [ERROR_CODES.TOKEN_EXPIRED]: "Authentication token has expired",
  [ERROR_CODES.INVALID_CREDENTIALS]: "Invalid email or password",
  
  // Validation
  [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
  [ERROR_CODES.INVALID_JSON]: "Invalid JSON in request body",
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: "Required field is missing",
  [ERROR_CODES.INVALID_FORMAT]: "Invalid format",
  
  // Resource Management
  [ERROR_CODES.NOT_FOUND]: "Resource not found",
  [ERROR_CODES.DUPLICATE_ENTRY]: "Resource already exists",
  [ERROR_CODES.CONFLICT_ERROR]: "Resource conflict",
  [ERROR_CODES.INVALID_REFERENCE]: "Referenced resource does not exist",
  
  // File Upload
  [ERROR_CODES.UPLOAD_ERROR]: "File upload failed",
  [ERROR_CODES.FILE_TOO_LARGE]: "File size exceeds maximum limit",
  [ERROR_CODES.INVALID_FILE_TYPE]: "Invalid file type",
  [ERROR_CODES.TOO_MANY_FILES]: "Too many files uploaded",
  [ERROR_CODES.UNEXPECTED_FILE]: "Unexpected file field",
  
  // Rate Limiting
  [ERROR_CODES.RATE_LIMIT_ERROR]: "Rate limit exceeded",
  [ERROR_CODES.TOO_MANY_REQUESTS]: "Too many requests, please try again later",
  
  // Business Logic
  [ERROR_CODES.INSUFFICIENT_PERMISSIONS]: "You don't have permission to perform this action",
  [ERROR_CODES.OPERATION_NOT_ALLOWED]: "Operation not allowed",
  [ERROR_CODES.RESOURCE_LOCKED]: "Resource is currently locked",
  [ERROR_CODES.DEADLINE_PASSED]: "Deadline has passed",
  
  // External Services
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: "External service error",
  [ERROR_CODES.EMAIL_SEND_FAILED]: "Failed to send email",
  [ERROR_CODES.STORAGE_ERROR]: "Storage service error",
  
  // System
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An internal server error occurred",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "Service temporarily unavailable",
  [ERROR_CODES.DATABASE_ERROR]: "Database error",
  [ERROR_CODES.REDIS_ERROR]: "Cache service error",
} as const;

// Prisma Error Code Mappings
export const PRISMA_ERROR_CODES = {
  P2002: ERROR_CODES.DUPLICATE_ENTRY,
  P2025: ERROR_CODES.NOT_FOUND,
  P2003: ERROR_CODES.INVALID_REFERENCE,
  P2014: ERROR_CODES.INVALID_REFERENCE,
  P2015: ERROR_CODES.NOT_FOUND,
  P2016: ERROR_CODES.VALIDATION_ERROR,
  P2017: ERROR_CODES.INVALID_REFERENCE,
  P2018: ERROR_CODES.NOT_FOUND,
  P2019: ERROR_CODES.VALIDATION_ERROR,
  P2020: ERROR_CODES.VALIDATION_ERROR,
  P2021: ERROR_CODES.NOT_FOUND,
  P2022: ERROR_CODES.NOT_FOUND,
  P2023: ERROR_CODES.DATABASE_ERROR,
  P2024: ERROR_CODES.DATABASE_ERROR,
  P2026: ERROR_CODES.DATABASE_ERROR,
  P2027: ERROR_CODES.DATABASE_ERROR,
} as const;

// Field-specific error messages
export const FIELD_ERRORS = {
  EMAIL: {
    REQUIRED: "Email is required",
    INVALID: "Please enter a valid email address",
    DUPLICATE: "Email already exists",
  },
  PASSWORD: {
    REQUIRED: "Password is required",
    TOO_SHORT: "Password must be at least 8 characters long",
    WEAK: "Password must contain uppercase, lowercase, number, and special character",
    MISMATCH: "Passwords do not match",
  },
  NAME: {
    REQUIRED: "Name is required",
    TOO_SHORT: "Name must be at least 1 character long",
    TOO_LONG: "Name must be less than 100 characters long",
    INVALID: "Name can only contain letters, spaces, hyphens, and apostrophes",
  },
  COMPANY: {
    REQUIRED: "Company name is required",
    TOO_LONG: "Company name must be less than 255 characters",
  },
  ROLE: {
    REQUIRED: "Role is required",
    TOO_LONG: "Role must be less than 255 characters",
  },
  CONTENT: {
    REQUIRED: "Content is required",
    TOO_LONG: "Content must be less than 2000 characters",
  },
  TAGS: {
    REQUIRED: "At least one tag is required",
    INVALID: "Invalid tag value",
  },
  FILE: {
    REQUIRED: "File is required",
    TOO_LARGE: "File size must be less than 5MB",
    INVALID_TYPE: "Only PDF files are allowed",
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: "User created successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  APPLICATION_CREATED: "Application created successfully",
  APPLICATION_UPDATED: "Application updated successfully",
  APPLICATION_DELETED: "Application deleted successfully",
  FEEDBACK_CREATED: "Feedback created successfully",
  FEEDBACK_UPDATED: "Feedback updated successfully",
  FEEDBACK_DELETED: "Feedback deleted successfully",
  NOTIFICATION_READ: "Notification marked as read",
  NOTIFICATION_DELETED: "Notification deleted successfully",
  FILE_UPLOADED: "File uploaded successfully",
  MENTOR_ASSIGNED: "Mentor assigned successfully",
  MENTOR_UNASSIGNED: "Mentor unassigned successfully",
} as const;