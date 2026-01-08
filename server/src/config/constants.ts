export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const PASSWORD = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 12,
} as const;

export const JWT = {
  EXPIRES_IN: "24h",
  COOKIE_NAME: "auth-token",
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["application/pdf"],
} as const;

export const RATE_LIMIT = {
  GENERAL: 100, // requests per minute
  AUTH: 5, // requests per 15 minutes
  UPLOAD: 10, // requests per hour
} as const;

