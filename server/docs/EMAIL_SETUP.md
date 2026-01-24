# Mailtrap SMTP Email Setup Guide

This guide explains how to set up Mailtrap Sandbox SMTP for development email testing in your Node.js/Express backend.

## 🚀 Quick Setup

### 1. Get Mailtrap Credentials

1. Go to [Mailtrap.io](https://mailtrap.io) and create a free account
2. Create a new inbox or use the default one
3. Go to your inbox settings and find the SMTP credentials
4. Copy the username and password

### 2. Configure Environment Variables

Copy the email configuration to your `.env` file:

```env
# Mailtrap Sandbox SMTP Configuration
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
SMTP_FROM=noreply@yourapp.com
SMTP_FROM_NAME=Your App Name
```

Replace `your_mailtrap_username` and `your_mailtrap_password` with your actual Mailtrap credentials.

### 3. Test the Setup

Run the test script to verify everything works:

```bash
npm run test:email your-email@example.com
```

Or test via API:

```bash
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment configuration
│   │   └── mail.ts             # Mail transporter configuration
│   ├── services/
│   │   └── mail.service.ts     # Email service with methods
│   ├── api/
│   │   └── email/
│   │       ├── email.controller.ts  # Email API controllers
│   │       └── email.routes.ts      # Email API routes
│   ├── middlewares/
│   │   └── async-handler.middleware.ts  # Async error handler
│   ├── scripts/
│   │   └── test-email.ts       # Standalone email test script
│   └── examples/
│       └── email-usage.ts      # Usage examples
├── docs/
│   └── EMAIL_SETUP.md          # This documentation
├── .env                        # Environment variables
└── .env.email.example          # Email configuration template
```

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | Mailtrap SMTP host | `sandbox.smtp.mailtrap.io` |
| `SMTP_PORT` | SMTP port | `2525` |
| `SMTP_USER` | Your Mailtrap username | `84edce4a76c220` |
| `SMTP_PASS` | Your Mailtrap password | `0e791dfbec6d0a` |
| `SMTP_FROM` | From email address | `noreply@yourapp.com` |
| `SMTP_FROM_NAME` | From display name | `Your App Name` |

### Mail Configuration (`src/config/mail.ts`)

- Creates and configures the Nodemailer transporter
- Validates configuration on startup
- Provides connection verification
- Handles graceful degradation if email is not configured

### Mail Service (`src/services/mail.service.ts`)

Provides methods for:
- `sendEmail()` - Generic email sending
- `sendTestEmail()` - Test email functionality
- `sendWelcomeEmail()` - Welcome new users
- `sendPasswordResetEmail()` - Password reset emails
- `sendNotificationEmail()` - Custom notifications
- `getStatus()` - Service status check

## 📧 API Endpoints

### Test Email
```http
POST /api/email/test
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Email Status
```http
GET /api/email/status
```

### Welcome Email
```http
POST /api/email/welcome
Content-Type: application/json

{
  "email": "user@example.com",
  "userName": "John Doe"
}
```

### Notification Email
```http
POST /api/email/notification
Content-Type: application/json

{
  "email": "user@example.com",
  "subject": "Your Subject",
  "message": "Your message content"
}
```

## 💻 Usage Examples

### Basic Email Sending

```typescript
import { mailService } from '../services/mail.service';

// Send test email
const result = await mailService.sendTestEmail('user@example.com');

if (result.success) {
  console.log('Email sent!', result.messageId);
} else {
  console.error('Email failed:', result.error);
}
```

### Welcome Email

```typescript
await mailService.sendWelcomeEmail('newuser@example.com', 'John Doe');
```

### Custom Email

```typescript
await mailService.sendEmail({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Hello World!</h1>',
  text: 'Hello World!'
});
```

## 🧪 Testing

### Command Line Test

```bash
# Test with specific email
npm run test:email your-email@example.com

# Or run directly with tsx
tsx src/scripts/test-email.ts your-email@example.com
```

### API Testing

```bash
# Test email endpoint
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check email service status
curl http://localhost:3001/api/email/status
```

### Integration in Your Code

```typescript
// In a user registration handler
import { mailService } from '../services/mail.service';

export const registerUser = async (req: Request, res: Response) => {
  // ... user registration logic ...
  
  // Send welcome email
  await mailService.sendWelcomeEmail(user.email, user.name);
  
  res.json({ success: true, user });
};
```

## 🔍 Troubleshooting

### Common Issues

1. **"Email service not configured"**
   - Check that all SMTP environment variables are set
   - Verify credentials are correct

2. **"SMTP connection failed"**
   - Verify Mailtrap credentials
   - Check network connectivity
   - Ensure you're using the correct host and port

3. **"Authentication failed"**
   - Double-check username and password
   - Make sure you're using Sandbox SMTP credentials, not API credentials

### Debug Steps

1. Check email service status:
   ```bash
   curl http://localhost:3001/api/email/status
   ```

2. Run the test script with verbose logging:
   ```bash
   DEBUG=* npm run test:email your-email@example.com
   ```

3. Check server logs for detailed error messages

## 🔒 Security Notes

- Never commit real credentials to version control
- Use environment variables for all sensitive data
- In production, consider using a proper email service provider
- Mailtrap Sandbox is for development only - emails don't reach real recipients

## 📚 Additional Resources

- [Mailtrap Documentation](https://help.mailtrap.io/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)