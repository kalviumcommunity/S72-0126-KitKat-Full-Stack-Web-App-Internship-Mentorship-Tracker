# End-to-End Testing Guide

## Overview

This guide covers the comprehensive end-to-end (E2E) testing suite for the Unified Internship & Mentorship Portal (UIMP) API. The test suite validates all major API endpoints, authentication flows, authorization rules, and business logic.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Test Scripts](#test-scripts)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Scenarios](#test-scenarios)
- [Interpreting Results](#interpreting-results)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

---

## Prerequisites

### Server Requirements

1. **Server Running**: Ensure the API server is running on `http://localhost:3001`
   ```bash
   cd server
   npm run dev
   ```

2. **Database**: PostgreSQL database must be running and migrated
   ```bash
   npm run db:migrate
   npm run db:seed  # Optional: seed with admin user
   ```

3. **Environment Variables**: Configure `.env` file with required settings
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/uimp"
   JWT_SECRET="your-secret-key"
   NODE_ENV="development"
   ```

### Optional Services

- **Redis**: For caching tests (gracefully degrades if not available)
- **Email Service**: For notification tests (can be mocked)
- **Storage Service**: For file upload tests (can use local storage)

---

## Test Scripts

### PowerShell (Windows)

**File**: `test-e2e.ps1`

```powershell
# Run the test suite
.\test-e2e.ps1
```

### Bash (Linux/Mac)

**File**: `test-e2e.sh`

```bash
# Make executable
chmod +x test-e2e.sh

# Run the test suite
./test-e2e.sh
```

---

## Running Tests

### Quick Start

1. **Start the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Open a new terminal** and run tests:
   
   **Windows**:
   ```powershell
   cd server
   .\test-e2e.ps1
   ```
   
   **Linux/Mac**:
   ```bash
   cd server
   ./test-e2e.sh
   ```

### Expected Output

```
========================================
End-to-End API Verification Test Suite
========================================

=== 1. Health Check ===
Test 1: Health Check
  ✓ PASSED

=== 2. Authentication Tests ===
Test 2: Register Student
  ✓ PASSED
Test 3: Register Mentor
  ✓ PASSED
...

========================================
Test Summary
========================================
Total Tests:  45
Passed:       45
Failed:       0
Success Rate: 100%

✓ All tests passed!
========================================
```

---

## Test Coverage

### 1. Health Check (1 test)
- Server health endpoint validation

### 2. Authentication (6 tests)
- Student registration
- Mentor registration
- Student login
- Mentor login
- Admin login
- Token generation

### 3. User Management (2 tests)
- Get current user profile
- List all users (admin only)

### 4. Application CRUD (5 tests)
- Create application
- Get application by ID
- List applications with pagination
- Update application
- Get application statistics

### 5. Mentor Assignment (1 test)
- Assign mentor to student (admin only)

### 6. Feedback System (5 tests)
- Create feedback (mentor only)
- Get feedback by ID
- List feedback
- Get feedback for specific application
- Get feedback statistics

### 7. Authorization (2 tests)
- Student cannot create feedback
- Mentor cannot create application

### 8. Validation (2 tests)
- Invalid email format rejection
- Missing required fields rejection

### 9. Pagination (2 tests)
- Page 1 retrieval
- Page 2 retrieval

### 10. Filtering (3 tests)
- Filter by status
- Filter by platform
- Search by company name

### 11. Sorting (2 tests)
- Sort by created date (descending)
- Sort by company name (ascending)

### 12. Rate Limiting (5 tests)
- Multiple rapid requests

### 13. Error Handling (3 tests)
- 404 for non-existent resources
- 401 for missing authentication
- 401 for invalid tokens

### 14. Cleanup (2 tests)
- Delete feedback
- Delete application

**Total: 45+ comprehensive tests**

---

## Test Scenarios

### Authentication Flow

```
1. Register Student → Get student ID
2. Register Mentor → Get mentor ID
3. Login Student → Get student token
4. Login Mentor → Get mentor token
5. Login Admin → Get admin token
```

### Application Lifecycle

```
1. Create Application (Student)
2. Get Application Details
3. Update Application Status
4. Assign Mentor (Admin)
5. Add Feedback (Mentor)
6. View Feedback (Student)
7. Delete Application (Student)
```

### Authorization Checks

```
1. Student tries to create feedback → 403 Forbidden
2. Mentor tries to create application → 403 Forbidden
3. Non-admin tries to assign mentor → 403 Forbidden
4. User tries to access another user's data → 403 Forbidden
```

### Validation Checks

```
1. Invalid email format → 400 Bad Request
2. Missing required fields → 400 Bad Request
3. Invalid enum values → 400 Bad Request
4. Password too weak → 400 Bad Request
```

---

## Interpreting Results

### Success Indicators

- **Green ✓**: Test passed successfully
- **Success Rate ≥ 90%**: Excellent
- **Success Rate 70-89%**: Good, but needs attention
- **Success Rate < 70%**: Critical issues present

### Failure Analysis

When tests fail, check:

1. **Server Status**: Is the server running?
   ```bash
   curl http://localhost:3001/health
   ```

2. **Database Connection**: Is PostgreSQL accessible?
   ```bash
   npm run db:status
   ```

3. **Environment Variables**: Are all required variables set?
   ```bash
   cat .env
   ```

4. **Recent Changes**: Did recent code changes break functionality?
   ```bash
   git diff HEAD~1
   ```

### Common Failure Patterns

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| Connection refused | Server not running | Start server with `npm run dev` |
| 401 Unauthorized | Token expired/invalid | Check JWT configuration |
| 403 Forbidden | RBAC misconfiguration | Review role permissions |
| 404 Not Found | Route not registered | Check `routes.ts` |
| 500 Internal Error | Server-side bug | Check server logs |

---

## Troubleshooting

### Test Script Issues

#### PowerShell Execution Policy

If you get "script cannot be loaded" error:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Bash Permission Denied

If you get "permission denied" error:

```bash
chmod +x test-e2e.sh
```

### API Issues

#### Server Not Responding

```bash
# Check if server is running
netstat -an | grep 3001

# Check server logs
cd server
npm run dev
```

#### Database Connection Failed

```bash
# Check PostgreSQL status
pg_isready

# Restart PostgreSQL
# Windows: Services → PostgreSQL
# Linux: sudo systemctl restart postgresql
# Mac: brew services restart postgresql
```

#### Authentication Failures

```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration settings
grep JWT_EXPIRES_IN .env
```

### Test Data Issues

#### Duplicate User Errors

If tests fail due to existing users:

```bash
# Clean test data
npm run db:reset
npm run db:migrate
npm run db:seed
```

#### Missing Admin User

If admin login fails:

```bash
# Seed admin user
npm run db:seed
```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: uimp_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd server
          npm ci
      
      - name: Setup database
        run: |
          cd server
          npm run db:migrate
          npm run db:seed
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/uimp_test
      
      - name: Start server
        run: |
          cd server
          npm run dev &
          sleep 10
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/uimp_test
          JWT_SECRET: test-secret-key
          NODE_ENV: test
      
      - name: Run E2E tests
        run: |
          cd server
          chmod +x test-e2e.sh
          ./test-e2e.sh
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: e2e-test-results
          path: server/test-results/
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
e2e-tests:
  stage: test
  image: node:18
  
  services:
    - postgres:15
  
  variables:
    POSTGRES_DB: uimp_test
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/uimp_test
    JWT_SECRET: test-secret-key
    NODE_ENV: test
  
  before_script:
    - cd server
    - npm ci
    - npm run db:migrate
    - npm run db:seed
  
  script:
    - npm run dev &
    - sleep 10
    - chmod +x test-e2e.sh
    - ./test-e2e.sh
  
  artifacts:
    when: always
    paths:
      - server/test-results/
    expire_in: 1 week
```

---

## Best Practices

### 1. Run Tests Regularly

- Before committing code
- Before creating pull requests
- After merging to main branch
- On scheduled intervals (nightly builds)

### 2. Maintain Test Data

- Use consistent test data
- Clean up after tests
- Avoid hardcoded IDs
- Use dynamic data generation

### 3. Monitor Test Performance

- Track test execution time
- Identify slow tests
- Optimize database queries
- Use parallel execution when possible

### 4. Keep Tests Updated

- Update tests when APIs change
- Add tests for new features
- Remove tests for deprecated features
- Document test changes

### 5. Isolate Test Environment

- Use separate test database
- Don't run tests on production
- Mock external services
- Use test-specific configuration

---

## Additional Testing

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### Load Tests

```bash
npm run test:load
```

### Security Tests

```bash
npm run test:security
```

---

## Support

For issues or questions:

1. Check server logs: `server/logs/`
2. Review API documentation: `Docs/API_CONTRACTS.md`
3. Check test output for specific error messages
4. Contact the backend team lead

---

## Changelog

### Version 1.0.0 (Current)
- Initial E2E test suite
- 45+ comprehensive tests
- PowerShell and Bash support
- CI/CD integration examples
- Comprehensive documentation

---

**Last Updated**: January 14, 2026
**Maintained By**: Backend Team (Heramb)
