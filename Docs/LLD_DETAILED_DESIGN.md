# Low-Level Design (LLD) - UIMP Detailed Implementation

## Database Schema Design

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │   Application   │       │    Feedback     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │◄─────┐│ id (UUID) PK    │◄─────┐│ id (UUID) PK    │
│ email (String)  │      ││ userId (UUID) FK│      ││ applicationId FK│
│ passwordHash    │      ││ company (String)│      ││ mentorId (UUID) │
│ role (Enum)     │      ││ role (String)   │      ││ content (Text)  │
│ firstName       │      ││ platform (String│      ││ tags (String[]) │
│ lastName        │      ││ status (Enum)   │      ││ priority (Enum) │
│ createdAt       │      ││ resumeUrl       │      ││ createdAt       │
│ updatedAt       │      ││ notes (Text)    │      ││ updatedAt       │
│ lastLoginAt     │      ││ deadline        │      │└─────────────────┘
│ isActive        │      ││ createdAt       │      │
└─────────────────┘      ││ updatedAt       │      │
                         │└─────────────────┘      │
                         └─────────────────────────┘

┌─────────────────┐       ┌─────────────────┐
│  Notification   │       │ MentorAssignment│
├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │       │ id (UUID) PK    │
│ userId (UUID) FK│       │ mentorId (UUID) │
│ type (Enum)     │       │ studentId (UUID)│
│ title (String)  │       │ assignedAt      │
│ message (Text)  │       │ isActive        │
│ read (Boolean)  │       │ createdAt       │
│ createdAt       │       │ updatedAt       │
│ expiresAt       │       └─────────────────┘
└─────────────────┘
```

### Detailed Schema Definitions

#### User Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

CREATE TYPE user_role AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Application Table
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  platform application_platform NOT NULL,
  status application_status DEFAULT 'DRAFT',
  resume_url TEXT,
  notes TEXT,
  deadline DATE,
  applied_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE application_platform AS ENUM (
  'LINKEDIN', 'COMPANY_WEBSITE', 'REFERRAL', 'JOB_BOARD', 'CAREER_FAIR', 'OTHER'
);

CREATE TYPE application_status AS ENUM (
  'DRAFT', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED'
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_company ON applications(company);
```

#### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tags feedback_tag[] DEFAULT '{}',
  priority feedback_priority NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE feedback_tag AS ENUM (
  'RESUME', 'DSA', 'SYSTEM_DESIGN', 'COMMUNICATION', 'INTERVIEW_PREP', 'GENERAL'
);

CREATE TYPE feedback_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE INDEX idx_feedback_application_id ON feedback(application_id);
CREATE INDEX idx_feedback_mentor_id ON feedback(mentor_id);
CREATE INDEX idx_feedback_priority ON feedback(priority);
```

#### Notification Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TYPE notification_type AS ENUM (
  'FEEDBACK_RECEIVED', 'APPLICATION_STATUS_CHANGED', 'MENTOR_ASSIGNED', 'SYSTEM_ANNOUNCEMENT'
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### Mentor Assignment Table
```sql
CREATE TABLE mentor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mentor_id, student_id)
);

CREATE INDEX idx_mentor_assignments_mentor_id ON mentor_assignments(mentor_id);
CREATE INDEX idx_mentor_assignments_student_id ON mentor_assignments(student_id);
```

## API Implementation Details

### Authentication Service

#### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Token Configuration
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  issuer: 'uimp-api',
  audience: 'uimp-client'
};
```

#### Password Hashing Implementation
```typescript
import bcrypt from 'bcrypt';

export class PasswordService {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

#### Authentication Middleware
```typescript
export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'No token provided' } },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
    req.user = payload;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } },
      { status: 401 }
    );
  }
}
```

### RBAC Implementation

#### Role Permissions Matrix
```typescript
const PERMISSIONS = {
  STUDENT: [
    'applications:create',
    'applications:read:own',
    'applications:update:own',
    'applications:delete:own',
    'feedback:read:own',
    'notifications:read:own',
    'upload:resume'
  ],
  MENTOR: [
    'applications:read:assigned',
    'feedback:create',
    'feedback:read:own',
    'feedback:update:own',
    'students:read:assigned',
    'notifications:read:own'
  ],
  ADMIN: [
    'users:read',
    'users:create',
    'users:update',
    'applications:read:all',
    'feedback:read:all',
    'mentor-assignments:create',
    'mentor-assignments:update',
    'notifications:create'
  ]
};
```

#### RBAC Middleware
```typescript
export function requirePermission(permission: string) {
  return async (req: NextRequest) => {
    const user = req.user;
    const userPermissions = PERMISSIONS[user.role];
    
    if (!userPermissions.includes(permission)) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } },
        { status: 403 }
      );
    }
    
    return NextResponse.next();
  };
}
```

### Validation Schemas

#### Application Validation
```typescript
import { z } from 'zod';

export const createApplicationSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(255),
  role: z.string().min(1, 'Role is required').max(255),
  platform: z.enum(['LINKEDIN', 'COMPANY_WEBSITE', 'REFERRAL', 'JOB_BOARD', 'CAREER_FAIR', 'OTHER']),
  resumeUrl: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
  deadline: z.string().datetime().optional()
});

export const updateApplicationSchema = createApplicationSchema.partial().extend({
  status: z.enum(['DRAFT', 'APPLIED', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'REJECTED']).optional()
});
```

#### Feedback Validation
```typescript
export const createFeedbackSchema = z.object({
  applicationId: z.string().uuid(),
  content: z.string().min(10, 'Feedback must be at least 10 characters').max(2000),
  tags: z.array(z.enum(['RESUME', 'DSA', 'SYSTEM_DESIGN', 'COMMUNICATION', 'INTERVIEW_PREP', 'GENERAL'])),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'])
});
```

### File Upload Implementation

#### S3 Upload Service
```typescript
import AWS from 'aws-sdk';

export class FileUploadService {
  private s3: AWS.S3;
  
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
  }

  async uploadResume(file: File, userId: string): Promise<string> {
    const key = `resumes/${userId}/${Date.now()}-${file.name}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
      ServerSideEncryption: 'AES256'
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async getSignedUrl(key: string): Promise<string> {
    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600 // 1 hour
    });
  }
}
```

### Caching Strategy

#### Redis Implementation
```typescript
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Dashboard cache keys
  getDashboardKey(userId: string): string {
    return `dashboard:${userId}`;
  }

  getApplicationsKey(userId: string, filters: any): string {
    const filterHash = Buffer.from(JSON.stringify(filters)).toString('base64');
    return `applications:${userId}:${filterHash}`;
  }
}
```

## Frontend Implementation Details

### API Client Implementation

#### Base API Client
```typescript
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.error.message, response.status, data.error.code);
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
```

#### Custom Hooks Implementation
```typescript
// useApplications hook
export function useApplications(filters?: ApplicationFilters) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Application[]>('/applications', { params: filters });
      setApplications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (data: CreateApplicationData) => {
    const response = await apiClient.post<Application>('/applications', data);
    setApplications(prev => [...prev, response.data]);
    return response.data;
  };

  const updateApplication = async (id: string, data: UpdateApplicationData) => {
    const response = await apiClient.put<Application>(`/applications/${id}`, data);
    setApplications(prev => prev.map(app => app.id === id ? response.data : app));
    return response.data;
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    refetch: fetchApplications
  };
}
```

### State Management

#### Authentication Context
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<{ user: User }>('/auth/login', { email, password });
    setUser(response.data.user);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout', {});
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Performance Optimization

### Database Query Optimization
```sql
-- Optimized queries with proper indexing
EXPLAIN ANALYZE SELECT 
  a.*,
  u.first_name,
  u.last_name,
  COUNT(f.id) as feedback_count
FROM applications a
JOIN users u ON a.user_id = u.id
LEFT JOIN feedback f ON a.id = f.application_id
WHERE a.user_id = $1
GROUP BY a.id, u.first_name, u.last_name
ORDER BY a.created_at DESC
LIMIT 10 OFFSET $2;
```

### Caching Strategy
```typescript
// Dashboard data caching
export async function getDashboardData(userId: string) {
  const cacheKey = `dashboard:${userId}`;
  
  // Try cache first
  let data = await cacheService.get(cacheKey);
  
  if (!data) {
    // Fetch from database
    data = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            feedback: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });
    
    // Cache for 5 minutes
    await cacheService.set(cacheKey, data, 300);
  }
  
  return data;
}
```

---

**Implementation Timeline**: Days 3-10 of sprint
**Code Review**: All implementations require peer review
**Testing**: Unit tests required for all services and components

**Lead Implementers**: Backend (Heramb), Frontend (Gaurav), UI (Mallu)
**Quality Assurance**: Daily code reviews and testing