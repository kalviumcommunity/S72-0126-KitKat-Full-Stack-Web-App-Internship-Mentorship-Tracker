# Entity Relationships - UIMP Database Schema

## Visual Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                           USER                                   │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID) PK                                                    │
│ email (String, Unique)                                          │
│ passwordHash (String)                                           │
│ role (Enum: STUDENT | MENTOR | ADMIN)                          │
│ firstName, lastName (Optional)                                  │
│ profileImageUrl (Optional)                                       │
│ isActive (Boolean)                                              │
│ createdAt, updatedAt, lastLoginAt                               │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
         │ (1:N)              │ (1:N)              │ (1:N)
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   APPLICATION    │  │     FEEDBACK      │  │   NOTIFICATION    │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ id (UUID) PK     │  │ id (UUID) PK     │  │ id (UUID) PK     │
│ userId (FK)      │◄─│ applicationId FK│  │ userId (FK)      │
│ company          │  │ mentorId (FK)     │  │ type (Enum)      │
│ role             │  │ content (Text)    │  │ title            │
│ platform (Enum)  │  │ tags (Array)     │  │ message (Text)   │
│ status (Enum)    │  │ priority (Enum)  │  │ read (Boolean)   │
│ resumeUrl        │  │ createdAt        │  │ expiresAt        │
│ notes (Text)     │  │ updatedAt        │  │ createdAt        │
│ deadline         │  └──────────────────┘  └──────────────────┘
│ appliedDate      │
│ createdAt        │
│ updatedAt        │
└──────────────────┘
         │
         │ (1:N)
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MENTOR_ASSIGNMENT                             │
├─────────────────────────────────────────────────────────────────┤
│ id (UUID) PK                                                     │
│ mentorId (FK → User)                                             │
│ studentId (FK → User)                                            │
│ isActive (Boolean)                                               │
│ assignedAt, createdAt, updatedAt                               │
│ UNIQUE(mentorId, studentId)                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Relationship Details

### 1. User → Application (One-to-Many)
- **Relationship**: One user can have many applications
- **Foreign Key**: `Application.userId` → `User.id`
- **Cascade**: ON DELETE CASCADE
- **Business Rule**: Only STUDENT role users create applications
- **Index**: `userId` indexed for fast lookups

### 2. User → Feedback (One-to-Many as Mentor)
- **Relationship**: One mentor can provide many feedback entries
- **Foreign Key**: `Feedback.mentorId` → `User.id`
- **Cascade**: ON DELETE CASCADE
- **Business Rule**: Only MENTOR role users create feedback
- **Index**: `mentorId` indexed for fast lookups

### 3. Application → Feedback (One-to-Many)
- **Relationship**: One application can have many feedback entries
- **Foreign Key**: `Feedback.applicationId` → `Application.id`
- **Cascade**: ON DELETE CASCADE
- **Business Rule**: Feedback is always tied to a specific application
- **Index**: `applicationId` indexed for fast lookups

### 4. User → Notification (One-to-Many)
- **Relationship**: One user can have many notifications
- **Foreign Key**: `Notification.userId` → `User.id`
- **Cascade**: ON DELETE CASCADE
- **Business Rule**: Notifications are user-specific
- **Index**: `userId` indexed for fast lookups

### 5. User → MentorAssignment (Many-to-Many via Junction Table)
- **Relationship**: Many mentors can be assigned to many students
- **Foreign Keys**: 
  - `MentorAssignment.mentorId` → `User.id`
  - `MentorAssignment.studentId` → `User.id`
- **Cascade**: ON DELETE CASCADE for both relationships
- **Constraint**: UNIQUE(mentorId, studentId) prevents duplicate assignments
- **Business Rule**: 
  - Only MENTOR role users can be mentors
  - Only STUDENT role users can be students
  - Only ADMIN can create/update assignments
- **Indexes**: Both `mentorId` and `studentId` indexed

## Access Patterns

### Student View
```
Student → Applications → Feedback (from assigned mentors)
Student → Notifications
Student → MentorAssignments (to see assigned mentors)
```

### Mentor View
```
Mentor → MentorAssignments (to see assigned students)
Mentor → Applications (of assigned students)
Mentor → Feedback (given to assigned students)
```

### Admin View
```
Admin → All Users
Admin → All Applications
Admin → All Feedback
Admin → All Notifications
Admin → All MentorAssignments (can create/update)
```

## Query Examples

### Get student's applications with feedback
```prisma
const applications = await prisma.application.findMany({
  where: { userId: studentId },
  include: {
    feedback: {
      include: {
        mentor: {
          select: { id: true, email: true, firstName: true, lastName: true }
        }
      }
    }
  }
});
```

### Get mentor's assigned students
```prisma
const assignments = await prisma.mentorAssignment.findMany({
  where: { 
    mentorId: mentorId,
    isActive: true 
  },
  include: {
    student: {
      select: { id: true, email: true, firstName: true, lastName: true }
    }
  }
});
```

### Get applications for mentor's students
```prisma
const studentIds = await prisma.mentorAssignment.findMany({
  where: { mentorId: mentorId, isActive: true },
  select: { studentId: true }
}).then(assignments => assignments.map(a => a.studentId));

const applications = await prisma.application.findMany({
  where: { userId: { in: studentIds } },
  include: {
    user: {
      select: { id: true, email: true, firstName: true, lastName: true }
    },
    feedback: true
  }
});
```

### Get unread notifications for user
```prisma
const notifications = await prisma.notification.findMany({
  where: { 
    userId: userId,
    read: false 
  },
  orderBy: { createdAt: 'desc' }
});
```

## Data Integrity Rules

1. **Cascade Deletes**: 
   - Deleting a user deletes all their applications, feedback (as mentor), notifications, and assignments
   - Deleting an application deletes all related feedback

2. **Unique Constraints**:
   - Email must be unique
   - MentorAssignment (mentorId, studentId) must be unique

3. **Referential Integrity**:
   - All foreign keys must reference existing records
   - Foreign key constraints prevent orphaned records

4. **Business Logic Constraints** (enforced at application level):
   - Only STUDENT role can create applications
   - Only MENTOR role can create feedback
   - Mentors can only provide feedback on assigned students' applications
   - Students can only see feedback on their own applications

---

**Last Updated**: 2024-01-15  
**Maintained By**: Backend Team (Heramb)

