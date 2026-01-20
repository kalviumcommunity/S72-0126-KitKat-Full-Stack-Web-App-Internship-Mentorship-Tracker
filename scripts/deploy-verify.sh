#!/bin/bash

# Deployment Verification Script
# Comprehensive health checks and smoke tests for UIMP deployment

set -e

# Configuration
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:3001}"
TIMEOUT=30
MAX_RETRIES=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local retries=0
    
    log_info "Waiting for $service_name to be ready at $url..."
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -f -s --max-time $TIMEOUT "$url" > /dev/null 2>&1; then
            log_success "$service_name is ready!"
            return 0
        fi
        
        retries=$((retries + 1))
        log_warning "Attempt $retries/$MAX_RETRIES failed. Retrying in 10 seconds..."
        sleep 10
    done
    
    log_error "$service_name failed to start after $MAX_RETRIES attempts"
    return 1
}

# Health check function
health_check() {
    local url=$1
    local service_name=$2
    
    log_info "Running health check for $service_name..."
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url")
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "$service_name health check passed (HTTP $http_code)"
        return 0
    else
        log_error "$service_name health check failed (HTTP $http_code)"
        echo "Response body: $body"
        return 1
    fi
}

# Frontend smoke tests
frontend_smoke_tests() {
    log_info "Running frontend smoke tests..."
    
    # Test main pages
    local pages=("/" "/login" "/signup")
    
    for page in "${pages[@]}"; do
        local url="$FRONTEND_URL$page"
        log_info "Testing page: $page"
        
        if curl -f -s --max-time $TIMEOUT "$url" > /dev/null; then
            log_success "Page $page is accessible"
        else
            log_error "Page $page is not accessible"
            return 1
        fi
    done
    
    # Test static assets
    log_info "Testing static assets..."
    if curl -f -s --max-time $TIMEOUT "$FRONTEND_URL/_next/static" > /dev/null; then
        log_success "Static assets are accessible"
    else
        log_warning "Static assets check failed (may be normal for some deployments)"
    fi
    
    log_success "Frontend smoke tests completed"
}

# Backend smoke tests
backend_smoke_tests() {
    log_info "Running backend smoke tests..."
    
    # Test API endpoints
    local endpoints=("/api/health" "/api/auth/status")
    
    for endpoint in "${endpoints[@]}"; do
        local url="$BACKEND_URL$endpoint"
        log_info "Testing endpoint: $endpoint"
        
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$url")
        http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        
        if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 401 ]; then
            log_success "Endpoint $endpoint is responding (HTTP $http_code)"
        else
            log_error "Endpoint $endpoint failed (HTTP $http_code)"
            return 1
        fi
    done
    
    log_success "Backend smoke tests completed"
}

# Database connectivity test
database_connectivity_test() {
    log_info "Testing database connectivity..."
    
    # Test through backend API
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BACKEND_URL/api/health/db")
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "Database connectivity test passed"
    else
        log_error "Database connectivity test failed (HTTP $http_code)"
        return 1
    fi
}

# Cache connectivity test
cache_connectivity_test() {
    log_info "Testing cache connectivity..."
    
    # Test through backend API
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BACKEND_URL/api/health/cache")
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq 200 ]; then
        log_success "Cache connectivity test passed"
    else
        log_warning "Cache connectivity test failed (HTTP $http_code) - may be optional"
    fi
}

# Performance test
performance_test() {
    log_info "Running basic performance test..."
    
    # Test response time for main page
    response_time=$(curl -o /dev/null -s -w '%{time_total}' "$FRONTEND_URL/")
    
    # Convert to milliseconds
    response_time_ms=$(echo "$response_time * 1000" | bc)
    
    if (( $(echo "$response_time < 5.0" | bc -l) )); then
        log_success "Performance test passed (${response_time_ms}ms)"
    else
        log_warning "Performance test warning: slow response time (${response_time_ms}ms)"
    fi
}

# Security headers test
security_headers_test() {
    log_info "Testing security headers..."
    
    headers=$(curl -I -s "$FRONTEND_URL/")
    
    # Check for important security headers
    if echo "$headers" | grep -i "x-frame-options" > /dev/null; then
        log_success "X-Frame-Options header present"
    else
        log_warning "X-Frame-Options header missing"
    fi
    
    if echo "$headers" | grep -i "x-content-type-options" > /dev/null; then
        log_success "X-Content-Type-Options header present"
    else
        log_warning "X-Content-Type-Options header missing"
    fi
    
    if echo "$headers" | grep -i "strict-transport-security" > /dev/null; then
        log_success "Strict-Transport-Security header present"
    else
        log_warning "Strict-Transport-Security header missing (normal for HTTP)"
    fi
}

# Main execution
main() {
    log_info "Starting UIMP deployment verification..."
    log_info "Frontend URL: $FRONTEND_URL"
    log_info "Backend URL: $BACKEND_URL"
    
    # Wait for services to be ready
    wait_for_service "$BACKEND_URL/api/health" "Backend"
    wait_for_service "$FRONTEND_URL/" "Frontend"
    
    # Run health checks
    health_check "$BACKEND_URL/api/health" "Backend"
    health_check "$FRONTEND_URL/api/health" "Frontend"
    
    # Run smoke tests
    backend_smoke_tests
    frontend_smoke_tests
    
    # Run connectivity tests
    database_connectivity_test
    cache_connectivity_test
    
    # Run additional tests
    performance_test
    security_headers_test
    
    log_success "🎉 All deployment verification tests completed successfully!"
    log_info "Deployment is ready for use."
}

# Error handling
trap 'log_error "Deployment verification failed!"; exit 1' ERR

# Run main function
main "$@"