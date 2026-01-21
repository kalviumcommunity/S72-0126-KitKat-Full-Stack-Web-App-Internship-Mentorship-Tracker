#!/usr/bin/env pwsh
# PowerShell script for running integration tests

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UIMP Integration Tests Runner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if test database is configured
if (-not $env:TEST_DATABASE_URL -and -not $env:DATABASE_URL) {
    Write-Host "⚠️  Warning: No test database URL configured" -ForegroundColor Yellow
    Write-Host "   Set TEST_DATABASE_URL or DATABASE_URL environment variable" -ForegroundColor Yellow
    Write-Host "   Example: postgresql://test:test@localhost:5432/uimp_test" -ForegroundColor Gray
    Write-Host ""
}

# Install dependencies if node_modules doesn't exist
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

# Generate Prisma client if needed
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Run integration tests
Write-Host "Running integration tests..." -ForegroundColor Yellow
Write-Host "Note: These tests require a test database connection" -ForegroundColor Gray
Write-Host ""

npm run test:integration

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ All integration tests passed!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Some integration tests failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Ensure test database is running and accessible" -ForegroundColor Gray
    Write-Host "2. Check TEST_DATABASE_URL environment variable" -ForegroundColor Gray
    Write-Host "3. Run 'npm run prisma:migrate' to apply migrations" -ForegroundColor Gray
    Write-Host "4. Ensure test database has proper permissions" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Integration Tests Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan