# Component Hierarchy - UIMP Frontend

## Architecture Overview

### Server vs Client Components Strategy

**Server Components (Default)**:
- Dashboards (data fetching)
- Application lists
- Static pages
- Layout components

**Client Components (Interactive)**:
- Forms with state
- Modals and dialogs
- Interactive buttons
- Real-time notifications

## Component Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route Group - Authentication
│   │   ├── login/
│   │   │   └── page.tsx          # Server Component
│   │   ├── signup/
│   │   │   └── page.tsx          # Server Component
│   │   └── layout.tsx            # Auth Layout (Server)
│   │
│   ├── (dashboard)/              # Route Group - Protected Routes
│   │   ├── student/
│   │   │   ├── page.tsx          # Student Dashboard (Server)
│   │   │   ├── applications/
│   │   │   │   ├── page.tsx      # Applications List (Server)
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # New Application (Client)
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx  # Application Detail (Server)
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit Application (Client)
│   │   │   └── feedback/
│   │   │       └── page.tsx      # Feedback List (Server)
│   │   │
│   │   ├── mentor/
│   │   │   ├── page.tsx          # Mentor Dashboard (Server)
│   │   │   ├── students/
│   │   │   │   └── page.tsx      # Assigned Students (Server)
│   │   │   └── feedback/
│   │   │       ├── page.tsx      # Feedback Management (Server)
│   │   │       └── new/
│   │   │           └── page.tsx  # Create Feedback (Client)
│   │   │
│   │   └── layout.tsx            # Dashboard Layout (Server)
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── applications/
│   │   ├── feedback/
│   │   └── upload/
│   │
│   ├── globals.css
│   ├── layout.tsx                # Root Layout (Server)
│   ├── page.tsx                  # Home Page (Server)
│   ├── about/
│   │   └── page.tsx              # About Page (Server)
│   └── not-found.tsx             # 404 Page (Server)
│
├── components/                   # Reusable Components
│   ├── ui/                       # Base UI Components
│   │   ├── Button.tsx            # ✅ Implemented
│   │   ├── Input.tsx             # Form Input (Client)
│   │   ├── Card.tsx              # Content Card (Server)
│   │   ├── Badge.tsx             # Status Badge (Server)
│   │   ├── Modal.tsx             # Modal Dialog (Client)
│   │   ├── Toast.tsx             # Notification Toast (Client)
│   │   ├── Spinner.tsx           # Loading Spinner (Server/Client)
│   │   └── Dropdown.tsx          # Dropdown Menu (Client)
│   │
│   ├── forms/                    # Form Components (Client)
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ApplicationForm.tsx
│   │   ├── FeedbackForm.tsx
│   │   └── FileUpload.tsx
│   │
│   ├── dashboard/                # Dashboard Components
│   │   ├── StudentDashboard.tsx  # (Server)
│   │   ├── MentorDashboard.tsx   # (Server)
│   │   ├── ApplicationCard.tsx   # (Server)
│   │   ├── FeedbackCard.tsx      # (Server)
│   │   └── StatsCard.tsx         # (Server)
│   │
│   ├── layout/                   # Layout Components
│   │   ├── Header.tsx            # Navigation Header (Server)
│   │   ├── Sidebar.tsx           # Dashboard Sidebar (Client)
│   │   ├── Footer.tsx            # Footer (Server)
│   │   └── Navigation.tsx        # Main Navigation (Client)
│   │
│   └── features/                 # Feature-specific Components
│       ├── applications/
│       │   ├── ApplicationList.tsx    # (Server)
│       │   ├── ApplicationDetail.tsx  # (Server)
│       │   ├── StatusBadge.tsx        # (Server)
│       │   └── StatusPipeline.tsx     # (Server)
│       │
│       ├── feedback/
│       │   ├── FeedbackList.tsx       # (Server)
│       │   ├── FeedbackItem.tsx       # (Server)
│       │   ├── SkillTags.tsx          # (Server)
│       │   └── PriorityBadge.tsx      # (Server)
│       │
│       └── notifications/
│           ├── NotificationList.tsx   # (Client)
│           ├── NotificationItem.tsx   # (Client)
│           └── ToastProvider.tsx      # (Client)
│
├── lib/                          # Utilities & Configurations
│   ├── utils.ts                  # ✅ Implemented
│   ├── api.ts                    # API client functions
│   ├── auth.ts                   # Authentication utilities
│   ├── constants.ts              # App constants
│   ├── validations.ts            # Form validation schemas
│   └── types.ts                  # TypeScript type definitions
│
├── hooks/                        # Custom React Hooks (Client)
│   ├── useAuth.ts                # Authentication hook
│   ├── useApplications.ts        # Applications data hook
│   ├── useFeedback.ts            # Feedback data hook
│   ├── useNotifications.ts       # Notifications hook
│   └── useLocalStorage.ts        # Local storage hook
│
└── contexts/                     # React Contexts (Client)
    ├── AuthContext.tsx           # Authentication state
    ├── NotificationContext.tsx   # Notification state
    └── ThemeContext.tsx          # Theme state (dark/light)
```

## Component Design Principles

### 1. Server Components (Default Choice)
- **Use for**: Data fetching, static content, SEO-important pages
- **Benefits**: Better performance, smaller bundle size, SEO-friendly
- **Examples**: Dashboards, lists, detail pages

### 2. Client Components (When Needed)
- **Use for**: Interactivity, state management, event handlers
- **Mark with**: `"use client"` directive
- **Examples**: Forms, modals, interactive buttons

### 3. Component Composition
- **Atomic Design**: Atoms (Button) → Molecules (Form) → Organisms (Dashboard)
- **Reusability**: Shared components in `/ui` folder
- **Feature-specific**: Components in `/features` folder

### 4. Props & TypeScript
- **Strict typing**: All props must have TypeScript interfaces
- **Default props**: Use default parameters
- **Ref forwarding**: For UI components that need refs

## Data Flow Architecture

### 1. Server Components Data Flow
```
Page Component (Server) → API Route → Database → Response → Render
```

### 2. Client Components Data Flow
```
Client Component → Custom Hook → API Client → Server → Update State
```

### 3. State Management Strategy
- **Server State**: React Query / SWR for API data
- **Client State**: React useState/useReducer for UI state
- **Global State**: React Context for auth, theme, notifications

## Route Protection Strategy

### 1. Middleware-based Protection
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Check authentication
  // Redirect if not authenticated
}
```

### 2. Layout-based Protection
```typescript
// (dashboard)/layout.tsx
export default function DashboardLayout() {
  // Verify authentication
  // Render protected content
}
```

### 3. Component-level Protection
```typescript
// Custom hook for route protection
function useRequireAuth() {
  // Check auth status
  // Redirect if needed
}
```

## Performance Optimization

### 1. Code Splitting
- Route-based splitting (automatic with App Router)
- Component-based splitting with `dynamic()`
- Feature-based splitting

### 2. Image Optimization
- Next.js Image component for all images
- Proper sizing and formats
- Lazy loading by default

### 3. Bundle Optimization
- Tree shaking for unused code
- Dynamic imports for heavy components
- Minimal client-side JavaScript

## Error Handling Strategy

### 1. Error Boundaries
```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends Component {
  // Handle component errors
}
```

### 2. API Error Handling
```typescript
// lib/api.ts
async function apiCall() {
  try {
    // API call
  } catch (error) {
    // Handle and format errors
  }
}
```

### 3. Form Validation
```typescript
// lib/validations.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

## Testing Strategy

### 1. Component Testing
- Jest + React Testing Library
- Test user interactions
- Test accessibility

### 2. Integration Testing
- Test API integration
- Test authentication flows
- Test form submissions

### 3. E2E Testing
- Playwright for critical user journeys
- Authentication flow
- Application creation flow

---

**Implementation Priority**:
1. Core UI components (Button, Input, Card)
2. Authentication forms and flow
3. Dashboard layouts and navigation
4. Application management components
5. Feedback system components
6. Notification system

**Responsible**: Frontend Lead (Gaurav)
**Review**: All frontend components reviewed before merge