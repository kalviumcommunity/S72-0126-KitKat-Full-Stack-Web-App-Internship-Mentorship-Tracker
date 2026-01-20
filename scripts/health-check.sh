#!/bin/bash

# UIMP Health Check Script
# Comprehensive health monitoring for all services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_ROOT/health-check.log"

# Health check results
HEALTH_STATUS=0
FAILED_SERVICES=()

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$LOG_FILE"
    HEALTH_STATUS=1
    FAILED_SERVICES+=("$2")
}

warning() {
    echo -e "${YELLOW}[!]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if a service is running
check_service_running() {
    local service_name=$1
    local container_name=$2
    
    if docker ps --format "table {{.Names}}" | grep -q "^${container_name}$"; then
        success "$service_name is running"
        return 0
    else
        error "$service_name is not running" "$service_name"
        return 1
    fi
}

# Check HTTP endpoint
check_http_endpoint() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    if [ "$response_code" = "$expected_status" ]; then
        success "$service_name HTTP endpoint is healthy ($url)"
        return 0
    else
        error "$service_name HTTP endpoint failed (Expected: $expected_status, Got: $response_code)" "$service_name"
        return 1
    fi
}

# Check database connectivity
check_database() {
    log "Checking database connectivity..."
    
    if check_service_running "PostgreSQL" "uimp-postgres-prod"; then
        # Test database connection
        if docker exec uimp-postgres-prod pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1; then
            success "Database is accepting connections"
        else
            error "Database is not accepting connections" "Database"
        fi
        
        # Check database size and connections
        local db_size=$(docker exec uimp-postgres-prod psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT pg_size_pretty(pg_database_size('$POSTGRES_DB'));" 2>/dev/null | xargs || echo "Unknown")
        local active_connections=$(docker exec uimp-postgres-prod psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | xargs || echo "Unknown")
        
        log "Database size: $db_size"
        log "Active connections: $active_connections"
    fi
}

# Check Redis connectivity
check_redis() {
    log "Checking Redis connectivity..."
    
    if check_service_running "Redis" "uimp-redis-prod"; then
        # Test Redis connection
        if docker exec uimp-redis-prod redis-cli ping > /dev/null 2>&1; then
            success "Redis is responding to ping"
        else
            error "Redis is not responding to ping" "Redis"
        fi
        
        # Check Redis memory usage
        local memory_usage=$(docker exec uimp-redis-prod redis-cli info memory | grep used_memory_human | cut -d: -f2 | tr -d '\r' || echo "Unknown")
        log "Redis memory usage: $memory_usage"
    fi
}

# Check backend API
check_backend() {
    log "Checking backend API..."
    
    if check_service_running "Backend API" "uimp-backend-prod"; then
        # Check health endpoint
        check_http_endpoint "Backend API" "http://localhost:3001/api/health"
        
        # Check if API is responding with proper headers
        local response_headers=$(curl -s -I "http://localhost:3001/api/health" || echo "")
        if echo "$response_headers" | grep -q "Content-Type"; then
            success "Backend API is returning proper headers"
        else
            warning "Backend API headers check failed"
        fi
    fi
}

# Check frontend
check_frontend() {
    log "Checking frontend application..."
    
    if check_service_running "Frontend" "uimp-frontend-prod"; then
        # Check if frontend is serving content
        check_http_endpoint "Frontend" "http://localhost:3000"
        
        # Check if Next.js is running properly
        local response_body=$(curl -s "http://localhost:3000" || echo "")
        if echo "$response_body" | grep -q "html"; then
            success "Frontend is serving HTML content"
        else
            warning "Frontend HTML content check failed"
        fi
    fi
}

# Check Nginx proxy
check_nginx() {
    log "Checking Nginx proxy..."
    
    if check_service_running "Nginx" "uimp-nginx-prod"; then
        # Check if Nginx is proxying correctly
        check_http_endpoint "Nginx Proxy" "http://localhost"
        
        # Check SSL if certificates exist
        if [ -f "$PROJECT_ROOT/nginx/ssl/cert.pem" ]; then
            local ssl_check=$(curl -s -k -I "https://localhost" | head -n 1 || echo "")
            if echo "$ssl_check" | grep -q "200\|301\|302"; then
                success "Nginx SSL is working"
            else
                warning "Nginx SSL check failed"
            fi
        else
            warning "SSL certificates not found"
        fi
    fi
}

# Check disk space
check_disk_space() {
    log "Checking disk space..."
    
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -lt 80 ]; then
        success "Disk space is healthy ($disk_usage% used)"
    elif [ "$disk_usage" -lt 90 ]; then
        warning "Disk space is getting low ($disk_usage% used)"
    else
        error "Disk space is critically low ($disk_usage% used)" "Disk Space"
    fi
}

# Check memory usage
check_memory() {
    log "Checking memory usage..."
    
    local memory_info=$(free | grep Mem)
    local total_mem=$(echo $memory_info | awk '{print $2}')
    local used_mem=$(echo $memory_info | awk '{print $3}')
    local memory_percent=$((used_mem * 100 / total_mem))
    
    if [ "$memory_percent" -lt 80 ]; then
        success "Memory usage is healthy ($memory_percent% used)"
    elif [ "$memory_percent" -lt 90 ]; then
        warning "Memory usage is getting high ($memory_percent% used)"
    else
        error "Memory usage is critically high ($memory_percent% used)" "Memory"
    fi
}

# Check Docker resources
check_docker_resources() {
    log "Checking Docker resources..."
    
    # Check Docker daemon
    if docker info > /dev/null 2>&1; then
        success "Docker daemon is running"
    else
        error "Docker daemon is not running" "Docker"
        return 1
    fi
    
    # Check container resource usage
    local containers=$(docker ps --format "table {{.Names}}\t{{.CPUPerc}}\t{{.MemUsage}}" | tail -n +2)
    
    if [ -n "$containers" ]; then
        log "Container resource usage:"
        echo "$containers" | while read line; do
            log "  $line"
        done
    fi
}

# Generate health report
generate_report() {
    log "=== HEALTH CHECK SUMMARY ==="
    
    if [ $HEALTH_STATUS -eq 0 ]; then
        success "All services are healthy! 🎉"
    else
        error "Health check failed for the following services:"
        for service in "${FAILED_SERVICES[@]}"; do
            error "  - $service"
        done
    fi
    
    log "Health check completed at $(date)"
    log "Full log available at: $LOG_FILE"
}

# Main health check function
main() {
    log "Starting UIMP health check..."
    
    # System checks
    check_disk_space
    check_memory
    check_docker_resources
    
    # Service checks
    check_database
    check_redis
    check_backend
    check_frontend
    check_nginx
    
    # Generate report
    generate_report
    
    exit $HEALTH_STATUS
}

# Run main function
main "$@"