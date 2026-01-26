#!/bin/bash

# Production Deployment Script for UIMP Backend
# This script prepares and deploys the backend for production

set -e  # Exit on any error

echo "🚀 Starting Production Deployment for UIMP Backend"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the server directory"
    exit 1
fi

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
    print_error "Production environment file (.env.production) not found"
    print_info "Please copy .env.production.template to .env.production and configure it"
    exit 1
fi

print_info "Step 1: Environment Validation"

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

# Validate required environment variables
required_vars=("DATABASE_URL" "JWT_SECRET" "REDIS_URL" "SMTP_HOST" "SMTP_USER" "SMTP_PASS")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    exit 1
fi

print_status "Environment variables validated"

# Check JWT secret strength
if [ ${#JWT_SECRET} -lt 32 ]; then
    print_error "JWT_SECRET must be at least 32 characters long for production"
    exit 1
fi

print_status "JWT secret strength validated"

# Check if NODE_ENV is set to production
if [ "$NODE_ENV" != "production" ]; then
    print_error "NODE_ENV must be set to 'production' in .env.production"
    exit 1
fi

print_status "NODE_ENV validated"

print_info "Step 2: Dependencies Installation"

# Install production dependencies
npm ci --only=production
print_status "Production dependencies installed"

print_info "Step 3: Database Setup"

# Generate Prisma client
npx prisma generate
print_status "Prisma client generated"

# Run database migrations
print_warning "Running database migrations..."
npx prisma migrate deploy
print_status "Database migrations completed"

print_info "Step 4: Build Application"

# Build TypeScript
npm run build
print_status "Application built successfully"

print_info "Step 5: Security Checks"

# Check for development-only configurations
if grep -q "OTP_TEST_EMAIL" .env.production; then
    print_warning "OTP_TEST_EMAIL found in production environment - this should be removed"
fi

if [ "$CORS_ORIGIN" = "http://localhost:3000" ]; then
    print_warning "CORS_ORIGIN is set to localhost - update for production domain"
fi

print_status "Security checks completed"

print_info "Step 6: Health Check"

# Start the server in background for health check
NODE_ENV=production npm start &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    # Test health endpoint
    if curl -f http://localhost:${PORT:-3001}/health > /dev/null 2>&1; then
        print_status "Health check passed"
    else
        print_error "Health check failed"
        kill $SERVER_PID
        exit 1
    fi
    
    # Stop the test server
    kill $SERVER_PID
    wait $SERVER_PID 2>/dev/null || true
else
    print_error "Server failed to start"
    exit 1
fi

print_info "Step 7: Production Readiness Summary"

echo ""
echo "🎉 Production Deployment Completed Successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  • Environment: $NODE_ENV"
echo "  • Port: ${PORT:-3001}"
echo "  • Database: Connected and migrated"
echo "  • Redis: ${REDIS_URL:0:20}..."
echo "  • Email: ${SMTP_HOST}"
echo "  • Storage: ${STORAGE_PROVIDER:-local}"
echo "  • CORS: ${CORS_ORIGIN}"
echo ""
echo "🚀 Next Steps:"
echo "  1. Start the production server: npm start"
echo "  2. Set up process manager (PM2): pm2 start dist/server.js --name uimp-backend"
echo "  3. Configure reverse proxy (Nginx)"
echo "  4. Set up SSL certificates"
echo "  5. Configure monitoring and logging"
echo ""
echo "📚 Documentation:"
echo "  • API Documentation: /api/docs (coming soon)"
echo "  • Health Check: /health"
echo "  • OTP System: docs/OTP_PASSWORD_RESET.md"
echo ""
echo "⚠️  Security Reminders:"
echo "  • Ensure firewall is configured"
echo "  • Keep dependencies updated"
echo "  • Monitor logs for security events"
echo "  • Regular database backups"
echo "  • SSL/TLS certificates are valid"
echo ""

print_status "Production deployment ready! 🎉"