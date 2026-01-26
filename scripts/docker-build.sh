#!/bin/bash

# Docker Build Script for UIMP
# Builds and optionally pushes Docker images for frontend and backend

set -e

# Configuration
REGISTRY="ghcr.io"
REPOSITORY="your-org/uimp"
SERVICES=("frontend" "backend")
PLATFORMS="linux/amd64,linux/arm64"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PUSH=false
TAG="local"
BUILD_ARGS=""
CACHE=true

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -p, --push              Push images to registry"
    echo "  -t, --tag TAG           Tag for the images (default: local)"
    echo "  -s, --service SERVICE   Build specific service (frontend|backend|all)"
    echo "  --no-cache              Disable build cache"
    echo "  --build-arg ARG=VALUE   Pass build argument"
    echo ""
    echo "Examples:"
    echo "  $0                      # Build all services locally"
    echo "  $0 -s frontend          # Build only frontend"
    echo "  $0 -p -t v1.0.0         # Build and push with tag v1.0.0"
    echo "  $0 --build-arg NODE_ENV=production"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--push)
            PUSH=true
            shift
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -s|--service)
            if [[ "$2" == "all" ]]; then
                SERVICES=("frontend" "backend")
            else
                SERVICES=("$2")
            fi
            shift 2
            ;;
        --no-cache)
            CACHE=false
            shift
            ;;
        --build-arg)
            BUILD_ARGS="$BUILD_ARGS --build-arg $2"
            shift 2
            ;;
        *)
            echo "Unknown option $1"
            show_help
            exit 1
            ;;
    esac
done

# Function to log messages
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to setup Docker Buildx
setup_buildx() {
    log "Setting up Docker Buildx..."
    
    # Create builder if it doesn't exist
    if ! docker buildx inspect uimp-builder > /dev/null 2>&1; then
        docker buildx create --name uimp-builder --use
    else
        docker buildx use uimp-builder
    fi
    
    # Bootstrap the builder
    docker buildx inspect --bootstrap
}

# Function to build a service
build_service() {
    local service=$1
    local context=""
    local dockerfile=""
    
    case $service in
        frontend)
            context="./client"
            dockerfile="./client/Dockerfile"
            ;;
        backend)
            context="./server"
            dockerfile="./server/Dockerfile"
            ;;
        *)
            log_error "Unknown service: $service"
            return 1
            ;;
    esac
    
    local image_name="${REGISTRY}/${REPOSITORY}/${service}:${TAG}"
    
    log "Building $service..."
    log "Context: $context"
    log "Dockerfile: $dockerfile"
    log "Image: $image_name"
    
    # Build command
    local build_cmd="docker buildx build"
    
    # Add cache options
    if [[ "$CACHE" == "true" ]]; then
        build_cmd="$build_cmd --cache-from=type=local,src=/tmp/.buildx-cache-${service}"
        build_cmd="$build_cmd --cache-to=type=local,dest=/tmp/.buildx-cache-${service},mode=max"
    else
        build_cmd="$build_cmd --no-cache"
    fi
    
    # Add build arguments
    if [[ -n "$BUILD_ARGS" ]]; then
        build_cmd="$build_cmd $BUILD_ARGS"
    fi
    
    # Add platforms for multi-arch builds
    if [[ "$PUSH" == "true" ]]; then
        build_cmd="$build_cmd --platform $PLATFORMS"
    fi
    
    # Add push option
    if [[ "$PUSH" == "true" ]]; then
        build_cmd="$build_cmd --push"
    else
        build_cmd="$build_cmd --load"
    fi
    
    # Final build command
    build_cmd="$build_cmd -f $dockerfile -t $image_name $context"
    
    log "Executing: $build_cmd"
    
    if eval $build_cmd; then
        log_success "Successfully built $service"
        
        # Run security scan if not pushing
        if [[ "$PUSH" == "false" ]]; then
            log "Running security scan for $service..."
            if command -v trivy > /dev/null 2>&1; then
                trivy image --exit-code 0 --severity HIGH,CRITICAL $image_name
            else
                log_warning "Trivy not found. Skipping security scan."
            fi
        fi
        
        return 0
    else
        log_error "Failed to build $service"
        return 1
    fi
}

# Function to login to registry
login_registry() {
    if [[ "$PUSH" == "true" ]]; then
        log "Logging in to registry..."
        
        if [[ -n "$GITHUB_TOKEN" ]]; then
            echo "$GITHUB_TOKEN" | docker login $REGISTRY -u "$GITHUB_ACTOR" --password-stdin
        elif [[ -n "$DOCKER_PASSWORD" ]]; then
            echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
        else
            log_warning "No registry credentials found. You may need to login manually."
            log "Run: docker login $REGISTRY"
        fi
    fi
}

# Function to create multi-arch manifest
create_manifest() {
    if [[ "$PUSH" == "true" && ${#SERVICES[@]} -gt 1 ]]; then
        log "Creating multi-arch manifests..."
        
        for service in "${SERVICES[@]}"; do
            local image_base="${REGISTRY}/${REPOSITORY}/${service}:${TAG}"
            
            # Create manifest list
            docker manifest create $image_base \
                ${image_base}-amd64 \
                ${image_base}-arm64 2>/dev/null || true
            
            # Push manifest
            docker manifest push $image_base 2>/dev/null || true
        done
    fi
}

# Function to cleanup
cleanup() {
    log "Cleaning up..."
    
    # Remove dangling images
    docker image prune -f > /dev/null 2>&1 || true
    
    # Clean build cache if it gets too large
    local cache_size=$(du -sh /tmp/.buildx-cache-* 2>/dev/null | awk '{sum+=$1} END {print sum}' || echo "0")
    if [[ "$cache_size" -gt 1000000 ]]; then # 1GB
        log "Cleaning build cache..."
        rm -rf /tmp/.buildx-cache-*
    fi
}

# Main execution
main() {
    log "Starting Docker build process..."
    log "Services: ${SERVICES[*]}"
    log "Tag: $TAG"
    log "Push: $PUSH"
    
    # Pre-flight checks
    check_docker
    setup_buildx
    login_registry
    
    # Build services
    local failed_services=()
    for service in "${SERVICES[@]}"; do
        if ! build_service "$service"; then
            failed_services+=("$service")
        fi
    done
    
    # Create manifests
    create_manifest
    
    # Cleanup
    cleanup
    
    # Report results
    if [[ ${#failed_services[@]} -eq 0 ]]; then
        log_success "All services built successfully!"
        
        if [[ "$PUSH" == "true" ]]; then
            log_success "Images pushed to registry: $REGISTRY/$REPOSITORY"
        else
            log_success "Images available locally:"
            for service in "${SERVICES[@]}"; do
                echo "  - ${REGISTRY}/${REPOSITORY}/${service}:${TAG}"
            done
        fi
    else
        log_error "Failed to build services: ${failed_services[*]}"
        exit 1
    fi
}

# Run main function
main "$@"