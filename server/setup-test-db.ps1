#!/usr/bin/env pwsh
# PowerShell script for setting up test database

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UIMP Test Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load test environment
if (Test-Path ".env.test") {
    Write-Host "Loading test environment variables..." -ForegroundColor Yellow
    Get-Content ".env.test" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "✓ Test environment loaded" -ForegroundColor Green
} else {
    Write-Host "✗ .env.test file not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if PostgreSQL is available
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL available: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ PostgreSQL not found in PATH. Assuming Docker or remote database." -ForegroundColor Yellow
}

Write-Host ""

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Migration failed. This might be expected for a fresh test database." -ForegroundColor Yellow
    Write-Host "Attempting to create and migrate..." -ForegroundColor Yellow
    
    # Try to create the database and run migrations
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to create test database" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✓ Database migrations completed" -ForegroundColor Green

# Seed test data (optional)
if (Test-Path "prisma/seed.ts") {
    Write-Host "Seeding test database..." -ForegroundColor Yellow
    npx prisma db seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠ Database seeding failed (this might be expected for tests)" -ForegroundColor Yellow
    } else {
        Write-Host "✓ Database seeded" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Database Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run tests with:" -ForegroundColor White
Write-Host "  .\test-unit.ps1" -ForegroundColor Cyan
Write-Host "  .\test-integration.ps1" -ForegroundColor Cyan
Write-Host "  .\test-e2e.ps1" -ForegroundColor Cyan
Write-Host "  .\test-all.ps1" -ForegroundColor Cyan
Write-Host ""