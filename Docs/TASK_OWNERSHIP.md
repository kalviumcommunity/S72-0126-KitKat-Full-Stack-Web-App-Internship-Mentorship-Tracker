# Unified Internship & Mentorship Portal (UIMP)

## Task Ownership & Responsibility Matrix

This document defines **explicit task ownership** for the UIMP project. Every task has a single accountable owner. If a task fails, the owner is responsible for resolution.

Ambiguity is not acceptable.

---

## Team Members

* **Backend Engineer**: Heramb
* **Frontend Engineer 1**: Gaurav
* **Frontend Engineer 2**: Mallu

---

## 1. Backend Responsibilities — Owner: Heramb

**Scope**: Everything behind the API boundary.

* No UI work
* No styling
* No frontend-driven architectural decisions

---

### 1.1 Project & Infrastructure

* Initialize backend structure within Next.js
* Configure environment variables
* Setup Docker and `docker-compose` for:

  * Next.js
  * PostgreSQL
  * Redis
* Ensure cloud readiness (AWS / Azure compatible)

---

### 1.2 Database & ORM

* Design Prisma schema
* Define relationships:

  * User ↔ Applications
  * Application ↔ Feedback
* Write database migrations
* Create seed scripts for development and testing

---

### 1.3 Authentication & Authorization

* Implement Signup and Login APIs
* Secure password hashing
* JWT-based authentication using HttpOnly cookies
* Role-Based Access Control (RBAC):

  * STUDENT
  * MENTOR
  * ADMIN
* Authorization middleware enforcement

---

### 1.4 API Development

* Internship Applications CRUD APIs
* Feedback APIs
* Notification APIs
* File upload APIs (AWS S3 / Azure Blob)
* Global API response standardization
* Centralized error-handling middleware

---

### 1.5 Security & Compliance

* Input validation using Zod
* Input sanitization
* OWASP security best practices
* Secure HTTP headers
* HTTPS enforcement

---

### 1.6 Performance & Reliability

* Redis caching for dashboard queries
* Database query optimization
* Transaction safety and consistency
* Logging and monitoring hooks

---

### 1.7 CI/CD & Deployment

* Author Dockerfile
* Configure GitHub Actions for:

  * Build
  * Test
  * Image push
* Deployment to AWS ECS or Azure App Service
* Deployment verification and rollback strategy

---

## 2. Frontend Responsibilities — Owner: Gaurav (Frontend Engineer 1)

**Scope**: Frontend architecture, correctness, performance, and governance.

* Mentors Frontend Engineer 2
* Reviews all frontend-related Pull Requests

---

### 2.1 Application Architecture

* Next.js App Router setup
* Route grouping and layout strategy
* Server vs Client component decisions
* Finalize frontend folder structure

---

### 2.2 Data Strategy

* Server Components for dashboards
* Client-side data fetching (SWR / fetch)
* API integration patterns
* Error boundaries and loading states

---

### 2.3 Core Screens

* Student dashboard layout
* Mentor dashboard layout
* Application list and detail pages
* Feedback views (read and write)

---

### 2.4 State Management & UX

* Global state using Context and custom hooks
* Toast notifications and modal flows
* Role-based UI rendering
* Responsive and themed design decisions

---

### 2.5 Code Quality & Reviews

* Enforce TypeScript strict mode
* Maintain ESLint rules
* Mandatory Pull Request reviews
* Frontend performance optimization

---

## 3. Frontend Responsibilities — Owner: Mallu (Frontend Engineer 2)

**Scope**: UI implementation only.

* No architectural decisions
* Works strictly under Frontend Engineer 1 guidance

---

### 3.1 UI Components

* Forms (Login, Signup, Application Create/Edit)
* Client-side input validation UI
* Error messages and helper text
* Buttons, modals, and card components

---

### 3.2 Styling & Responsiveness

* Responsive layouts
* Mobile-friendly screens
* Consistent spacing and typography
* Dark/light theme support (if assigned)

---

### 3.3 UX States

* Loading skeletons
* Empty states
* Error states
* Success toasts

---

### 3.4 Learning Deliverables

Must demonstrate understanding of:

* Next.js App Router basics
* Client Components
* Props and React hooks

**Constraints**:

* No backend API calls without review
* No direct API modifications

---

## 4. Collaboration Rules (Mandatory)

* Feature branches only
* Pull Requests required for every merge
* Backend Pull Requests reviewed by Frontend Engineer 1
* Frontend Pull Requests reviewed by Frontend Engineer 1
* No direct pushes to `main`

---

## 5. Definition of Done (DoD)

A task is considered **DONE** only if all conditions below are met:

* Code is merged into the main branch
* Feature works end-to-end
* Error and edge states are handled
* README or documentation updated (if applicable)

---

This responsibility matrix is non-negotiable. Ownership implies accountability.
