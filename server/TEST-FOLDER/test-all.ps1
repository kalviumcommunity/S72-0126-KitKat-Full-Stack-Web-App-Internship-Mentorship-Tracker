#!/usr/bin/env pwsh
# PowerShell script for running all tests (unit + integration + e2e)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UIMP Complete Test Suite Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test counters
$totalSuites = 0
$passedSuites = 0
$failedSuites = 0

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

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Run all test suites
Run-TestSuite -Name "Unit Tests" -Script ".\test-unit.ps1"
Run-TestSuite -Name "Integration Tests" -Script ".\test-integration.ps1"
Run-TestSuite -Name "End-to-End Tests" -Script ".\test-e2e.ps1"

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete Test Suite Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Test Suites:  $totalSuites" -ForegroundColor White
Write-Host "Passed:             $passedSuites" -ForegroundColor Green
Write-Host "Failed:             $failedSuites" -ForegroundColor Red

$successRate = [math]::Round(($passedSuites / $totalSuites) * 100, 2)
Write-Host "Success Rate:       $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })

if ($failedSuites -eq 0) {
    Write-Host ""
    Write-Host "🎉 All test suites passed!" -ForegroundColor Green
    Write-Host "Your code is ready for deployment!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host ""
    Write-Host "❌ Some test suites failed. Please review the output above." -ForegroundColor Red
    Write-Host "Fix the failing tests before deploying to production." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    exit 1
}