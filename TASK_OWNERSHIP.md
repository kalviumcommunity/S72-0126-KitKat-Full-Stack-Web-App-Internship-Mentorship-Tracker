Project: Unified Internship & Mentorship Portal (UIMP)

This document defines clear task ownership for each team member.
If a task fails, the owner is accountable.

Team Members

Backend Engineer: Heramb

Frontend Engineer (Pro): Gaurav

Frontend Engineer (Noob): Mallu

1. BACKEND TASKS — Owner: Heramb

Scope: Everything behind the API boundary.
No UI work. No styling. No frontend opinions.

1.1 Project & Infrastructure

Initialize backend structure inside Next.js

Configure environment variables

Docker & docker-compose for:

Next.js

PostgreSQL

Redis

Cloud readiness (AWS/Azure compatible)

1.2 Database & ORM

Design Prisma schema

Define relations:

User ↔ Applications

Application ↔ Feedback

Write migrations

Seed scripts for dev/testing

1.3 Authentication & Authorization

Signup / Login APIs

Password hashing

JWT + HttpOnly cookies

Role-Based Access Control (RBAC):

STUDENT

MENTOR

ADMIN

Authorization middleware

1.4 API Development

Applications CRUD APIs

Feedback APIs

Notification APIs

File upload API (S3 / Azure Blob)

Global API response handler

Error-handling middleware

1.5 Security & Compliance

Input validation (Zod)

Input sanitization

OWASP best practices

Secure headers

HTTPS enforcement

1.6 Performance & Reliability

Redis caching for dashboards

Query optimization

Transaction safety

Logging & monitoring hooks

1.7 CI/CD & Deployment

Dockerfile

GitHub Actions:

Build

Test

Push image

Deployment to AWS ECS / Azure App Service

Deployment verification & rollback plan

2. FRONTEND TASKS (PRO) — Owner: Gaurav

Scope: Architecture, correctness, performance.
Mentors Mallu. Reviews all UI PRs.

2.1 App Architecture

Next.js App Router setup

Route grouping & layouts

Server vs Client component decisions

Folder structure finalization

2.2 Data Strategy

Server Components for dashboards

Client-side fetching (SWR / fetch)

API integration patterns

Error boundaries & loading states

2.3 Core Screens

Student dashboard layout

Mentor dashboard layout

Application list & details pages

Feedback views (read-only + write)

2.4 State & UX

Global state using Context + hooks

Toasts, modals, feedback UI

Role-based UI rendering

Responsive & themed design

2.5 Code Quality

TypeScript strictness

ESLint rules

PR reviews (mandatory)

Performance optimization

3. FRONTEND TASKS (NOOB) — Owner: Mallu

Scope: UI implementation only.
No architectural decisions.
Works strictly under Gaurav’s guidance.

3.1 UI Components

Forms (login, signup, application create/edit)

Input validation UI

Error messages & helper text

Buttons, modals, cards

3.2 Styling & Responsiveness

Responsive layouts

Mobile-friendly screens

Consistent spacing & typography

Dark/light theme support (if assigned)

3.3 UX States

Loading skeletons

Empty states

Error states

Success toasts

3.4 Learning Deliverables

Understand:

App Router basics

Client components

Props & hooks

No backend calls without review

No direct API changes

4. COLLABORATION RULES (MANDATORY)

Feature branches only

PRs required for every merge

Backend PRs reviewed by Gaurav

Frontend PRs reviewed by Gaurav

No direct pushes to main

5. DEFINITION OF DONE (DoD)

A task is DONE only if:

Code is merged

Feature works end-to-end

Error states handled

README updated (if needed)