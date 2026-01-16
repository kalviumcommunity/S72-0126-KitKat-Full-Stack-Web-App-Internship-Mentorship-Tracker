    # Unified Internship & Mentorship Portal (UIMP)

## Project Execution Plan (4 Weeks)

This document defines the **execution roadmap**, **role ownership**, and **delivery discipline** for the UIMP MVP. The plan is designed to eliminate ambiguity, enforce accountability, and ensure production readiness by the end of Week 4.

---

## Team Structure

* **Backend**: Heramb
* **Frontend 1**: Gaurav
* **Frontend 2**: Mallu

---

## WEEK 1 — Setup & Design

**Goal**: Establish project foundation, lock architecture, and remove ambiguity.

---

### Day 1 — Project Kickoff & Repository Setup

#### Backend (Heramb)

* Initialize repository
* Configure `.env.example`
* Create Docker Compose skeleton (PostgreSQL + Redis)

#### Frontend 1 (Gaurav)

* Define Next.js App Router structure
* Plan layout hierarchy and route grouping

#### Frontend 2 (Mallu)

* Setup local development environment
* Learn core App Router concepts

**Deliverables**:

* Repository live
* README v1 committed
* Branching strategy documented

---

### Day 2 — HLD & LLD Finalization

#### Backend (Heramb)

* Define API contracts (Auth, Applications, Feedback)
* Prepare security checklist

#### Frontend 1 (Gaurav)

* Finalize component hierarchy
* Map Server vs Client Components

#### Frontend 2 (Mallu)

* Review wireframes
* Identify reusable UI components

**Deliverables**:

* High-Level Architecture (HLD) diagram
* Low-Level Design (LLD) document

---

### Day 3 — Database Design

#### Backend (Heramb)

* Design Prisma schema
* Finalize entity relationships

#### Frontend 1 (Gaurav)

* Review schema for frontend data requirements

#### Frontend 2 (Mallu)

* Observe design decisions and document learnings

**Deliverables**:

* `schema.prisma`
* Entity Relationship (ER) diagram

---

### Day 4 — Project Initialization

#### Backend (Heramb)

* Setup Prisma and run migrations
* Implement seed scripts

#### Frontend 1 (Gaurav)

* Scaffold App Router structure
* Implement base layout and authentication routes

#### Frontend 2 (Mallu)

* Build static login and signup UI

**Deliverables**:

* Database running locally
* Authentication pages visible

---

### Day 5 — Standards & Tooling

#### Backend (Heramb)

* Implement global error handler
* Establish Zod validation base

#### Frontend 1 (Gaurav)

* Configure ESLint and TypeScript

#### Frontend 2 (Mallu)

* Implement client-side form validation UI

**Deliverables**:

* Linting enforced
* Validation patterns standardized

---

## WEEK 2 — Core Development

**Goal**: Functional backend with a usable frontend.

---

### Day 6 — Authentication

#### Backend (Heramb)

* Implement signup and login APIs
* JWT authentication with HttpOnly cookies
* RBAC middleware

#### Frontend 1 (Gaurav)

* Integrate authentication flow
* Configure protected routes

#### Frontend 2 (Mallu) 

* Connect login and signup forms to APIs

**Deliverables**:

* End-to-end authentication working

---

### Day 7 — Application APIs

#### Backend (Heramb)

* Build application CRUD APIs
* Add input validation

#### Frontend 1 (Gaurav)

* Applications list page (Server Component)

#### Frontend 2 (Mallu)



* Application create/edit form UI

**Deliverables**:

* Internship applications fully manageable

---

### Day 8 — Feedback System

#### Backend (Heramb)

* Implement feedback APIs
* Enforce mentor authorization

#### Frontend 1 (Gaurav)

* Feedback display components

#### Frontend 2 (Mallu)

* Feedback submission form UI

**Deliverables**:

* Mentor feedback loop functional

---

### Day 9 — Dashboards

#### Backend (Heramb)

* Optimize database queries
* Integrate Redis caching

#### Frontend 1 (Gaurav)

* Build Student and Mentor dashboards

#### Frontend 2 (Mallu)

* UI polish for dashboards

**Deliverables**:

* Dashboards load efficiently

---

### Day 10 — File Upload & Notifications

#### Backend (Heramb)

* Implement S3 / Azure Blob upload APIs
* Integrate email notification service

#### Frontend 1 (Gaurav)

* Resume upload flow integration

#### Frontend 2 (Mallu)

* Upload UI with progress indicators

**Deliverables**:

* Resume upload functional
* Email notifications delivered

---

## WEEK 3 — Integration & Testing

**Goal**: Stability, correctness, and automation.

---

### Day 11 — Integration

#### Backend (Heramb)

* End-to-end API verification

#### Frontend 1 (Gaurav)

* Complete frontend-backend wiring

#### Frontend 2 (Mallu)

* Resolve UI defects

**Deliverables**:

* Feature-complete MVP

---

### Day 12 — Error Handling & Security

#### Backend (Heramb)

* OWASP security hardening
* Secure HTTP headers

#### Frontend 1 (Gaurav)

* Error and empty states

#### Frontend 2 (Mallu)

* UX improvements

**Deliverables**:

* Application fails safely

---

### Day 13 — Testing

#### Backend (Heramb)

* API unit tests
* Integration tests

#### Frontend 1 (Gaurav)

* UI sanity testing

#### Frontend 2 (Mallu)

* Manual test cases

**Deliverables**:

* All tests passing

---

### Day 14 — CI/CD

#### Backend (Heramb)

* Configure GitHub Actions
* Docker build and push pipeline

#### Frontend 1 (Gaurav)

* Deployment verification

#### Frontend 2 (Mallu)

* Regression testing

**Deliverables**:

* Automated CI/CD pipeline

---

## WEEK 4 — Finalization & Deployment

**Goal**: Production-ready MVP.

---

### Day 15 — Feature Freeze

**All Team Members**

* No new features
* Bug fixes only

---

### Day 16 — UI Polish

#### Frontend 1 (Gaurav)

* Performance tuning

#### Frontend 2 (Mallu)

* Visual consistency improvements

---

### Day 17 — Documentation

#### Backend (Heramb)

* API documentation

#### Frontend 1 (Gaurav)

* Frontend technical documentation

#### Frontend 2 (Mallu)

* User walkthrough documentation

---

### Day 18 — Deployment

#### Backend (Heramb)

* Cloud deployment
* SSL and domain configuration

#### Frontend 1 (Gaurav)

* Production sanity checks

#### Frontend 2 (Mallu)

* User Acceptance Testing (UAT)

---

### Day 19 — Buffer & Fixes

**All Team Members**

* Resolve last-minute issues

---

### Day 20 — Final Submission

**All Team Members**

* Live demo
* Final README
* Team retrospective

---

## Rules & Enforcement

* Daily commits are mandatory
* No skipped working days
* Pull Requests required for all merges
* Repository owner is accountable for delivery

---

This execution plan is intentionally strict. Deviations must be justified; silence is not an excuse.
