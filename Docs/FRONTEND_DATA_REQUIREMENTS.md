# Frontend Data Requirements Analysis - Day 3

## Overview

This document analyzes the Prisma schema from a frontend perspective, identifying data requirements, API endpoints needed, and frontend-specific considerations for the UIMP application.

## Schema Analysis Summary

### Database Entities Review

✅ **User Entity**
- **Frontend Impact**: Core authentication and profile management
- **Required Fields**: `id`, `email`, `role`, `firstName`, `lastName`
- **Optional Fields**: `profileImageUrl`, `lastLoginAt`
- **Frontend Considerations**: 
  - Profile image upload/display functionality needed
  - Role-based UI rendering (Student/Mentor/Admin views)
  - Last login tracking for user activity

✅ **Application Entity**
- **Frontend Impact**: Primary data model for student workflow
- **Required Fields**: `company`, `role`, `platform`, `status`
- **Optional Fields**: `resumeUrl`, `notes`, `deadline`, `appliedDate`
- **Frontend Considerations**:
  - File upload component for resume
  - Status pipeline visualization
  - Date picker components for deadline/applied date
  - Rich text editor for notes

✅ **Feedback Entity**
- **Frontend Impact**: Mentor-student interaction core
- **Required Fields**: `content`, `tags`, `priority`
- **Array Fields**: `tags` (multiple selection UI needed)
- **Frontend Considerations**:
  - Tag selection component (multi-select)
  - Priority indicator UI
  - Rich text display for feedback content

✅ **Notification Entity**
- **Frontend Impact**: Real-time user communication
- **Required Fields**: `type`, `title`, `message`
- **Boolean Fields**: `read` (unread indicator)
- **Frontend Considerations**:
  - Real-time notification system
  - Notification center/dropdown
  - Mark as read functionality
  - Auto-expiry handling

✅ **MentorAssignment Entity**
- **Frontend Impact**: Relationship management
- **Required Fields**: `mentorId`, `studentId`, `isActive`
- **Frontend Considerations**:
  - Mentor-student relationship display
  - Assignment management (Admin only)
  - Active/inactive status indicators

## Frontend Data Flow Requirements

### 1. Authentication Flow
```typescript
// Login/Signup Data Flow
LoginForm → API → AuthContext → Route Protection → Dashboard
```

**Required API Endpoints**:
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Frontend State Management**:
- User authentication state
- Role-based permissions
- Session management

### 2. Student Dashboard Data Flow
```typescript
// Student Dashboard Data Requirements
StudentDashboard → {
  applications: Application[],
  feedback: FeedbackWithRelations[],
  mentors: User[],
  notifications: Notification[]
}
```

**Required API Endpoints**:
- `GET /api/applications` (user's applications)
- `GET /api/feedback` (feedback on user's applications)
- `GET /api/mentors` (assigned mentors)
- `GET /api/notifications` (user notifications)

### 3. Mentor Dashboard Data Flow
```typescript
// Mentor Dashboard Data Requirements
MentorDashboard → {
  students: User[],
  applications: ApplicationWithUser[],
  feedback: FeedbackWithRelations[],
  notifications: Notification[]
}
```

**Required API Endpoints**:
- `GET /api/students` (assigned students)
- `GET /api/applications/students` (students' applications)
- `GET /api/feedback/given` (feedback given by mentor)

### 4. Application Management Data Flow
```typescript
// Application CRUD Operations
ApplicationForm → {
  create: POST /api/applications,
  read: GET /api/applications/:id,
  update: PUT /api/applications/:id,
  delete: DELETE /api/applications/:id
}
```

**File Upload Requirements**:
- Resume upload: `POST /api/upload/resume`
- File validation and storage
- Progress indicators

## Component Data Requirements

### 1. Dashboard Components

#### StudentDashboard.tsx
```typescript
interface StudentDashboardProps {
  applications: ApplicationWithFeedback[];
  stats: {
    totalApplications: number;
    statusBreakdown: Record<ApplicationStatus, number>;
    feedbackCount: number;
  };
  recentFeedback: FeedbackWithRelations[];
  mentors: User[];
}
```

#### MentorDashboard.tsx
```typescript
interface MentorDashboardProps {
  students: User[];
  applications: ApplicationWithUser[];
  stats: {
    totalStudents: number;
    totalApplications: number;
    feedbackGiven: number;
  };
  recentApplications: ApplicationWithUser[];
}
```

### 2. Form Components

#### ApplicationForm.tsx
```typescript
interface ApplicationFormProps {
  initialData?: Application;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
}

// Form validation requirements:
// - Company name (required, min 2 chars)
// - Role title (required, min 2 chars)
// - Platform selection (required)
// - Status selection (required)
// - Resume file (optional, PDF/DOC, max 5MB)
// - Notes (optional, max 1000 chars)
// - Deadline (optional, future date)
```

#### FeedbackForm.tsx
```typescript
interface FeedbackFormProps {
  applicationId: string;
  onSubmit: (data: FeedbackFormData) => Promise<void>;
  isLoading: boolean;
}

// Form validation requirements:
// - Content (required, min 10 chars, max 2000 chars)
// - Tags (required, at least 1 tag)
// - Priority (required)
```

### 3. Display Components

#### ApplicationCard.tsx
```typescript
interface ApplicationCardProps {
  application: ApplicationWithFeedback;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewFeedback?: () => void;
}
```

#### FeedbackCard.tsx
```typescript
interface FeedbackCardProps {
  feedback: FeedbackWithRelations;
  showApplication?: boolean;
  showMentor?: boolean;
}
```

## API Integration Requirements

### 1. Data Fetching Strategy
- **Server Components**: Use direct database queries for initial page loads
- **Client Components**: Use React Query/SWR for data fetching and caching
- **Real-time Updates**: WebSocket connection for notifications

### 2. Error Handling
```typescript
interface ApiError {
  message: string;
  code: string;
  field?: string; // For validation errors
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
```

### 3. Loading States
- Skeleton loaders for dashboard components
- Spinner for form submissions
- Progressive loading for large lists

## Validation Requirements

### 1. Client-Side Validation (Zod Schemas)
```typescript
// Application validation
const applicationSchema = z.object({
  company: z.string().min(2, "Company name required"),
  role: z.string().min(2, "Role title required"),
  platform: z.nativeEnum(ApplicationPlatform),
  status: z.nativeEnum(ApplicationStatus),
  notes: z.string().max(1000).optional(),
  deadline: z.string().datetime().optional(),
  appliedDate: z.string().datetime().optional()
});

// Feedback validation
const feedbackSchema = z.object({
  content: z.string().min(10).max(2000),
  tags: z.array(z.nativeEnum(FeedbackTag)).min(1),
  priority: z.nativeEnum(FeedbackPriority)
});
```

### 2. File Upload Validation
```typescript
const resumeUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, "File must be less than 5MB")
    .refine(file => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type), "Only PDF and DOC files allowed")
});
```

## Performance Considerations

### 1. Data Pagination
- Applications list: 20 items per page
- Feedback list: 15 items per page
- Notifications: 50 items per page

### 2. Caching Strategy
- User profile: Cache for 1 hour
- Applications: Cache for 5 minutes
- Feedback: Cache for 2 minutes
- Notifications: Real-time, no cache

### 3. Optimistic Updates
- Application status changes
- Feedback submissions
- Notification read status

## Security Considerations

### 1. Data Access Control
- Students: Only their own applications and feedback
- Mentors: Only assigned students' data
- Admins: Full access with audit logging

### 2. Input Sanitization
- All text inputs sanitized for XSS
- File uploads scanned for malware
- SQL injection prevention (handled by Prisma)

### 3. Authentication
- JWT tokens with HttpOnly cookies
- Role-based route protection
- Session timeout handling

## Missing Schema Considerations

### Potential Additions Needed:
1. **User Preferences**: Theme, notification settings
2. **Activity Logs**: User action tracking
3. **File Metadata**: Resume version tracking
4. **Email Templates**: Notification email content
5. **System Settings**: Application-wide configurations

### Recommendations:
- Add `preferences` JSON field to User model
- Consider `ActivityLog` table for audit trails
- Add `version` field to resume tracking
- Implement soft deletes with `deletedAt` timestamps

## Implementation Priority

### Phase 1 (Day 4-5): Core Data Flow
1. ✅ TypeScript types defined
2. Authentication API integration
3. Basic CRUD operations for applications
4. User dashboard data fetching

### Phase 2 (Day 6-7): Advanced Features
1. Feedback system integration
2. File upload functionality
3. Real-time notifications
4. Advanced filtering and search

### Phase 3 (Day 8-9): Polish & Optimization
1. Caching implementation
2. Performance optimization
3. Error handling refinement
4. Loading state improvements

---

## Conclusion

The Prisma schema provides a solid foundation for the frontend requirements. The analysis reveals:

✅ **Strengths**:
- Well-structured relationships
- Comprehensive enums for UI states
- Proper indexing for performance
- Clear separation of concerns

⚠️ **Areas for Frontend Consideration**:
- File upload handling needs robust client-side validation
- Real-time notifications require WebSocket implementation
- Complex filtering needs efficient query strategies
- Role-based UI rendering requires careful state management

🔄 **Next Steps**:
1. Implement TypeScript types (✅ Completed)
2. Create API client functions
3. Set up form validation schemas
4. Build core UI components with proper data integration

**Reviewed By**: Gaurav (Frontend Lead)  
**Date**: Day 3 - Database Design Review  
**Status**: ✅ Schema approved for frontend implementation