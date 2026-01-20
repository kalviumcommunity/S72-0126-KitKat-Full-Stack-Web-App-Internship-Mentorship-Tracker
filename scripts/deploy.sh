#!/bin/bash

# UIMP Production Deployment Script
# This script handles the complete deployment process for the UIMP application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_FILE="$PROJECT_ROOT/deployment.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed and running
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker is not running. Please start Docker service."
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not available. Please install Docker Compose."
    fi
    
    # Check if .env.production exists
    if [ ! -f "$PROJECT_ROOT/.env.production" ]; then
        error ".env.production file not found. Please create it from .env.production.example"
    fi
    
    success "Prerequisites check passed"
}

# Create backup of current deployment
create_backup() {
    log "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    BACKUP_NAME="backup_$(date +'%Y%m%d_%H%M%S')"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
    
    # Backup database
    if docker ps | grep -q "uimp-postgres-prod"; then
        log "Backing up database..."
        docker exec uimp-postgres-prod pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$BACKUP_PATH.sql"
        success "Database backup created: $BACKUP_PATH.sql"
    fi
    
    # Backup uploaded files (if using local storage)
    if [ -d "$PROJECT_ROOT/uploads" ]; then
        log "Backing up uploaded files..."
        tar -czf "$BACKUP_PATH.tar.gz" -C "$PROJECT_ROOT" uploads
        success "Files backup created: $BACKUP_PATH.tar.gz"
    fi
}

# Build and deploy application
deploy_application() {
    log "Starting application deployment..."
    
    cd "$PROJECT_ROOT"
    
    # Pull latest changes (if this is a git deployment)
    if [ -d ".git" ]; then
        log "Pulling latest changes from git..."
        git pull origin main
    fi
    
    # Build and start services
    log "Building and starting services..."
    docker-compose -f docker-compose.prod.yml --env-file .env.production down --remove-orphans
    docker-compose -f docker-compose.prod.yml --env-file .env.production build --no-cache
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
    
    success "Application deployment completed"
}

# Wait for services to be healthy
wait_for_services() {
    log "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Health check attempt $attempt/$max_attempts"
        
        # Check backend health
        if curl -f -s http://localhost:3001/api/health > /dev/null; then
            success "Backend service is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Services failed to become healthy within expected time"
        fi
        
        sleep 10
        ((attempt++))
    done
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run Prisma migrations
    docker-compose -f docker-compose.prod.yml --env-file .env.production exec backend npx prisma migrate deploy
    
    success "Database migrations completed"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Check if all services are running
    local services=("uimp-postgres-prod" "uimp-redis-prod" "uimp-backend-prod" "uimp-frontend-prod" "uimp-nginx-prod")
    
    for service in "${services[@]}"; do
        if docker ps | grep -q "$service"; then
            success "$service is running"
        else
            error "$service is not running"
        fi
    done
    
    # Test API endpoints
    log "Testing API endpoints..."
    
    if curl -f -s http://localhost/api/health > /dev/null; then
        success "API health check passed"
    else
        warning "API health check failed - this might be normal if SSL is required"
    fi
    
    # Test frontend
    if curl -f -s http://localhost/ > /dev/null; then
        success "Frontend is accessible"
    else
        warning "Frontend accessibility check failed - this might be normal if SSL is required"
    fi
}

# Setup SSL certificates (Let's Encrypt)
setup_ssl() {
    log "Setting up SSL certificates..."
    
    # Check if certbot is available
    if command -v certbot &> /dev/null; then
        log "Generating SSL certificates with Let's Encrypt..."
        
        # Create SSL directory
        mkdir -p "$PROJECT_ROOT/nginx/ssl"
        
        # Generate certificates (this is a placeholder - actual implementation depends on your domain)
        warning "SSL certificate generation requires manual configuration for your domain"
        warning "Please run: certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com"
        warning "Then copy certificates to nginx/ssl/ directory"
    else
        warning "Certbot not found. Please install certbot for automatic SSL certificate generation"
        warning "For now, using self-signed certificates for testing"
        
        # Generate self-signed certificates for testing
        mkdir -p "$PROJECT_ROOT/nginx/ssl"
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout "$PROJECT_ROOT/nginx/ssl/private.key" \
            -out "$PROJECT_ROOT/nginx/ssl/cert.pem" \
            -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        
        success "Self-signed SSL certificates generated for testing"
    fi
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up old Docker images and containers..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes (be careful with this in production)
    # docker volume prune -f
    
    success "Cleanup completed"
}

# Main deployment function
main() {
    log "Starting UIMP production deployment..."
    log "Deployment log: $LOG_FILE"
    
    # Parse command line arguments
    SKIP_BACKUP=false
    SKIP_SSL=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --skip-ssl)
                SKIP_SSL=true
                shift
                ;;
            --help)
                echo "Usage: $0 [--skip-backup] [--skip-ssl]"
                echo "  --skip-backup: Skip database backup"
                echo "  --skip-ssl: Skip SSL certificate setup"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
    
    # Execute deployment steps
    check_prerequisites
    
    if [ "$SKIP_BACKUP" = false ]; then
        create_backup
    fi
    
    if [ "$SKIP_SSL" = false ]; then
        setup_ssl
    fi
    
    deploy_application
    run_migrations
    wait_for_services
    verify_deployment
    cleanup
    
    success "🚀 UIMP deployment completed successfully!"
    log "Application is now running at:"
    log "  - Frontend: https://yourdomain.com"
    log "  - API: https://api.yourdomain.com"
    log "  - Monitoring: https://monitoring.yourdomain.com"
    
    warning "Don't forget to:"
    warning "  1. Update DNS records to point to this server"
    warning "  2. Configure proper SSL certificates for your domain"
    warning "  3. Set up monitoring and alerting"
    warning "  4. Configure automated backups"
}

# Run main function
main "$@"