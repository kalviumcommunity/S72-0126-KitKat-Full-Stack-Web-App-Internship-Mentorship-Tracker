# UI Components Guide - UIMP Frontend

## Reusable UI Components Identification

### 1. Form Components

#### Input Component
```typescript
interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
}
```
**Usage**: All forms (login, signup, application creation)
**Features**: Validation states, error display, accessibility

#### Select Component
```typescript
interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}
```
**Usage**: Application platform, status selection, role selection

#### Textarea Component
```typescript
interface TextareaProps {
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
  maxLength?: number;
}
```
**Usage**: Application notes, feedback content

#### FileUpload Component
```typescript
interface FileUploadProps {
  accept: string;
  maxSize: number;
  onUpload: (file: File) => void;
  currentFile?: string;
  error?: string;
}
```
**Usage**: Resume upload functionality

### 2. Display Components

#### Card Component
```typescript
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
}
```
**Usage**: Application cards, feedback cards, dashboard widgets

#### Badge Component
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```
**Usage**: Application status, priority levels, skill tags

#### Avatar Component
```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}
```
**Usage**: User profiles, mentor assignments

### 3. Navigation Components

#### Breadcrumb Component
```typescript
interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}
```
**Usage**: Dashboard navigation, application detail pages

#### Tabs Component
```typescript
interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  defaultTab?: string;
}
```
**Usage**: Dashboard sections, application management

#### Pagination Component
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```
**Usage**: Application lists, feedback lists

### 4. Feedback Components

#### Alert Component
```typescript
interface AlertProps {
  variant: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```
**Usage**: Form validation, success messages, error states

#### Toast Component
```typescript
interface ToastProps {
  variant: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}
```
**Usage**: Real-time notifications, action confirmations

#### Spinner Component
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}
```
**Usage**: Loading states, form submissions

### 5. Interactive Components

#### Modal Component
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```
**Usage**: Confirmation dialogs, form modals, detail views

#### Dropdown Component
```typescript
interface DropdownProps {
  trigger: React.ReactNode;
  items: { label: string; onClick: () => void; icon?: React.ReactNode }[];
  align?: 'left' | 'right';
}
```
**Usage**: User menu, action menus, filter options

#### Tooltip Component
```typescript
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```
**Usage**: Help text, additional information

## Design System Specifications

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  /* Success Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;

  /* Error Colors */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}
```

### Typography Scale
```css
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
```

### Spacing Scale
```css
.space-1 { margin: 0.25rem; }
.space-2 { margin: 0.5rem; }
.space-3 { margin: 0.75rem; }
.space-4 { margin: 1rem; }
.space-6 { margin: 1.5rem; }
.space-8 { margin: 2rem; }
.space-12 { margin: 3rem; }
.space-16 { margin: 4rem; }
```

### Border Radius
```css
.rounded-sm { border-radius: 0.125rem; }
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
```

## Component States

### Interactive States
- **Default**: Normal appearance
- **Hover**: Subtle color change, slight elevation
- **Active**: Pressed appearance
- **Focus**: Visible focus ring for accessibility
- **Disabled**: Reduced opacity, no interactions

### Validation States
- **Default**: Normal border color
- **Success**: Green border and icon
- **Warning**: Yellow border and icon
- **Error**: Red border and icon with error message

### Loading States
- **Skeleton**: Placeholder content while loading
- **Spinner**: Loading indicator for actions
- **Progressive**: Show partial content while loading

## Accessibility Guidelines

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order throughout the interface
- Escape key closes modals and dropdowns
- Enter/Space activates buttons and links

### Screen Reader Support
- Proper ARIA labels and descriptions
- Semantic HTML elements
- Alt text for all images
- Form labels properly associated

### Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Color not the only way to convey information

## Responsive Design Breakpoints

```css
/* Mobile First Approach */
.container {
  /* Mobile: 320px - 767px */
  padding: 1rem;
}

@media (min-width: 768px) {
  /* Tablet: 768px - 1023px */
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
  .container {
    padding: 3rem;
  }
}
```

## Animation Guidelines

### Micro-interactions
- Button hover: 150ms ease-in-out
- Modal open/close: 200ms ease-in-out
- Toast notifications: 300ms ease-in-out
- Loading spinners: Continuous smooth rotation

### Page Transitions
- Route changes: 200ms fade
- Modal overlays: 150ms fade-in
- Dropdown menus: 100ms slide-down

## Implementation Priority

### Phase 1 (Day 2-3)
1. Input, Button, Card components
2. Basic form components
3. Alert and Toast components

### Phase 2 (Day 4-5)
1. Modal and Dropdown components
2. Navigation components
3. Badge and Avatar components

### Phase 3 (Day 6-7)
1. Complex form components
2. Data display components
3. Loading and skeleton states

---

**Design Consistency**: All components must follow the established design system
**Accessibility First**: Every component must meet WCAG 2.1 AA standards
**Mobile Responsive**: All components must work on mobile devices

**Responsible**: Frontend Developer (Mallu)
**Review**: Frontend Lead (Gaurav) for consistency and quality