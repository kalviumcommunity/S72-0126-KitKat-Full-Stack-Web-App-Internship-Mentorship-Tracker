#!/usr/bin/env pwsh
# PowerShell script for running tests with coverage reporting

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UIMP Test Coverage Report" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
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

# Clean previous coverage reports
if (Test-Path "coverage") {
    Write-Host "Cleaning previous coverage reports..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "coverage"
    Write-Host "✓ Previous coverage cleaned" -ForegroundColor Green
}

Write-Host ""

# Run tests with coverage
Write-Host "Running tests with coverage..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

npm run test:coverage
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Tests failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Coverage Report Generated!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if coverage directory exists
if (Test-Path "coverage") {
    Write-Host "Coverage reports available:" -ForegroundColor White
    Write-Host "  Text Report: See output above" -ForegroundColor Cyan
    Write-Host "  HTML Report: coverage/lcov-report/index.html" -ForegroundColor Cyan
    Write-Host "  LCOV Report: coverage/lcov.info" -ForegroundColor Cyan
    Write-Host ""
    
    # Try to open HTML report
    $htmlReport = "coverage/lcov-report/index.html"
    if (Test-Path $htmlReport) {
        Write-Host "Opening HTML coverage report..." -ForegroundColor Yellow
        try {
            Start-Process $htmlReport
            Write-Host "✓ HTML report opened in browser" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Could not open HTML report automatically" -ForegroundColor Yellow
            Write-Host "Please open: $htmlReport" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⚠ Coverage directory not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Coverage analysis complete!" -ForegroundColor Green