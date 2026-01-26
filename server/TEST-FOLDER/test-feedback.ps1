# PowerShell script to test Feedback API endpoints
# Tests mentor authorization and feedback CRUD operations

$BASE_URL = "http://localhost:3000/api"
$ContentType = "application/json"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Feedback API Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Variables to store tokens and IDs
$mentorToken = ""
$studentToken = ""
$adminToken = ""
$applicationId = ""
$feedbackId = ""

# Test 1: Login as Student
Write-Host "Test 1: Login as Student" -ForegroundColor Yellow
$loginBody = @{
    email = "student@test.com"
    password = "Student123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginBody -ContentType $ContentType
    $studentToken = $response.data.token
    Write-Host "✓ Student login successful" -ForegroundColor Green
    Write-Host "  Token: $($studentToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Student login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Login as Mentor
Write-Host "Test 2: Login as Mentor" -ForegroundColor Yellow
$loginBody = @{
    email = "mentor@test.com"
    password = "Mentor123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginBody -ContentType $ContentType
    $mentorToken = $response.data.token
    Write-Host "✓ Mentor login successful" -ForegroundColor Green
    Write-Host "  Token: $($mentorToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Mentor login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Login as Admin
Write-Host "Test 3: Login as Admin" -ForegroundColor Yellow
$loginBody = @{
    email = "admin@test.com"
    password = "Admin123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $loginBody -ContentType $ContentType
    $adminToken = $response.data.token
    Write-Host "✓ Admin login successful" -ForegroundColor Green
    Write-Host "  Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "✗ Admin login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Create an application as student (needed for feedback)
Write-Host "Test 4: Create Application as Student" -ForegroundColor Yellow
$applicationBody = @{
    company = "Test Company"
    role = "Software Engineer"
    platform = "LINKEDIN"
    status = "APPLIED"
    notes = "Test application for feedback"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $studentToken"
    "Content-Type" = $ContentType
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/applications" -Method Post -Body $applicationBody -Headers $headers
    $applicationId = $response.data.application.id
    Write-Host "✓ Application created successfully" -ForegroundColor Green
    Write-Host "  Application ID: $applicationId" -ForegroundColor Gray
} catch {
    Write-Host "✗ Application creation failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Student tries to create feedback (should fail)
Write-Host "Test 5: Student Tries to Create Feedback (Should Fail)" -ForegroundColor Yellow
$feedbackBody = @{
    applicationId = $applicationId
    content = "This should fail because students cannot create feedback"
    tags = @("RESUME")
    priority = "MEDIUM"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $studentToken"
    "Content-Type" = $ContentType
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback" -Method Post -Body $feedbackBody -Headers $headers
    Write-Host "✗ Student was able to create feedback (should have failed)" -ForegroundColor Red
} catch {
    Write-Host "✓ Student correctly denied from creating feedback" -ForegroundColor Green
    Write-Host "  Error: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 6: Mentor creates feedback
Write-Host "Test 6: Mentor Creates Feedback" -ForegroundColor Yellow
$feedbackBody = @{
    applicationId = $applicationId
    content = "Great application! Your resume looks professional. Consider adding more quantifiable achievements and specific technologies you've worked with. The cover letter is well-written."
    tags = @("RESUME", "COMMUNICATION")
    priority = "HIGH"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $mentorToken"
    "Content-Type" = $ContentType
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback" -Method Post -Body $feedbackBody -Headers $headers
    $feedbackId = $response.data.feedback.id
    Write-Host "✓ Feedback created successfully" -ForegroundColor Green
    Write-Host "  Feedback ID: $feedbackId" -ForegroundColor Gray
    Write-Host "  Content: $($response.data.feedback.content.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  Tags: $($response.data.feedback.tags -join ', ')" -ForegroundColor Gray
    Write-Host "  Priority: $($response.data.feedback.priority)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Feedback creation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Get feedback by ID as student
Write-Host "Test 7: Get Feedback by ID as Student" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $studentToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/$feedbackId" -Method Get -Headers $headers
    Write-Host "✓ Feedback retrieved successfully" -ForegroundColor Green
    Write-Host "  Mentor: $($response.data.feedback.mentor.firstName) $($response.data.feedback.mentor.lastName)" -ForegroundColor Gray
    Write-Host "  Application: $($response.data.feedback.application.company) - $($response.data.feedback.application.role)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to retrieve feedback: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: List all feedback as student
Write-Host "Test 8: List All Feedback as Student" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $studentToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback?page=1&limit=10" -Method Get -Headers $headers
    Write-Host "✓ Feedback list retrieved successfully" -ForegroundColor Green
    Write-Host "  Total feedback: $($response.data.pagination.total)" -ForegroundColor Gray
    Write-Host "  Items on page: $($response.data.items.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to list feedback: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 9: Get feedback for specific application
Write-Host "Test 9: Get Feedback for Specific Application" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $studentToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/application/$applicationId" -Method Get -Headers $headers
    Write-Host "✓ Application feedback retrieved successfully" -ForegroundColor Green
    Write-Host "  Feedback count: $($response.data.feedback.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to retrieve application feedback: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 10: Update feedback as mentor
Write-Host "Test 10: Update Feedback as Mentor" -ForegroundColor Yellow
$updateBody = @{
    content = "Updated feedback: Your resume is excellent! I've reviewed it again and noticed you've made great improvements. Keep up the good work!"
    priority = "MEDIUM"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $mentorToken"
    "Content-Type" = $ContentType
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/$feedbackId" -Method Patch -Body $updateBody -Headers $headers
    Write-Host "✓ Feedback updated successfully" -ForegroundColor Green
    Write-Host "  New content: $($response.data.feedback.content.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "  New priority: $($response.data.feedback.priority)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to update feedback: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 11: Student tries to update feedback (should fail)
Write-Host "Test 11: Student Tries to Update Feedback (Should Fail)" -ForegroundColor Yellow
$updateBody = @{
    content = "Student trying to update mentor's feedback"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $studentToken"
    "Content-Type" = $ContentType
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/$feedbackId" -Method Patch -Body $updateBody -Headers $headers
    Write-Host "✗ Student was able to update feedback (should have failed)" -ForegroundColor Red
} catch {
    Write-Host "✓ Student correctly denied from updating feedback" -ForegroundColor Green
    Write-Host "  Error: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}
Write-Host ""

# Test 12: Get feedback statistics
Write-Host "Test 12: Get Feedback Statistics" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $mentorToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/stats" -Method Get -Headers $headers
    Write-Host "✓ Feedback statistics retrieved successfully" -ForegroundColor Green
    Write-Host "  Total feedback: $($response.data.stats.total)" -ForegroundColor Gray
    Write-Host "  By priority: $($response.data.stats.byPriority | ConvertTo-Json -Compress)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to retrieve feedback statistics: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 13: Filter feedback by tags
Write-Host "Test 13: Filter Feedback by Tags" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $studentToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback?tags=RESUME&tags=COMMUNICATION" -Method Get -Headers $headers
    Write-Host "✓ Filtered feedback retrieved successfully" -ForegroundColor Green
    Write-Host "  Filtered results: $($response.data.items.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to filter feedback: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 14: Filter feedback by priority
Write-Host "Test 14: Filter Feedback by Priority" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $studentToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback?priority=HIGH&priority=MEDIUM" -Method Get -Headers $headers
    Write-Host "✓ Filtered feedback by priority retrieved successfully" -ForegroundColor Green
    Write-Host "  Filtered results: $($response.data.items.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Failed to filter feedback by priority: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 15: Delete feedback as mentor
Write-Host "Test 15: Delete Feedback as Mentor" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $mentorToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/$feedbackId" -Method Delete -Headers $headers
    Write-Host "✓ Feedback deleted successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to delete feedback: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 16: Verify feedback is deleted
Write-Host "Test 16: Verify Feedback is Deleted" -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $studentToken"
}

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/feedback/$feedbackId" -Method Get -Headers $headers
    Write-Host "✗ Feedback still exists (should have been deleted)" -ForegroundColor Red
} catch {
    Write-Host "✓ Feedback correctly deleted" -ForegroundColor Green
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Feedback API Tests Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
