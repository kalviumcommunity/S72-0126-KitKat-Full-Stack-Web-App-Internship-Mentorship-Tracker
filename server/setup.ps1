# UIMP Backend Setup Script (PowerShell)
# This script sets up the development environment

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting UIMP Backend Setup..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "✅ .env file created from .env.example" -ForegroundColor Green
    } else {
        Write-Host "⚠️  .env.example not found. Creating basic .env..." -ForegroundColor Yellow
        @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uimp_db?schema=public"
JWT_SECRET="change-this-to-a-secure-random-string-min-32-characters"
JWT_EXPIRES_IN="24h"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
"@ | Out-File -FilePath .env -Encoding utf8
        Write-Host "✅ Basic .env file created" -ForegroundColor Green
    }
    Write-Host "⚠️  Please edit .env and set your DATABASE_URL and JWT_SECRET" -ForegroundColor Yellow
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Cyan
npm run prisma:generate
Write-Host "✅ Prisma Client generated" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
npm run prisma:migrate
Write-Host "✅ Migrations applied" -ForegroundColor Green
Write-Host ""

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npm run prisma:seed
Write-Host "✅ Database seeded" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Start the development server: npm run dev"
Write-Host "   2. Open Prisma Studio: npm run prisma:studio"
Write-Host "   3. Check API documentation: server/API_CONTRACTS.md"
Write-Host ""
Write-Host "🔑 Test credentials (from seed data):" -ForegroundColor Yellow
Write-Host "   Admin:   admin@uimp.com / Admin123!"
Write-Host "   Mentor1: mentor1@uimp.com / Mentor123!"
Write-Host "   Student1: student1@uimp.com / Student123!"
Write-Host ""

