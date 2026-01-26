# OTP-Based Password Reset System

## Overview

This document describes the secure OTP-based password reset system implemented for the UIMP backend. The system provides a complete password reset flow using 6-digit numeric OTPs with comprehensive security measures.

## Architecture

### Components

1. **OTP Service** (`src/services/otp.service.ts`)
   - Generates cryptographically secure OTPs
   - Manages OTP storage and expiration in Redis
   - Implements brute-force protection
   - Handles single-use validation

2. **Password Reset Service** (`src/services/password-reset.service.ts`)
   - Orchestrates the complete password reset flow
   - Handles email override for development/testing
   - Integrates with user management and email services

3. **Auth Controller** (`src/api/auth/auth.controller.ts`)
   - Provides HTTP endpoints for password reset operations
   - Handles request validation and response formatting

4. **Validation Schemas** (`src/lib/validation.ts`)
   - Zod schemas for input validation
   - TypeScript type definitions

## API Endpoints

### 1. Initiate Password Reset
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If the email exists, an OTP has been sent for password reset"
}
```

**Security Features:**
- Always returns success to prevent email enumeration
- Rate limited: 3 requests per hour per email
- Validates user exists and is active

### 2. Verify OTP (Optional)
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Security Features:**
- Rate limited: 10 attempts per 15 minutes per email
- Validates OTP format (6 digits)
- Implements attempt tracking

### 3. Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Security Features:**
- Rate limited: 5 attempts per 15 minutes per email
- Validates password strength
- Single-use OTP (deleted after successful verification)
- Updates password hash with bcrypt

## Security Implementation

### OTP Security
- **Generation**: Cryptographically secure using `crypto.randomInt()`
- **Format**: 6-digit numeric (100000-999999)
- **Storage**: Redis with TTL (not in database)
- **Expiration**: 10 minutes
- **Single-use**: Deleted immediately after successful verification

### Redis Key Strategy
```
password_reset:{userId}          # OTP data with metadata
password_reset_attempts:{email}  # Attempt tracking for rate limiting
```

### Brute-Force Protection
- **Per-OTP Attempts**: Maximum 5 attempts per OTP
- **Global Attempts**: Maximum 5 attempts per 15 minutes per email
- **Automatic Cleanup**: Failed OTPs deleted after max attempts
- **Rate Limiting**: Multiple layers of protection

### Email Override for Development
```typescript
// Environment-based email routing
const shouldOverride = env.NODE_ENV !== "production" && env.OTP_TEST_EMAIL;
const recipient = shouldOverride ? env.OTP_TEST_EMAIL : userEmail;
```

**Benefits:**
- Safe testing without sending emails to real users
- User email still used for validation and database operations
- Clear indication in email when override is active
- Easy to disable by removing `OTP_TEST_EMAIL` environment variable

## Environment Configuration

### Required Variables
```bash
# Redis (required for OTP storage)
REDIS_URL="rediss://your-redis-url"

# Email (required for OTP delivery)
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@yourapp.com"
SMTP_FROM_NAME="Your App"

# OTP Testing (optional - for development only)
OTP_TEST_EMAIL="test@example.com"
NODE_ENV="development"
```

### Production vs Development Behavior

| Environment | Email Recipient | OTP Validation | Password Reset |
|-------------|----------------|----------------|----------------|
| Production  | User's email   | User's email   | User's account |
| Development | `OTP_TEST_EMAIL` | User's email | User's account |

## Usage Examples

### Frontend Integration
```typescript
// 1. Initiate password reset
const forgotPassword = async (email: string) => {
  const response = await fetch('/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};

// 2. Verify OTP (optional step)
const verifyOtp = async (email: string, otp: string) => {
  const response = await fetch('/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  return response.json();
};

// 3. Reset password
const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const response = await fetch('/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword })
  });
  return response.json();
};
```

### Testing the Flow
```bash
# Run the test script
npm run test:otp

# Or directly with tsx
tsx src/scripts/test-otp-flow.ts
```

## Error Handling

### Common Error Responses

**Invalid Email Format:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```

**Invalid OTP:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_OTP",
    "message": "Invalid OTP"
  }
}
```

**OTP Expired:**
```json
{
  "success": false,
  "error": {
    "code": "OTP_EXPIRED",
    "message": "OTP expired or not found"
  }
}
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many failed attempts. Please try again later."
  }
}
```

**Too Many OTP Attempts:**
```json
{
  "success": false,
  "error": {
    "code": "OTP_ATTEMPTS_EXCEEDED",
    "message": "Too many OTP attempts. Please request a new OTP."
  }
}
```

## Monitoring and Logging

### Key Log Events
- OTP generation and expiration
- OTP verification attempts (success/failure)
- Password reset completions
- Rate limiting triggers
- Email override usage
- Service errors and failures

### Metrics to Monitor
- OTP generation rate
- OTP success/failure rates
- Password reset completion rate
- Email delivery success rate
- Rate limiting effectiveness
- Redis performance and availability

## Security Considerations

### Best Practices Implemented
✅ Cryptographically secure OTP generation  
✅ Short OTP expiration (10 minutes)  
✅ Single-use OTPs  
✅ Brute-force protection  
✅ Rate limiting at multiple levels  
✅ Email enumeration prevention  
✅ Secure password hashing (bcrypt)  
✅ Input validation with Zod  
✅ Comprehensive error handling  
✅ Audit logging  

### Additional Security Measures
- OTPs stored in Redis (not database) for automatic expiration
- No OTP values in application logs
- Email override clearly indicated and environment-controlled
- Failed attempts tracked and limited
- User account validation before OTP generation

## Deployment Notes

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Remove or unset `OTP_TEST_EMAIL`
- [ ] Configure production SMTP settings
- [ ] Ensure Redis is properly configured and secured
- [ ] Set up monitoring for OTP-related metrics
- [ ] Test email delivery in production environment
- [ ] Verify rate limiting is working correctly

### Removing Test Behavior
To safely remove the development email override:

1. **Environment Variables:**
   ```bash
   # Remove or comment out
   # OTP_TEST_EMAIL=test@example.com
   
   # Set production environment
   NODE_ENV=production
   ```

2. **Code Changes (if needed):**
   The email override logic is contained in `getEmailRecipient()` method in `PasswordResetService`. The logic automatically disables in production, but you can remove it entirely if desired.

### Scaling Considerations
- Redis connection pooling for high traffic
- Email service rate limiting and queuing
- OTP cleanup job for expired entries (optional - Redis TTL handles this)
- Monitoring and alerting for service health

## Troubleshooting

### Common Issues

**OTPs not being sent:**
- Check email service configuration
- Verify SMTP credentials
- Check email service logs
- Ensure user exists and is active

**OTPs not working:**
- Verify Redis connection
- Check OTP expiration (10 minutes)
- Ensure OTP hasn't been used already
- Check for rate limiting

**Email override not working:**
- Verify `NODE_ENV` is not "production"
- Ensure `OTP_TEST_EMAIL` is set
- Check email service logs

**Rate limiting issues:**
- Check Redis for attempt counters
- Verify rate limiting configuration
- Clear rate limit keys if needed: `password_reset_attempts:{email}`

### Debug Commands
```bash
# Check Redis keys
redis-cli KEYS "password_reset:*"
redis-cli KEYS "password_reset_attempts:*"

# Check OTP data
redis-cli GET "password_reset:{userId}"

# Clear rate limiting for testing
redis-cli DEL "password_reset_attempts:{email}"
```

## Future Enhancements

### Potential Improvements
- SMS OTP as alternative to email
- Configurable OTP length and expiration
- OTP attempt lockout escalation
- Enhanced email templates with branding
- Multi-language email support
- OTP analytics and reporting
- Integration with external email services (SendGrid, AWS SES)
- Push notification OTP delivery

### Security Enhancements
- Device fingerprinting for additional security
- Geolocation-based OTP validation
- Integration with fraud detection services
- Enhanced audit logging with more context
- Automated security incident response