# PowerShell script for End-to-End API Verification
# Tests all major API endpoints and features

$BASE_URL = "http://localhost:3001/api"
$ContentType = "application/json"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "End-to-End API Verification Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test counters
$totalTests = 0
$passedTests = 0
$failedTests = 0

# Variables to store tokens and IDs
$studentToken = ""
$mentorToken = ""
$adminToken = ""
$studentId = ""
$mentorId = ""
$applicationId = ""
$feedbackId = ""

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    $script:totalTests++
    Write-Host "Test $totalTests`: $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = $ContentType
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        if ($response.success) {
            Write-Host "  ✓ PASSED" -ForegroundColor Green
            $script:passedTests++
            return $response
        } else {
            Write-Host "  ✗ FAILED: Response not successful" -ForegroundColor Red
            $script:failedTests++
            return $null
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  ✓ PASSED (Expected error: $statusCode)" -ForegroundColor Green
            $script:passedTests++
        } else {
            Write-Host "  ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
            $script:failedTests++
        }
        return $null
    }
}

# ============================================
# 1. HEALTH CHECK
# ============================================
Write-Host "`n=== 1. Health Check ===" -ForegroundColor Cyan
Test-Endpoint -Name "Health Check" -Method "GET" -Url "$BASE_URL/../health"

# ============================================
# 2. AUTHENTICATION TESTS
# ============================================
Write-Host "`n=== 2. Authentication Tests ===" -ForegroundColor Cyan

# Register Student
$signupBody = @{
    email = "e2e-student@test.com"
    password = "Student123!"
    confirmPassword = "Student123!"
    firstName = "E2E"
    lastName = "Student"
    role = "STUDENT"
} | ConvertTo-Json

$response = Test-Endpoint -Name "Register Student" -Method "POST" -Url "$BASE_URL/auth/signup" -Body $signupBody -ExpectedStatus 201
if ($response) {
    $studentId = $response.data.user.id
}

# Register Mentor
$signupBody = @{
    email = "e2e-mentor@test.com"
    password = "Mentor123!"
    confirmPassword = "Mentor123!"
    firstName = "E2E"
    lastName = "Mentor"
    role = "MENTOR"
} | ConvertTo-Json

$response = Test-Endpoint -Name "Register Mentor" -Method "POST" -Url "$BASE_URL/auth/signup" -Body $signupBody -ExpectedStatus 201
if ($response) {
    $mentorId = $response.data.user.id
}

# Login Student
$loginBody = @{
    email = "e2e-student@test.com"
    password = "Student123!"
} | ConvertTo-Json

$response = Test-Endpoint -Name "Login Student" -Method "POST" -Url "$BASE_URL/auth/login" -Body $loginBody
if ($response) {
    $studentToken = $response.data.token
}

# Login Mentor
$loginBody = @{
    email = "e2e-mentor@test.com"
    password = "Mentor123!"
} | ConvertTo-Json

$response = Test-Endpoint -Name "Login Mentor" -Method "POST" -Url "$BASE_URL/auth/login" -Body $loginBody
if ($response) {
    $mentorToken = $response.data.token
}

# Login Admin (assuming seeded)
$loginBody = @{
    email = "admin@test.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Test-Endpoint -Name "Login Admin" -Method "POST" -Url "$BASE_URL/auth/login" -Body $loginBody
if ($response) {
    $adminToken = $response.data.token
}

# ============================================
# 3. USER MANAGEMENT TESTS
# ============================================
Write-Host "`n=== 3. User Management Tests ===" -ForegroundColor Cyan

$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Get Current User Profile" -Method "GET" -Url "$BASE_URL/users/me" -Headers $headers

$headers = @{ "Authorization" = "Bearer $adminToken" }
Test-Endpoint -Name "List All Users (Admin)" -Method "GET" -Url "$BASE_URL/users" -Headers $headers

# ============================================
# 4. APPLICATION CRUD TESTS
# ============================================
Write-Host "`n=== 4. Application CRUD Tests ===" -ForegroundColor Cyan

# Create Application
$appBody = @{
    company = "E2E Test Corp"
    role = "Software Engineer"
    platform = "LINKEDIN"
    status = "APPLIED"
    notes = "End-to-end test application"
    appliedDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $studentToken" }
$response = Test-Endpoint -Name "Create Application" -Method "POST" -Url "$BASE_URL/applications" -Headers $headers -Body $appBody -ExpectedStatus 201
if ($response) {
    $applicationId = $response.data.application.id
}

# Get Application
Test-Endpoint -Name "Get Application by ID" -Method "GET" -Url "$BASE_URL/applications/$applicationId" -Headers $headers

# List Applications
Test-Endpoint -Name "List Applications" -Method "GET" -Url "$BASE_URL/applications?page=1&limit=10" -Headers $headers

# Update Application
$updateBody = @{
    status = "INTERVIEW"
    notes = "Updated to interview stage"
} | ConvertTo-Json

Test-Endpoint -Name "Update Application" -Method "PATCH" -Url "$BASE_URL/applications/$applicationId" -Headers $headers -Body $updateBody

# Get Application Stats
Test-Endpoint -Name "Get Application Statistics" -Method "GET" -Url "$BASE_URL/applications/stats" -Headers $headers

# ============================================
# 5. MENTOR ASSIGNMENT TESTS
# ============================================
Write-Host "`n=== 5. Mentor Assignment Tests ===" -ForegroundColor Cyan

# Assign Mentor (Admin only)
$assignBody = @{
    mentorId = $mentorId
    studentId = $studentId
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $adminToken" }
Test-Endpoint -Name "Assign Mentor to Student" -Method "POST" -Url "$BASE_URL/users/mentor-assignments" -Headers $headers -Body $assignBody -ExpectedStatus 201

# ============================================
# 6. FEEDBACK TESTS
# ============================================
Write-Host "`n=== 6. Feedback Tests ===" -ForegroundColor Cyan

# Create Feedback (Mentor)
$feedbackBody = @{
    applicationId = $applicationId
    content = "Great application! Your resume is well-structured. Consider adding more quantifiable achievements and specific technologies you've worked with."
    tags = @("RESUME", "COMMUNICATION")
    priority = "HIGH"
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $mentorToken" }
$response = Test-Endpoint -Name "Create Feedback (Mentor)" -Method "POST" -Url "$BASE_URL/feedback" -Headers $headers -Body $feedbackBody -ExpectedStatus 201
if ($response) {
    $feedbackId = $response.data.feedback.id
}

# Get Feedback
Test-Endpoint -Name "Get Feedback by ID" -Method "GET" -Url "$BASE_URL/feedback/$feedbackId" -Headers $headers

# List Feedback
Test-Endpoint -Name "List Feedback" -Method "GET" -Url "$BASE_URL/feedback?page=1&limit=10" -Headers $headers

# Get Feedback for Application
$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Get Application Feedback" -Method "GET" -Url "$BASE_URL/feedback/application/$applicationId" -Headers $headers

# Get Feedback Stats
Test-Endpoint -Name "Get Feedback Statistics" -Method "GET" -Url "$BASE_URL/feedback/stats" -Headers $headers

# ============================================
# 7. AUTHORIZATION TESTS
# ============================================
Write-Host "`n=== 7. Authorization Tests ===" -ForegroundColor Cyan

# Student tries to create feedback (should fail)
$feedbackBody = @{
    applicationId = $applicationId
    content = "This should fail"
    tags = @("RESUME")
    priority = "LOW"
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Student Cannot Create Feedback" -Method "POST" -Url "$BASE_URL/feedback" -Headers $headers -Body $feedbackBody -ExpectedStatus 403

# Mentor tries to create application (should fail)
$appBody = @{
    company = "Test"
    role = "Test"
    platform = "LINKEDIN"
    status = "DRAFT"
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $mentorToken" }
Test-Endpoint -Name "Mentor Cannot Create Application" -Method "POST" -Url "$BASE_URL/applications" -Headers $headers -Body $appBody -ExpectedStatus 403

# ============================================
# 8. VALIDATION TESTS
# ============================================
Write-Host "`n=== 8. Validation Tests ===" -ForegroundColor Cyan

# Invalid email format
$invalidBody = @{
    email = "invalid-email"
    password = "Test123!"
} | ConvertTo-Json

Test-Endpoint -Name "Invalid Email Format" -Method "POST" -Url "$BASE_URL/auth/login" -Body $invalidBody -ExpectedStatus 400

# Missing required fields
$invalidBody = @{
    company = "Test"
} | ConvertTo-Json

$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Missing Required Fields" -Method "POST" -Url "$BASE_URL/applications" -Headers $headers -Body $invalidBody -ExpectedStatus 400

# ============================================
# 9. PAGINATION TESTS
# ============================================
Write-Host "`n=== 9. Pagination Tests ===" -ForegroundColor Cyan

$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Pagination - Page 1" -Method "GET" -Url "$BASE_URL/applications?page=1&limit=5" -Headers $headers
Test-Endpoint -Name "Pagination - Page 2" -Method "GET" -Url "$BASE_URL/applications?page=2&limit=5" -Headers $headers

# ============================================
# 10. FILTERING TESTS
# ============================================
Write-Host "`n=== 10. Filtering Tests ===" -ForegroundColor Cyan

$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Filter by Status" -Method "GET" -Url "$BASE_URL/applications?status=INTERVIEW" -Headers $headers
Test-Endpoint -Name "Filter by Platform" -Method "GET" -Url "$BASE_URL/applications?platform=LINKEDIN" -Headers $headers
Test-Endpoint -Name "Search by Company" -Method "GET" -Url "$BASE_URL/applications?search=E2E" -Headers $headers

# ============================================
# 11. SORTING TESTS
# ============================================
Write-Host "`n=== 11. Sorting Tests ===" -ForegroundColor Cyan

$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Sort by Created Date (Desc)" -Method "GET" -Url "$BASE_URL/applications?sortBy=createdAt&sortOrder=desc" -Headers $headers
Test-Endpoint -Name "Sort by Company (Asc)" -Method "GET" -Url "$BASE_URL/applications?sortBy=company&sortOrder=asc" -Headers $headers

# ============================================
# 12. RATE LIMITING TESTS
# ============================================
Write-Host "`n=== 12. Rate Limiting Tests ===" -ForegroundColor Cyan

Write-Host "  Testing rate limits (this may take a moment)..." -ForegroundColor Gray
$headers = @{ "Authorization" = "Bearer $studentToken" }
for ($i = 1; $i -le 5; $i++) {
    Test-Endpoint -Name "Rate Limit Test $i" -Method "GET" -Url "$BASE_URL/applications" -Headers $headers
}

# ============================================
# 13. ERROR HANDLING TESTS
# ============================================
Write-Host "`n=== 13. Error Handling Tests ===" -ForegroundColor Cyan

# Non-existent resource
$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "404 - Non-existent Application" -Method "GET" -Url "$BASE_URL/applications/00000000-0000-0000-0000-000000000000" -Headers $headers -ExpectedStatus 404

# Unauthorized access
Test-Endpoint -Name "401 - No Token" -Method "GET" -Url "$BASE_URL/applications" -ExpectedStatus 401

# Invalid token
$headers = @{ "Authorization" = "Bearer invalid-token" }
Test-Endpoint -Name "401 - Invalid Token" -Method "GET" -Url "$BASE_URL/applications" -Headers $headers -ExpectedStatus 401

# ============================================
# 14. CLEANUP TESTS
# ============================================
Write-Host "`n=== 14. Cleanup Tests ===" -ForegroundColor Cyan

# Delete Feedback
$headers = @{ "Authorization" = "Bearer $mentorToken" }
Test-Endpoint -Name "Delete Feedback" -Method "DELETE" -Url "$BASE_URL/feedback/$feedbackId" -Headers $headers

# Delete Application
$headers = @{ "Authorization" = "Bearer $studentToken" }
Test-Endpoint -Name "Delete Application" -Method "DELETE" -Url "$BASE_URL/applications/$applicationId" -Headers $headers

# ============================================
# SUMMARY
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests:  $totalTests" -ForegroundColor White
Write-Host "Passed:       $passedTests" -ForegroundColor Green
Write-Host "Failed:       $failedTests" -ForegroundColor Red

$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

if ($failedTests -eq 0) {
    Write-Host "`n✓ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n✗ Some tests failed. Please review the output above." -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
