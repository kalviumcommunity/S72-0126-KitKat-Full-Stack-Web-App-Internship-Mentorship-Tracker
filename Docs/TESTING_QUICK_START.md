# Testing Quick Start Guide

## 🚀 Run Tests in 3 Steps

### Step 1: Start Server
```bash
cd server
npm run dev
```

### Step 2: Open New Terminal
```bash
cd server
```

### Step 3: Run Tests

**Windows:**
```powershell
.\run-all-tests.ps1
```

**Linux/Mac:**
```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

---

## 📋 Individual Test Suites

### End-to-End Tests (45+ tests)

**Windows:**
```powershell
.\test-e2e.ps1
```

**Linux/Mac:**
```bash
./test-e2e.sh
```

### Feedback API Tests (15+ tests)

**Windows:**
```powershell
.\test-feedback.ps1
```

**Linux/Mac:**
```bash
./test-feedback.sh
```

---

## ✅ Expected Results

```
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

## 🔧 Troubleshooting

### Server Not Running
```bash
# Start server
npm run dev
```

### Database Issues
```bash
# Reset and setup database
npm run db:reset
npm run db:migrate
npm run db:seed
```

### Permission Denied (Linux/Mac)
```bash
# Make scripts executable
chmod +x test-e2e.sh
chmod +x test-feedback.sh
chmod +x run-all-tests.sh
```

### PowerShell Execution Policy (Windows)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📚 Full Documentation

- [TESTING_OVERVIEW.md](./TESTING_OVERVIEW.md) - Complete testing strategy
- [E2E_TESTING_GUIDE.md](./E2E_TESTING_GUIDE.md) - Detailed E2E guide
- [FEEDBACK_API.md](./FEEDBACK_API.md) - Feedback API documentation

---

## 🎯 Test Coverage

| Feature | Tests | Status |
|---------|-------|--------|
| Authentication | 6 | ✅ |
| User Management | 2 | ✅ |
| Applications | 5 | ✅ |
| Mentor Assignment | 1 | ✅ |
| Feedback | 20 | ✅ |
| Authorization | 5 | ✅ |
| Validation | 4 | ✅ |
| Pagination | 4 | ✅ |
| Filtering | 6 | ✅ |
| Sorting | 3 | ✅ |
| Rate Limiting | 5 | ✅ |
| Error Handling | 5 | ✅ |
| **Total** | **60+** | ✅ |

---

## 💡 Pro Tips

1. **Run tests before committing**: Catch bugs early
2. **Check server logs**: If tests fail, check `server/logs/`
3. **Clean test data**: Use `npm run db:reset` if needed
4. **Monitor performance**: Tests should complete in 2-3 minutes
5. **CI/CD ready**: Tests work in automated pipelines

---

**Need Help?** Check [TESTING_OVERVIEW.md](./TESTING_OVERVIEW.md) for detailed guidance.
