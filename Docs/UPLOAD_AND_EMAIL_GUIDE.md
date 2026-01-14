# File Upload & Email Notification Guide

## Overview

This guide covers the file upload system (S3/Azure Blob/Local) and email notification service implementation.

## Features

### File Upload System
- ✅ Multiple storage providers (AWS S3, Azure Blob, Local)
- ✅ Resume uploads (PDF, DOC, DOCX)
- ✅ Profile image uploads (JPEG, PNG, WebP)
- ✅ Document uploads (PDF, DOC, DOCX, XLS, XLSX, TXT)
- ✅ Multiple file uploads
- ✅ File validation (type, size, name)
- ✅ Signed URLs for secure access
- ✅ File deletion
- ✅ Rate limiting

### Email Notification System
- ✅ Welcome emails
- ✅ Password reset emails
- ✅ Feedback notifications
- ✅ Application status updates
- ✅ Mentor assignment notifications
- ✅ HTML and plain text templates
- ✅ SMTP configuration
- ✅ Graceful degradation

## Storage Configuration

### AWS S3 Setup

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

2. **Configure IAM User**
   Create IAM user with policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:ListBucket"
         ],
         "Resource": [
           "arn:aws:s3:::your-bucket-name/*",
           "arn:aws:s3:::your-bucket-name"
         ]
       }
     ]
   }
   ```

3. **Environment Variables**
   ```env
   STORAGE_PROVIDER=s3
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

### Azure Blob Storage Setup

1. **Create Storage Account**
   ```bash
   az storage account create \
     --name yourstorageaccount \
     --resource-group your-resource-group \
     --location eastus \
     --sku Standard_LRS
   ```

2. **Create Container**
   ```bash
   az storage container create \
     --name uploads \
     --account-name yourstorageaccount
   ```

3. **Get Access Keys**
   ```bash
   az storage account keys list \
     --account-name yourstorageaccount \
     --resource-group your-resource-group
   ```

4. **Environment Variables**
   ```env
   STORAGE_PROVIDER=azure
   AZURE_STORAGE_ACCOUNT_NAME=yourstorageaccount
   AZURE_STORAGE_ACCOUNT_KEY=your_access_key
   AZURE_STORAGE_CONTAINER=uploads
   ```

### Local Storage Setup

1. **Environment Variables**
   ```env
   STORAGE_PROVIDER=local
   LOCAL_UPLOAD_DIR=./uploads
   ```

2. **Create Upload Directory**
   ```bash
   mkdir -p uploads
   ```

## Email Configuration

### SMTP Setup

#### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Note:** Use App Password, not regular password. Enable 2FA and generate app password.

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

#### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
SMTP_FROM=verified@yourdomain.com
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASS=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

## API Endpoints

### Upload Endpoints

#### 1. Upload Resume
```http
POST /api/upload/resume
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- resume: <file> (PDF, DOC, DOCX, max 5MB)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "url": "https://bucket.s3.region.amazonaws.com/resumes/user-id/timestamp-random.pdf",
      "key": "resumes/user-id/timestamp-random.pdf",
      "size": 1024000,
      "mimeType": "application/pdf",
      "originalName": "resume.pdf"
    }
  },
  "message": "Resume uploaded successfully"
}
```

#### 2. Upload Profile Image
```http
POST /api/upload/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: <file> (JPEG, PNG, WebP, max 2MB)
```

#### 3. Upload Document
```http
POST /api/upload/document
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- document: <file> (PDF, DOC, DOCX, XLS, XLSX, TXT, max 10MB)
```

#### 4. Upload Multiple Documents
```http
POST /api/upload/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- documents: <file[]> (max 5 files, 10MB each)
```

#### 5. Delete File
```http
DELETE /api/upload/:key
Authorization: Bearer <token>
```

#### 6. Get Signed URL
```http
GET /api/upload/signed-url/:key?expiresIn=3600
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://bucket.s3.region.amazonaws.com/file.pdf?signature=...",
    "expiresIn": 3600
  }
}
```

## Usage Examples

### Frontend - Upload Resume

```typescript
const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch('/api/upload/resume', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data.data.file;
};
```

### Frontend - Upload with Progress

```typescript
const uploadWithProgress = async (file: File, onProgress: (percent: number) => void) => {
  const formData = new FormData();
  formData.append('resume', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));

    xhr.open('POST', '/api/upload/resume');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};
```

### Backend - Send Email

```typescript
import { emailService } from './lib/email';

// Send welcome email
await emailService.sendWelcomeEmail(
  'user@example.com',
  'John Doe'
);

// Send feedback notification
await emailService.sendFeedbackNotification(
  'student@example.com',
  'John Student',
  'Jane Mentor',
  'Tech Corp',
  'Great application! Your resume looks professional...'
);

// Send custom email
await emailService.send({
  to: 'user@example.com',
  subject: 'Custom Subject',
  html: '<h1>Hello</h1><p>Custom content</p>',
  text: 'Hello\n\nCustom content'
});
```

## File Validation

### Allowed File Types

**Resume:**
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document

**Image:**
- image/jpeg
- image/png
- image/webp
- image/gif

**Document:**
- application/pdf
- application/msword
- application/vnd.openxmlformats-officedocument.wordprocessingml.document
- application/vnd.ms-excel
- application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- text/plain

### File Size Limits

- Resume: 5MB
- Image: 2MB
- Document: 10MB
- Multiple Documents: 10MB each, max 5 files

### Validation Helpers

```typescript
import { FileValidation } from './lib/storage';

// Check file size
const isValidSize = FileValidation.isValidFileSize(fileSize, 5); // 5MB

// Check file type
const isValidType = FileValidation.isValidFileType(
  'application/pdf',
  FileValidation.getAllowedMimeTypes('resume')
);

// Check filename
const isValidName = FileValidation.isValidFileName('resume.pdf');
```

## Error Handling

### Upload Errors

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds the maximum limit"
  }
}
```

**Error Codes:**
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_FILE_TYPE` - File type not allowed
- `TOO_MANY_FILES` - Too many files uploaded
- `UNEXPECTED_FILE` - Unexpected file field
- `UPLOAD_ERROR` - General upload error

### Email Errors

Emails fail gracefully - errors are logged but don't fail the request.

```typescript
const sent = await emailService.send(options);
if (!sent) {
  logger.warn('Email failed to send, but operation continued');
}
```

## Security Best Practices

### File Upload Security

1. **Validate File Types**
   - Check MIME type
   - Verify file extension
   - Scan for malware (if needed)

2. **Limit File Sizes**
   - Prevent DoS attacks
   - Manage storage costs

3. **Sanitize Filenames**
   - Remove path traversal characters
   - Generate unique filenames

4. **Rate Limiting**
   - Limit uploads per user
   - Prevent abuse

5. **Access Control**
   - Verify user ownership
   - Use signed URLs for access

### Email Security

1. **Prevent Email Injection**
   - Validate email addresses
   - Sanitize content

2. **Rate Limiting**
   - Limit emails per user
   - Prevent spam

3. **Content Security**
   - Escape HTML content
   - Use templates

4. **Authentication**
   - Use app passwords
   - Enable 2FA

## Testing

### Test Upload Endpoint

```bash
# Upload resume
curl -X POST http://localhost:3001/api/upload/resume \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf"

# Upload profile image
curl -X POST http://localhost:3001/api/upload/profile-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/photo.jpg"

# Delete file
curl -X DELETE http://localhost:3001/api/upload/resumes/user-id/file.pdf \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get signed URL
curl -X GET "http://localhost:3001/api/upload/signed-url/resumes/user-id/file.pdf?expiresIn=3600" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Email Service

```typescript
import { emailService } from './lib/email';

// Test email configuration
console.log('Email configured:', emailService.isConfigured());

// Send test email
await emailService.send({
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email',
  html: '<p>This is a test email</p>'
});
```

## Monitoring

### Upload Metrics

```typescript
// Log upload statistics
logger.info('File uploaded', {
  userId: user.id,
  filename: file.originalname,
  size: file.size,
  mimeType: file.mimetype,
  key: result.key,
  provider: env.STORAGE_PROVIDER
});
```

### Email Metrics

```typescript
// Log email statistics
logger.info('Email sent', {
  to: options.to,
  subject: options.subject,
  messageId: info.messageId,
  provider: env.SMTP_HOST
});
```

## Troubleshooting

### Upload Issues

**Problem:** Upload fails with 413 error
**Solution:** Increase body parser limit in app.ts

**Problem:** S3 access denied
**Solution:** Check IAM permissions and bucket policy

**Problem:** Azure blob not found
**Solution:** Verify container exists and credentials are correct

### Email Issues

**Problem:** Emails not sending
**Solution:** Check SMTP credentials and firewall settings

**Problem:** Gmail blocking login
**Solution:** Use App Password instead of regular password

**Problem:** Emails going to spam
**Solution:** Configure SPF, DKIM, and DMARC records

## Production Considerations

### Storage

1. **Use CDN** - CloudFront (S3) or Azure CDN
2. **Enable Versioning** - For file recovery
3. **Set Lifecycle Policies** - Auto-delete old files
4. **Enable Encryption** - At rest and in transit
5. **Monitor Costs** - Set up billing alerts

### Email

1. **Use Dedicated Service** - SendGrid, Mailgun, AWS SES
2. **Verify Domain** - SPF, DKIM, DMARC
3. **Monitor Deliverability** - Track bounces and complaints
4. **Implement Queue** - For high-volume sending
5. **Handle Failures** - Retry logic and dead letter queue

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
