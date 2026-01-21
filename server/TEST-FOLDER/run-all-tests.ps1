#!/usr/bin/env pwsh
# Master test runner for Windows PowerShell
# Runs all available test suites

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UIMP Complete Test Suite Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test counters
$totalSuites = 0
$passedSuites = 0
$failedSuites = 0

# Check if server is running
Write-Host "Checking server status..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -ErrorAction Stop
    Write-Host "✓ Server is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Server is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the server first:" -ForegroundColor Yellow
    Write-Host "  cd server" -ForegroundColor Gray
    Write-Host "  npm run dev" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""

# Function to run a test suite
function Run-TestSuite {
    param(
        [string]$Name,
        [string]$Script
    )
    
    $script:totalSuites++
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Running: $Name" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        & $Script
        if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) {
            Write-Host ""
            Write-Host "✓ $Name completed successfully" -ForegroundColor Green
            $script:passedSuites++
        } else {
            Write-Host ""
            Write-Host "✗ $Name failed" -ForegroundColor Red
            $script:failedSuites++
        }
    } catch {
        Write-Host ""
        Write-Host "✗ $Name failed with error: $($_.Exception.Message)" -ForegroundColor Red
        $script:failedSuites++
    }
    
    Write-Host ""
}

# Run all test suites
Run-TestSuite -Name "End-to-End Tests" -Script ".\test-e2e.ps1"
Run-TestSuite -Name "Feedback API Tests" -Script ".\test-feedback.ps1"

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete Test Suite Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Test Suites:  $totalSuites" -ForegroundColor White
Write-Host "Passed:             $passedSuites" -ForegroundColor Green
Write-Host "Failed:             $failedSuites" -ForegroundColor Red

if ($failedSuites -eq 0) {
    Write-Host ""
    Write-Host "✓ All test suites passed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host ""
    Write-Host "✗ Some test suites failed. Please review the output above." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    exit 1
}
