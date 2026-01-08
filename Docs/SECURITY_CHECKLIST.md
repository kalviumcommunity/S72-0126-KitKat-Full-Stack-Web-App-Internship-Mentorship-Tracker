# Security Checklist - UIMP Backend

Use this as a living implementation checklist. Mark items as you implement
them per environment (DEV / STAGE / PROD).

| Area | Item | DEV | STAGE | PROD | Evidence / Notes |
| --- | --- | --- | --- | --- | --- |
| Auth | Min 8 char passwords | [ ] | [ ] | [ ] | |
| Auth | bcrypt hashing (12 rounds) | [ ] | [ ] | [ ] | |
| Auth | No plaintext password storage | [ ] | [ ] | [ ] | |
| JWT  | HttpOnly cookie storage | [ ] | [ ] | [ ] | |
| JWT  | Cookie flags: httpOnly, secure, sameSite=strict | [ ] | [ ] | [ ] | |
| JWT  | 24h expiry, secret in env (>=32 chars) | [ ] | [ ] | [ ] | |
| RBAC | JWT verification middleware | [ ] | [ ] | [ ] | |
| RBAC | Role guards & resource ownership checks | [ ] | [ ] | [ ] | |
| Validation | Zod validation on all inputs | [ ] | [ ] | [ ] | |
| Validation | Email format validation | [ ] | [ ] | [ ] | |
| Uploads | PDF-only, max 5MB, MIME check | [ ] | [ ] | [ ] | |
| Uploads | Virus scan hook (or provider scan) | [ ] | [ ] | [ ] | |
| Headers | X-Content-Type-Options=nosniff | [ ] | [ ] | [ ] | |
| Headers | X-Frame-Options=DENY | [ ] | [ ] | [ ] | |
| Headers | HSTS (Strict-Transport-Security) | [ ] | [ ] | [ ] | |
| Headers | Content-Security-Policy defined | [ ] | [ ] | [ ] | |
| Headers | Referrer-Policy=strict-origin-when-cross-origin | [ ] | [ ] | [ ] | |
| DB | Prisma parameterized queries | [ ] | [ ] | [ ] | |
| DB | SSL/TLS DB connections | [ ] | [ ] | [ ] | |
| DB | Credentials via env, no hardcoding | [ ] | [ ] | [ ] | |
| DB | Backups encrypted | [ ] | [ ] | [ ] | |
| Privacy | Passwords hashed before storage | [ ] | [ ] | [ ] | |
| Privacy | PII handling policy & retention | [ ] | [ ] | [ ] | |
| Rate Limit | 100 req/min per IP | [ ] | [ ] | [ ] | |
| Rate Limit | Auth attempts 5/15min | [ ] | [ ] | [ ] | |
| Rate Limit | Uploads 10/hour | [ ] | [ ] | [ ] | |
| CORS | Strict origin allowlist, credentials enabled | [ ] | [ ] | [ ] | |
| Env | Separate dev/stage/prod configs | [ ] | [ ] | [ ] | |
| Env | Secrets rotation policy | [ ] | [ ] | [ ] | |
| TLS | HTTPS-only, redirect HTTP→HTTPS, TLS 1.2+ | [ ] | [ ] | [ ] | |
| Logging | Auth attempt + authZ failure logs | [ ] | [ ] | [ ] | |
| Logging | No sensitive data in logs | [ ] | [ ] | [ ] | |
| Monitoring | Alerts, uptime, perf monitoring | [ ] | [ ] | [ ] | |
| Errors | Generic prod messages, detailed server logs | [ ] | [ ] | [ ] | |
| Dependencies | Vulnerability scanning (npm audit) | [ ] | [ ] | [ ] | |
| Code Quality | ESLint security rules | [ ] | [ ] | [ ] | |
| Reviews | Security review on PRs | [ ] | [ ] | [ ] | |
| Containers | Minimal base image, non-root user | [ ] | [ ] | [ ] | |
| Containers | Image vulnerability scan | [ ] | [ ] | [ ] | |
| Cloud | IAM least-privilege, SGs/NACLs | [ ] | [ ] | [ ] | |
| Cloud | VPC, ALB/ELB TLS termination | [ ] | [ ] | [ ] | |
| Incident | Runbook: detect → respond → recover | [ ] | [ ] | [ ] | |

---

**Security Review Cadence**: Weekly during development; monthly after release.  
**Owner**: Backend Engineer (Heramb).  
**Cross-check**: Frontend Lead (Gaurav) for client-facing impacts.