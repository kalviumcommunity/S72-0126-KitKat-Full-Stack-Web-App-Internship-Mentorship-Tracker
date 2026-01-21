#!/bin/bash

# UIMP Backend Setup Script
# This script sets up the development environment

set -e

echo "🚀 Starting UIMP Backend Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created"
        echo "⚠️  Please edit .env and set your DATABASE_URL and JWT_SECRET"
    else
        echo "⚠️  .env.example not found. Creating basic .env..."
        cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/uimp_db?schema=public"
JWT_SECRET="change-this-to-a-secure-random-string-min-32-characters"
JWT_EXPIRES_IN="24h"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
EOF
        echo "✅ Basic .env file created"
        echo "⚠️  Please edit .env and update DATABASE_URL and JWT_SECRET"
    fi
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate
echo "✅ Prisma Client generated"
echo ""

# Check if database is accessible
echo "🔍 Checking database connection..."
if npm run prisma:migrate:deploy 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed. Make sure PostgreSQL is running."
    echo "   You can start it with: docker-compose up -d postgres"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate
echo "✅ Migrations applied"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed
echo "✅ Database seeded"
echo ""

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the development server: npm run dev"
echo "   2. Open Prisma Studio: npm run prisma:studio"
echo "   3. Check API documentation: server/API_CONTRACTS.md"
echo ""
echo "🔑 Test credentials (from seed data):"
echo "   Admin:   admin@uimp.com / Admin123!"
echo "   Mentor1: mentor1@uimp.com / Mentor123!"
echo "   Student1: student1@uimp.com / Student123!"
echo ""

