#!/bin/bash

# UIMP Backup Script
# Automated backup solution for database and application data

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
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_FILE="$PROJECT_ROOT/backup.log"

# Backup settings
RETENTION_DAYS=30
BACKUP_PREFIX="uimp_backup"
DATE_FORMAT=$(date +'%Y%m%d_%H%M%S')

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create backup directory
create_backup_dir() {
    mkdir -p "$BACKUP_DIR"
    if [ ! -d "$BACKUP_DIR" ]; then
        error "Failed to create backup directory: $BACKUP_DIR"
    fi
    log "Backup directory: $BACKUP_DIR"
}

# Backup PostgreSQL database
backup_database() {
    log "Starting database backup..."
    
    local backup_file="$BACKUP_DIR/${BACKUP_PREFIX}_db_${DATE_FORMAT}.sql"
    
    # Check if PostgreSQL container is running
    if ! docker ps | grep -q "uimp-postgres-prod"; then
        error "PostgreSQL container is not running"
    fi
    
    # Create database backup
    if docker exec uimp-postgres-prod pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$backup_file"; then
        success "Database backup created: $backup_file"
        
        # Compress the backup
        gzip "$backup_file"
        success "Database backup compressed: ${backup_file}.gz"
        
        # Verify backup integrity
        if gunzip -t "${backup_file}.gz"; then
            success "Database backup integrity verified"
        else
            error "Database backup integrity check failed"
        fi
    else
        error "Failed to create database backup"
    fi
}

# Backup Redis data
backup_redis() {
    log "Starting Redis backup..."
    
    local backup_file="$BACKUP_DIR/${BACKUP_PREFIX}_redis_${DATE_FORMAT}.rdb"
    
    # Check if Redis container is running
    if ! docker ps | grep -q "uimp-redis-prod"; then
        warning "Redis container is not running, skipping Redis backup"
        return 0
    fi
    
    # Create Redis backup
    if docker exec uimp-redis-prod redis-cli BGSAVE; then
        # Wait for background save to complete
        sleep 5
        
        # Copy the RDB file
        if docker cp uimp-redis-prod:/data/dump.rdb "$backup_file"; then
            success "Redis backup created: $backup_file"
            
            # Compress the backup
            gzip "$backup_file"
            success "Redis backup compressed: ${backup_file}.gz"
        else
            warning "Failed to copy Redis backup file"
        fi
    else
        warning "Failed to create Redis backup"
    fi
}

# Backup uploaded files
backup_uploads() {
    log "Starting uploads backup..."
    
    local uploads_dir="$PROJECT_ROOT/uploads"
    local backup_file="$BACKUP_DIR/${BACKUP_PREFIX}_uploads_${DATE_FORMAT}.tar.gz"
    
    if [ -d "$uploads_dir" ]; then
        if tar -czf "$backup_file" -C "$PROJECT_ROOT" uploads; then
            success "Uploads backup created: $backup_file"
        else
            warning "Failed to create uploads backup"
        fi
    else
        log "No uploads directory found, skipping uploads backup"
    fi
}

# Backup configuration files
backup_config() {
    log "Starting configuration backup..."
    
    local config_backup="$BACKUP_DIR/${BACKUP_PREFIX}_config_${DATE_FORMAT}.tar.gz"
    
    # List of important configuration files
    local config_files=(
        ".env.production"
        "docker-compose.prod.yml"
        "nginx/nginx.prod.conf"
        "monitoring/prometheus.yml"
        "monitoring/alert_rules.yml"
    )
    
    local existing_files=()
    for file in "${config_files[@]}"; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            existing_files+=("$file")
        fi
    done
    
    if [ ${#existing_files[@]} -gt 0 ]; then
        if tar -czf "$config_backup" -C "$PROJECT_ROOT" "${existing_files[@]}"; then
            success "Configuration backup created: $config_backup"
        else
            warning "Failed to create configuration backup"
        fi
    else
        warning "No configuration files found to backup"
    fi
}

# Upload backup to cloud storage (S3)
upload_to_s3() {
    local backup_file=$1
    
    if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$BACKUP_S3_BUCKET" ]; then
        log "AWS credentials or S3 bucket not configured, skipping cloud upload"
        return 0
    fi
    
    log "Uploading backup to S3: $backup_file"
    
    local s3_key="backups/$(basename "$backup_file")"
    
    if command -v aws &> /dev/null; then
        if aws s3 cp "$backup_file" "s3://$BACKUP_S3_BUCKET/$s3_key"; then
            success "Backup uploaded to S3: s3://$BACKUP_S3_BUCKET/$s3_key"
        else
            warning "Failed to upload backup to S3"
        fi
    else
        warning "AWS CLI not installed, skipping S3 upload"
    fi
}

# Clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (retention: $RETENTION_DAYS days)..."
    
    # Find and delete old backup files
    local deleted_count=0
    
    find "$BACKUP_DIR" -name "${BACKUP_PREFIX}_*" -type f -mtime +$RETENTION_DAYS -print0 | while IFS= read -r -d '' file; do
        log "Deleting old backup: $(basename "$file")"
        rm "$file"
        ((deleted_count++))
    done
    
    if [ $deleted_count -gt 0 ]; then
        success "Deleted $deleted_count old backup files"
    else
        log "No old backup files to delete"
    fi
}

# Verify backup files
verify_backups() {
    log "Verifying backup files..."
    
    local backup_files=("$BACKUP_DIR"/${BACKUP_PREFIX}_*_${DATE_FORMAT}.*)
    local verified_count=0
    
    for file in "${backup_files[@]}"; do
        if [ -f "$file" ]; then
            local file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
            if [ "$file_size" -gt 0 ]; then
                success "Backup verified: $(basename "$file") (${file_size} bytes)"
                ((verified_count++))
            else
                error "Backup file is empty: $(basename "$file")"
            fi
        fi
    done
    
    log "Verified $verified_count backup files"
}

# Generate backup report
generate_report() {
    log "=== BACKUP SUMMARY ==="
    
    local total_size=0
    local backup_files=("$BACKUP_DIR"/${BACKUP_PREFIX}_*_${DATE_FORMAT}.*)
    
    for file in "${backup_files[@]}"; do
        if [ -f "$file" ]; then
            local file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
            total_size=$((total_size + file_size))
            log "  $(basename "$file"): $(numfmt --to=iec "$file_size" 2>/dev/null || echo "${file_size} bytes")"
        fi
    done
    
    log "Total backup size: $(numfmt --to=iec "$total_size" 2>/dev/null || echo "${total_size} bytes")"
    log "Backup location: $BACKUP_DIR"
    log "Backup completed at: $(date)"
}

# Main backup function
main() {
    log "Starting UIMP backup process..."
    
    # Parse command line arguments
    SKIP_DB=false
    SKIP_REDIS=false
    SKIP_UPLOADS=false
    SKIP_CONFIG=false
    SKIP_CLEANUP=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-db)
                SKIP_DB=true
                shift
                ;;
            --skip-redis)
                SKIP_REDIS=true
                shift
                ;;
            --skip-uploads)
                SKIP_UPLOADS=true
                shift
                ;;
            --skip-config)
                SKIP_CONFIG=true
                shift
                ;;
            --skip-cleanup)
                SKIP_CLEANUP=true
                shift
                ;;
            --retention-days)
                RETENTION_DAYS="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --skip-db         Skip database backup"
                echo "  --skip-redis      Skip Redis backup"
                echo "  --skip-uploads    Skip uploads backup"
                echo "  --skip-config     Skip configuration backup"
                echo "  --skip-cleanup    Skip cleanup of old backups"
                echo "  --retention-days  Number of days to keep backups (default: 30)"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
    
    # Load environment variables if available
    if [ -f "$PROJECT_ROOT/.env.production" ]; then
        source "$PROJECT_ROOT/.env.production"
    fi
    
    # Execute backup steps
    create_backup_dir
    
    if [ "$SKIP_DB" = false ]; then
        backup_database
    fi
    
    if [ "$SKIP_REDIS" = false ]; then
        backup_redis
    fi
    
    if [ "$SKIP_UPLOADS" = false ]; then
        backup_uploads
    fi
    
    if [ "$SKIP_CONFIG" = false ]; then
        backup_config
    fi
    
    verify_backups
    
    # Upload to cloud storage if configured
    for file in "$BACKUP_DIR"/${BACKUP_PREFIX}_*_${DATE_FORMAT}.*; do
        if [ -f "$file" ]; then
            upload_to_s3 "$file"
        fi
    done
    
    if [ "$SKIP_CLEANUP" = false ]; then
        cleanup_old_backups
    fi
    
    generate_report
    
    success "🎯 Backup process completed successfully!"
}

# Run main function
main "$@"