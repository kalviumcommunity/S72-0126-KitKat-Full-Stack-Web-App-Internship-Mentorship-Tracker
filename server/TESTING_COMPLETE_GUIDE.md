# Complete Testing Guide for UIMP Backend

This guide provides comprehensive information about testing the UIMP (Unified Internship & Mentorship Portal) backend API.

## 📋 Table of Contents

1. [Test Types](#test-types)
2. [Test Setup](#test-setup)
3. [Running Tests](#running-tests)
4. [Test Scripts](#test-scripts)
5. [Test Structure](#test-structure)
6. [Coverage Reports](#coverage-reports)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

## 🧪 Test Types

### Unit Tests
- **Location**: `tests/unit/`
- **Purpose**: Test individual functions, services, and utilities in isolation
- **Coverage**: Services, middleware, utilities, helpers
- **Mocking**: External dependencies (database, Redis, email, storage)

### Integration Tests
- **Location**: `tests/integration/`
- **Purpose**: Test API endpoints with real HTTP requests
- **Coverage**: Complete request/response cycles, authentication, authorization
- **Database**: Uses test database with real Prisma operations

### End-to-End Tests
- **Location**: Root directory (`test-e2e.ps1`, `test-e2e.sh`)
- **Purpose**: Test complete user workflows across multiple endpoints
- **Coverage**: Real-world scenarios, data persistence, business logic

## 🛠 Test Setup

### Prerequisites

1. **Node.js** (v20+)
2. **PostgreSQL** (for test database)
3. **npm** or **yarn**

### Database Setup

#### Option 1: Automated Setup
```bash
# PowerShell (Windows)
.\setup-test-db.ps1

# Bash (Linux/Mac)
./setup-test-db.sh
```

#### Option 2: Manual Setup
```bash
# 1. Create test database
createdb uimp_test

# 2. Set environment variables
export DATABASE_URL="postgresql://username:password@localhost:5432/uimp_test"

# 3. Run migrations
npx prisma migrate deploy

# 4. Generate Prisma client
npx prisma generate
```

### Environment Configuration

Create `.env.test` file (already provided):
```env
NODE_ENV=test
DATABASE_URL="postgresql://test:test@localhost:5432/uimp_test"
JWT_SECRET="test-jwt-secret-key-for-testing-only-min-32-chars"
# ... other test configurations
```

## 🚀 Running Tests

### Quick Start
```bash
# Install dependencies
npm install

# Setup test database
.\setup-test-db.ps1  # Windows
./setup-test-db.sh   # Linux/Mac

# Run all tests
.\test-all.ps1       # Windows
./test-all.sh        # Linux/Mac
```

### Individual Test Suites

#### Unit Tests
```bash
# PowerShell
.\test-unit.ps1

# Bash
./test-unit.sh

# npm script
npm run test:unit
```

#### Integration Tests
```bash
# PowerShell
.\test-integration.ps1

# Bash
./test-integration.sh

# npm script
npm run test:integration
```

#### End-to-End Tests
```bash
# PowerShell
.\test-e2e.ps1

# Bash
./test-e2e.sh
```

### Coverage Reports
```bash
# PowerShell
.\test-coverage.ps1

# Bash
./test-coverage.sh

# npm script
npm run test:coverage
```

## 📜 Test Scripts

### PowerShell Scripts (Windows)
- `test-all.ps1` - Run all test suites
- `test-unit.ps1` - Run unit tests only
- `test-integration.ps1` - Run integration tests only
- `test-e2e.ps1` - Run end-to-end tests
- `test-coverage.ps1` - Generate coverage reports
- `setup-test-db.ps1` - Setup test database

### Bash Scripts (Linux/Mac)
- `test-all.sh` - Run all test suites
- `test-unit.sh` - Run unit tests only
- `test-integration.sh` - Run integration tests only
- `test-e2e.sh` - Run end-to-end tests
- `test-coverage.sh` - Generate coverage reports
- `setup-test-db.sh` - Setup test database

### npm Scripts
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage --watchAll=false",
  "test:unit": "jest --testPathPattern=unit --watchAll=false",
  "test:integration": "jest --testPathPattern=integration --watchAll=false",
  "test:all": "jest --watchAll=false",
  "test:ci": "jest --ci --coverage --watchAll=false --maxWorkers=1",
  "test:debug": "jest --detectOpenHandles --forceExit --verbose",
  "test:clean": "jest --clearCache && rm -rf coverage"
}
```

## 🏗 Test Structure

### Directory Layout
```
server/
├── tests/
│   ├── setup.ts                 # Global test configuration
│   ├── utils/
│   │   └── test-helpers.ts      # Test utilities and factories
│   ├── unit/
│   │   ├── auth.service.test.ts
│   │   ├── application.service.test.ts
│   │   ├── feedback.service.test.ts
│   │   ├── middleware.test.ts
│   │   └── utils.test.ts
│   └── integration/
│       ├── auth.integration.test.ts
│       ├── application.integration.test.ts
│       └── feedback.integration.test.ts
├── test-*.ps1                  # PowerShell test runners
├── test-*.sh                   # Bash test runners
└── jest.config.js              # Jest configuration
```

### Test Utilities

#### TestDataFactory
```typescript
// Create test users
const student = await TestDataFactory.createTestUser(UserRole.STUDENT);
const mentor = await TestDataFactory.createTestUser(UserRole.MENTOR);

// Create test applications
const application = await TestDataFactory.createTestApplication(student.id);

// Create test feedback
const feedback = await TestDataFactory.createTestFeedback(mentor.id, application.id);
```

#### Assertion Helpers
```typescript
// API success assertions
expectApiSuccess(response, 200);

// API error assertions
expectApiError(response, 400, 'VALIDATION_ERROR');

// Validation error assertions
expectValidationError(response, 'email');
```

## 📊 Coverage Reports

### Coverage Targets
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Coverage Exclusions
- Type definitions (`*.d.ts`)
- Server entry point (`server.ts`)
- Configuration files (`config/`)
- Type definitions (`types/`)

### Report Formats
- **Console**: Real-time coverage summary
- **HTML**: Interactive coverage report (`coverage/lcov-report/index.html`)
- **LCOV**: Machine-readable format (`coverage/lcov.info`)

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: uimp_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Setup test database
        run: ./setup-test-db.sh
        
      - name: Run tests with coverage
        run: npm run test:ci
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
```

### Test Commands for CI
```bash
# CI-optimized test run
npm run test:ci

# Parallel test execution (if supported)
npm run test:ci -- --maxWorkers=4

# Generate coverage for external tools
npm run test:coverage -- --coverageReporters=lcov
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check PostgreSQL is running
pg_isready

# Verify connection string
echo $DATABASE_URL

# Reset test database
dropdb uimp_test && createdb uimp_test
npx prisma migrate deploy
```

#### Port Conflicts
```bash
# Check if port is in use
netstat -an | grep :3002

# Kill process using port
lsof -ti:3002 | xargs kill -9
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Run tests with limited workers
npm test -- --maxWorkers=1
```

#### Jest Cache Issues
```bash
# Clear Jest cache
npm run test:clean

# Or manually
npx jest --clearCache
rm -rf coverage
```

### Debug Mode

#### Enable Verbose Logging
```bash
# Run with debug output
npm run test:debug

# Enable SQL logging
export DEBUG="prisma:query"
npm test
```

#### Debug Specific Tests
```bash
# Run single test file
npx jest tests/unit/auth.service.test.ts

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand tests/unit/auth.service.test.ts
```

### Performance Optimization

#### Faster Test Runs
```bash
# Skip coverage for faster runs
npm test -- --coverage=false

# Run tests in parallel
npm test -- --maxWorkers=4

# Run only changed files
npm test -- --onlyChanged
```

#### Memory Optimization
```bash
# Limit memory usage
npm test -- --logHeapUsage --maxWorkers=2

# Force garbage collection
npm test -- --expose-gc
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [Node.js Testing Best Practices](https://github.com/goldbergyoni/nodebestpractices#-6-testing-and-overall-quality-practices)

## 🎯 Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Data Cleanup**: Always clean up test data after each test
3. **Mocking**: Mock external dependencies (email, storage, Redis)
4. **Assertions**: Use descriptive assertions and error messages
5. **Coverage**: Aim for high coverage but focus on critical paths
6. **Performance**: Keep tests fast and efficient
7. **Documentation**: Document complex test scenarios and edge cases

---

For more specific testing guides, see:
- [E2E Testing Guide](../Docs/E2E_TESTING_GUIDE.md)
- [Testing Overview](../Docs/TESTING_OVERVIEW.md)
- [Testing Quick Start](../Docs/TESTING_QUICK_START.md)