# Prisma Schema Documentation - UIMP

This document describes the database schema design for the Unified Internship & Mentorship Portal (UIMP).

## Overview

The schema consists of 5 main entities:
1. **User** - System users (Students, Mentors, Admins)
2. **Application** - Internship applications
3. **Feedback** - Mentor feedback on applications
4. **Notification** - User notifications
5. **MentorAssignment** - Mentor-Student relationships

---

## Entity Relationships

```
User (1) ──< (N) Application
User (1) ──< (N) Feedback (as mentor)
User (1) ──< (N) Notification
User (1) ──< (N) MentorAssignment (as mentor)
User (1) ──< (N) MentorAssignment (as student)

Application (1) ──< (N) Feedback
```

---

## Entity Details

### User

**Purpose**: Stores all system users (Students, Mentors, Admins)

**Fields**:
- `id` (UUID, PK): Unique identifier
- `email` (String, Unique): User email address
- `passwordHash` (String): Bcrypt hashed password
- `role` (Enum): STUDENT | MENTOR | ADMIN
- `firstName` (String, Optional): User's first name
- `lastName` (String, Optional): User's last name
- `profileImageUrl` (String, Optional): Profile picture URL
- `isActive` (Boolean): Account active status
- `createdAt` (DateTime): Account creation timestamp
- `updatedAt` (DateTime): Last update timestamp
- `lastLoginAt` (DateTime, Optional): Last login timestamp

**Relations**:
- `applications`: Applications created by this user (if STUDENT)
- `feedbackGiven`: Feedback provided by this user (if MENTOR)
- `notifications`: Notifications for this user
- `mentorAssignments`: Mentor assignments where user is mentor
- `studentAssignments`: Mentor assignments where user is student

**Indexes**:
- `email` (unique index)
- `role` (index for role-based queries)

---

### Application

**Purpose**: Stores internship applications created by students

**Fields**:
- `id` (UUID, PK): Unique identifier
- `userId` (UUID, FK → User): Student who created the application
- `company` (String): Company name
- `role` (String): Position/role title
- `platform` (Enum): Application platform (LINKEDIN, COMPANY_WEBSITE, etc.)
- `status` (Enum): Application status (DRAFT, APPLIED, SHORTLISTED, etc.)
- `resumeUrl` (String, Optional): URL to uploaded resume
- `notes` (Text, Optional): Additional notes
- `deadline` (DateTime, Optional): Application deadline
- `appliedDate` (DateTime, Optional): Date when application was submitted
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations**:
- `user`: Student who owns this application
- `feedback`: Feedback entries for this application

**Indexes**:
- `userId` (index for user's applications)
- `status` (index for status filtering)
- `company` (index for company search)
- `createdAt` (index for sorting)

**Status Pipeline**:
```
DRAFT → APPLIED → SHORTLISTED → INTERVIEW → OFFER | REJECTED
```

---

### Feedback

**Purpose**: Stores mentor feedback on student applications

**Fields**:
- `id` (UUID, PK): Unique identifier
- `applicationId` (UUID, FK → Application): Application being reviewed
- `mentorId` (UUID, FK → User): Mentor providing feedback
- `content` (Text): Feedback text content
- `tags` (Array<Enum>): Skill tags (RESUME, DSA, SYSTEM_DESIGN, COMMUNICATION)
- `priority` (Enum): Priority level (LOW, MEDIUM, HIGH)
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations**:
- `application`: Application this feedback is for
- `mentor`: Mentor who provided the feedback

**Indexes**:
- `applicationId` (index for application's feedback)
- `mentorId` (index for mentor's feedback)
- `createdAt` (index for sorting)

**Business Rules**:
- Only mentors can create feedback
- Mentors can only provide feedback on applications of their assigned students
- Feedback can be updated/deleted only by the mentor who created it

---

### Notification

**Purpose**: Stores in-app notifications for users

**Fields**:
- `id` (UUID, PK): Unique identifier
- `userId` (UUID, FK → User): User receiving the notification
- `type` (Enum): Notification type (FEEDBACK_RECEIVED, APPLICATION_STATUS_CHANGED, etc.)
- `title` (String): Notification title
- `message` (Text): Notification message
- `read` (Boolean): Read status
- `expiresAt` (DateTime, Optional): Expiration timestamp
- `createdAt` (DateTime): Creation timestamp

**Relations**:
- `user`: User who receives this notification

**Indexes**:
- `userId` (index for user's notifications)
- `read` (index for unread notifications)
- `createdAt` (index for sorting)

**Notification Types**:
- `FEEDBACK_RECEIVED`: New feedback from mentor
- `APPLICATION_STATUS_CHANGED`: Application status updated
- `MENTOR_ASSIGNED`: Mentor assigned to student
- `SYSTEM_ANNOUNCEMENT`: System-wide announcements

---

### MentorAssignment

**Purpose**: Manages mentor-student relationships

**Fields**:
- `id` (UUID, PK): Unique identifier
- `mentorId` (UUID, FK → User): Mentor user
- `studentId` (UUID, FK → User): Student user
- `isActive` (Boolean): Assignment active status
- `assignedAt` (DateTime): Assignment timestamp
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Relations**:
- `mentor`: Mentor user
- `student`: Student user

**Indexes**:
- `mentorId` (index for mentor's students)
- `studentId` (index for student's mentors)
- `isActive` (index for active assignments)

**Constraints**:
- Unique constraint on `(mentorId, studentId)` to prevent duplicate assignments

**Business Rules**:
- Only ADMIN can create/update assignments
- A mentor can be assigned to multiple students
- A student can have multiple mentors
- Assignments can be deactivated without deletion

---

## Enums

### UserRole
- `STUDENT`: Student user
- `MENTOR`: Mentor user
- `ADMIN`: Administrator user

### ApplicationStatus
- `DRAFT`: Application not yet submitted
- `APPLIED`: Application submitted
- `SHORTLISTED`: Application shortlisted
- `INTERVIEW`: Interview scheduled/in progress
- `OFFER`: Offer received
- `REJECTED`: Application rejected

### ApplicationPlatform
- `LINKEDIN`: LinkedIn job posting
- `COMPANY_WEBSITE`: Company career page
- `REFERRAL`: Employee referral
- `JOB_BOARD`: Job board (Indeed, Glassdoor, etc.)
- `CAREER_FAIR`: Career fair
- `OTHER`: Other platform

### FeedbackTag
- `RESUME`: Resume-related feedback
- `DSA`: Data Structures & Algorithms
- `SYSTEM_DESIGN`: System design feedback
- `COMMUNICATION`: Communication skills

### FeedbackPriority
- `LOW`: Low priority feedback
- `MEDIUM`: Medium priority feedback
- `HIGH`: High priority feedback

### NotificationType
- `FEEDBACK_RECEIVED`: New feedback notification
- `APPLICATION_STATUS_CHANGED`: Status change notification
- `MENTOR_ASSIGNED`: Mentor assignment notification
- `SYSTEM_ANNOUNCEMENT`: System announcement

---

## Database Migrations

### Initial Migration
```bash
npx prisma migrate dev --name init
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Seed Database
```bash
npx prisma db seed
```

---

## Data Integrity

### Cascading Deletes
- Deleting a User cascades to:
  - All their Applications
  - All their Feedback (as mentor)
  - All their Notifications
  - All their MentorAssignments (as mentor or student)

- Deleting an Application cascades to:
  - All related Feedback

### Constraints
- Email must be unique across all users
- MentorAssignment (mentorId, studentId) must be unique
- Foreign key constraints ensure referential integrity

---

## Performance Considerations

### Indexes
All foreign keys and frequently queried fields are indexed:
- User: email, role
- Application: userId, status, company, createdAt
- Feedback: applicationId, mentorId, createdAt
- Notification: userId, read, createdAt
- MentorAssignment: mentorId, studentId, isActive

### Query Optimization
- Use `include` for eager loading related data
- Use `select` to limit returned fields
- Pagination implemented for list endpoints
- Indexes support common query patterns

---

## Security Considerations

1. **Password Storage**: Passwords are hashed using bcrypt (12 salt rounds)
2. **UUID Primary Keys**: Prevent enumeration attacks
3. **Soft Deletes**: Consider adding `deletedAt` for audit trails (future enhancement)
4. **Data Validation**: All inputs validated at API layer using Zod schemas

---

## Future Enhancements

Potential schema additions:
- `Resume` table for version tracking
- `Interview` table for interview scheduling
- `ActivityLog` table for audit trails
- `Settings` table for user preferences
- `EmailVerification` table for email verification tokens

---

**Last Updated**: 2024-01-15  
**Maintained By**: Backend Team (Heramb)

