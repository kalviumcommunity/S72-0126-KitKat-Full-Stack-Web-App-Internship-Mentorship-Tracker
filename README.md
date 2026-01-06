# Unified Internship & Mentorship Portal (UIMP)

## 1. Project Overview

The **Unified Internship & Mentorship Portal (UIMP)** is a full‑stack, production‑grade web platform designed to centralize **internship application tracking** and **mentor‑driven feedback** into a single, cohesive system.

The system is intentionally scoped as an **MVP with strict boundaries**. Every feature included is essential for real‑world usability; no experimental or speculative components are part of the baseline.

---

## 2. Core Users

### 2.1 Student

Primary consumer of the platform. Students manage internship applications and receive structured mentorship feedback.

**Capabilities**:

* Create and manage internship applications
* Track application status across a defined pipeline
* Upload and manage resume versions
* View mentor feedback and act on recommendations
* Receive notifications for important events

---

### 2.2 Mentor

Provides structured guidance to assigned students.

**Capabilities**:

* View assigned students
* Review student applications
* Leave structured, prioritized feedback
* Track feedback status (given vs pending)

---

### 2.3 Admin (Minimal / Internal)

Operational role with limited exposure.

**Capabilities**:

* Manage user access
* Assign mentors to students
* Monitor system health (no business dashboards in MVP)

---

## 3. MVP Feature Set (Locked Scope)

### 3.1 Authentication & Access Control

* Email + password based signup and login
* Secure authentication using **JWT stored in HttpOnly cookies**
* **Role‑Based Access Control (RBAC)** enforced at API and service layers

Roles:

* `STUDENT`
* `MENTOR`
* `ADMIN`

---

### 3.2 Internship Application Tracking

Students can manage applications with full CRUD support.

#### Application Status Pipeline

```
Draft → Applied → Shortlisted → Interview → Offer → Rejected
```

#### Application Fields

* Company
* Role
* Platform (LinkedIn, Careers Page, Referral, etc.)
* Resume Version (linked file)
* Notes
* Deadlines

---

### 3.3 Mentorship Feedback System

Mentors provide structured feedback tied to specific applications.

**Feedback Attributes**:

* Linked Application
* Content (textual feedback)
* Skill Tags:

  * Resume
  * DSA
  * System Design
  * Communication
* Priority Level:

  * Low
  * Medium
  * High

---

### 3.4 Dashboards

#### Student Dashboard

* Applications grouped by status
* Recent mentor feedback
* Pending actions (e.g., interview prep, resume update)

#### Mentor Dashboard

* Assigned students
* Feedback given vs pending

---

### 3.5 Notifications

#### Email Notifications

Triggered on:

* New mentor feedback
* Application status change

#### In‑App Notifications

* Toast notifications for real‑time events
* Persistent notification list

---

### 3.6 File Uploads

* Resume upload (PDF only)
* Stored using **AWS S3 or Azure Blob Storage**
* Secure, signed access URLs

---

## 4. High‑Level Architecture (HLD)

This architecture represents the **minimum acceptable production standard**.

```
Browser
  ↓
Next.js App Router
  ├─ Server Components (Dashboards)
  ├─ Client Components (Forms, Modals)
  ↓
API Routes (Next.js)
  ├─ Auth APIs
  ├─ Application APIs
  ├─ Feedback APIs
  ├─ File Upload APIs
  ↓
Service Layer
  ├─ Validation (Zod)
  ├─ Business Logic
  ├─ RBAC Middleware
  ↓
Data Layer
  ├─ PostgreSQL (RDS / Azure SQL)
  ├─ Prisma ORM
  ├─ Redis (Caching)
  ↓
Infrastructure
  ├─ Docker
  ├─ GitHub Actions
  ├─ AWS ECS / Azure App Service
```

---

## 5. Low‑Level Design (LLD)

### 5.1 Database Schema

#### User

| Field        | Type                     |
| ------------ | ------------------------ |
| id           | UUID                     |
| email        | String (unique)          |
| passwordHash | String                   |
| role         | STUDENT / MENTOR / ADMIN |
| createdAt    | Timestamp                |

---

#### Application

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| userId    | FK → User |
| company   | String    |
| role      | String    |
| platform  | String    |
| status    | Enum      |
| resumeUrl | String    |
| notes     | Text      |
| createdAt | Timestamp |

---

#### Feedback

| Field         | Type                |
| ------------- | ------------------- |
| id            | UUID                |
| applicationId | FK → Application    |
| mentorId      | FK → User           |
| content       | Text                |
| tags          | String[]            |
| priority      | Low / Medium / High |
| createdAt     | Timestamp           |

---

#### Notification

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| userId    | FK → User |
| type      | String    |
| read      | Boolean   |
| createdAt | Timestamp |

---

## 6. Project Structure

```
/app
  /(auth)
    /login
    /signup
  /dashboard
    /student
    /mentor
  /applications
  /feedback

/api
  /auth
  /applications
  /feedback
  /upload

/lib
  prisma.ts
  auth.ts
  rbac.ts
  email.ts
  redis.ts

/prisma
  schema.prisma
  migrations/

/docker
  Dockerfile
  docker-compose.yml
```

---

## 7. README.md (Initial Version)

```md
# Unified Internship & Mentorship Portal (UIMP)

A full‑stack platform to track internship applications and mentorship feedback in one place.

## Tech Stack
- Next.js (App Router)
- TypeScript
- PostgreSQL + Prisma
- Redis
- Docker
- AWS ECS / Azure App Service

## Features
- Internship application tracking
- Mentor feedback system
- Role‑based access control
- Email notifications
- Resume uploads

## Setup
1. Clone the repository
2. Configure environment variables
3. Run `docker-compose up`
4. Start development server with `npm run dev`

## Deployment
- CI/CD via GitHub Actions
- Dockerized deployment to AWS or Azure
```

> **Note:** This README is a living document. If it stops evolving, the project is decaying.

---

## 8. Engineering Principle

This project is designed to reflect **real production thinking**:

* Explicit scope boundaries
* Clean separation of concerns
* Strong defaults
* No accidental complexity

Anything not defined here is **out of scope by design**.
