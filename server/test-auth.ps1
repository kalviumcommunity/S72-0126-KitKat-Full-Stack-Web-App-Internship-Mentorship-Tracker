# UIMP Authentication System Test Script (PowerShell)
# This script tests the authentication and RBAC system

$BaseUrl = "http://localhost:3001/api"
$CookieJar = "cookies.txt"

Write-Host "🚀 Testing UIMP Authentication System" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Clean up previous cookies
if (Test-Path $CookieJar) {
    Remove-Item $CookieJar
}

Write-Host ""
Write-Host "1. Testing Public Route (No Auth Required)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BaseUrl/auth-test/public" -Method Get
$response | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "2. Testing User Registration" -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow
$signupBody = @{
    email = "test-student@example.com"
    password = "password123"
    role = "STUDENT"
    firstName = "Test"
    lastName = "Student"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    $signupResponse | ConvertTo-Json -Depth 3
    Write-Host "✅ Signup successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Signup failed: $($_.Exception.Message)" -ForegroundColor Red
    $_.Exception.Response | ConvertTo-Json -Depth 3
}

Write-Host ""
Write-Host "3. Testing User Login" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow
$loginBody = @{
    email = "test-student@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -WebSession $session
    $loginResponse | ConvertTo-Json -Depth 3
    Write-Host "✅ Login successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4. Testing Protected Route (Auth Required)" -ForegroundColor Yellow
Write-Host "-----------------------------------------" -ForegroundColor Yellow
try {
    $meResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method Get -WebSession $session
    $meResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Protected route failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Testing Role-Based Access Control" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Yellow

Write-Host "Testing Student-only route:"
try {
    $studentResponse = Invoke-RestMethod -Uri "$BaseUrl/auth-test/student-only" -Method Get -WebSession $session
    $studentResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Student route failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing Mentor-only route (should fail):"
try {
    $mentorResponse = Invoke-RestMethod -Uri "$BaseUrl/auth-test/mentor-only" -Method Get -WebSession $session
    $mentorResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ Correctly blocked mentor route for student" -ForegroundColor Green
}

Write-Host ""
Write-Host "Testing Admin-only route (should fail):"
try {
    $adminResponse = Invoke-RestMethod -Uri "$BaseUrl/auth-test/admin-only" -Method Get -WebSession $session
    $adminResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✅ Correctly blocked admin route for student" -ForegroundColor Green
}

Write-Host ""
Write-Host "6. Testing Token Information" -ForegroundColor Yellow
Write-Host "---------------------------" -ForegroundColor Yellow
try {
    $tokenResponse = Invoke-RestMethod -Uri "$BaseUrl/auth-test/token-info" -Method Get -WebSession $session
    $tokenResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Token info failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "7. Testing Role Hierarchy" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow
try {
    $roleResponse = Invoke-RestMethod -Uri "$BaseUrl/auth-test/role-info" -Method Get -WebSession $session
    $roleResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Role info failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "8. Testing Logout" -ForegroundColor Yellow
Write-Host "----------------" -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/logout" -Method Post -WebSession $session
    $logoutResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Logout failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "9. Testing Access After Logout (should fail)" -ForegroundColor Yellow
Write-Host "--------------------------------------------" -ForegroundColor Yellow
try {
    $afterLogoutResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method Get -WebSession $session
    $afterLogoutResponse | ConvertTo-Json -Depth 3
    Write-Host "❌ Should have failed after logout" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly blocked access after logout" -ForegroundColor Green
}

Write-Host ""
Write-Host "10. Testing Rate Limiting (Login Attempts)" -ForegroundColor Yellow
Write-Host "------------------------------------------" -ForegroundColor Yellow
Write-Host "Making 6 failed login attempts to trigger rate limiting..."

$wrongLoginBody = @{
    email = "test-student@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

for ($i = 1; $i -le 6; $i++) {
    Write-Host "Attempt $i:"
    try {
        $failResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $wrongLoginBody -ContentType "application/json"
        Write-Host $failResponse.message
    } catch {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $responseBody = $reader.ReadToEnd() | ConvertFrom-Json
        Write-Host $responseBody.error.message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Authentication system test completed!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "To test with different roles, create users with MENTOR or ADMIN roles:" -ForegroundColor Cyan
Write-Host "Invoke-RestMethod -Uri '$BaseUrl/auth/signup' -Method Post -Body '{\"email\":\"mentor@example.com\",\"password\":\"password123\",\"role\":\"MENTOR\"}' -ContentType 'application/json'" -ForegroundColor Gray
Write-Host "Invoke-RestMethod -Uri '$BaseUrl/auth/signup' -Method Post -Body '{\"email\":\"admin@example.com\",\"password\":\"password123\",\"role\":\"ADMIN\"}' -ContentType 'application/json'" -ForegroundColor Gray