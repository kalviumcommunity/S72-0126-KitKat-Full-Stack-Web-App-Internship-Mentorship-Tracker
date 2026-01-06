PROJECT: Unified Internship & Mentorship Portal (UIMP)
1. FULL MVP DEFINITION (NO FLUFF)
Core Users

Student

Mentor

Admin (minimal, internal)

MVP FEATURES (LOCKED SCOPE)
Authentication & Access

Email + password signup/login

JWT + HttpOnly cookies

Role-Based Access Control (RBAC)

Internship Application Tracking

Create / edit / delete applications

Status pipeline:

Draft → Applied → Shortlisted → Interview → Offer → Rejected


Fields:

Company

Role

Platform

Resume version

Notes

Deadlines

Mentorship Feedback

Mentor can:

View assigned students

Leave structured feedback

Feedback linked to:

Application

Skill tags (Resume, DSA, System Design, Communication)

Priority (Low/Medium/High)

Dashboard

Student dashboard:

Applications by status

Recent feedback

Pending actions

Mentor dashboard:

Students assigned

Feedback given / pending

Notifications

Email on:

New feedback

Status change

In-app toast notifications

File Upload

Resume upload (PDF)

Stored on S3 / Azure Blob

2. HIGH-LEVEL ARCHITECTURE (HLD)
4
System Architecture
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
Infra
  ├─ Docker
  ├─ GitHub Actions
  ├─ AWS ECS / Azure App Service


This is minimum acceptable production architecture.

3. LOW-LEVEL DESIGN (LLD)
Database Schema (Core Tables)
User
- id
- email
- passwordHash
- role (STUDENT | MENTOR | ADMIN)
- createdAt

Application
- id
- userId
- company
- role
- platform
- status
- resumeUrl
- notes
- createdAt

Feedback
- id
- applicationId
- mentorId
- content
- tags[]
- priority
- createdAt

Notification
- id
- userId
- type
- read
- createdAt

4. PROJECT STRUCTURE
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

5. README.md (STARTING POINT)
README.md (Skeleton)
# Unified Internship & Mentorship Portal (UIMP)

A full-stack platform to track internship applications and mentorship feedback in one place.

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
- Role-based access control
- Email notifications
- Resume uploads

## Setup
1. Clone repo
2. Setup env variables
3. docker-compose up
4. npm run dev

## Deployment
CI/CD via GitHub Actions
Dockerized deployment to AWS/Azure


This README grows daily. If it doesn’t, your project is decaying.