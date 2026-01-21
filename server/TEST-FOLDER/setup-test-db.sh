#!/bin/bash
# Bash script for setting up test database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}UIMP Test Database Setup${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Load test environment
if [ -f ".env.test" ]; then
    echo -e "${YELLOW}Loading test environment variables...${NC}"
    export $(grep -v '^#' .env.test | xargs)
    echo -e "${GREEN}✓ Test environment loaded${NC}"
else
    echo -e "${RED}✗ .env.test file not found${NC}"
    exit 1
fi

echo ""

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    pg_version=$(psql --version)
    echo -e "${GREEN}✓ PostgreSQL available: $pg_version${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found in PATH. Assuming Docker or remote database.${NC}"
fi

echo ""

# Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}"

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
if ! npx prisma migrate deploy; then
    echo -e "${YELLOW}⚠ Migration failed. This might be expected for a fresh test database.${NC}"
    echo -e "${YELLOW}Attempting to create and migrate...${NC}"
    
    # Try to create the database and run migrations
    npx prisma migrate dev --name init
fi
echo -e "${GREEN}✓ Database migrations completed${NC}"

# Seed test data (optional)
if [ -f "prisma/seed.ts" ]; then
    echo -e "${YELLOW}Seeding test database...${NC}"
    if npx prisma db seed; then
        echo -e "${GREEN}✓ Database seeded${NC}"
    else
        echo -e "${YELLOW}⚠ Database seeding failed (this might be expected for tests)${NC}"
    fi
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Test Database Setup Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "${WHITE}You can now run tests with:${NC}"
echo -e "${CYAN}  ./test-unit.sh${NC}"
echo -e "${CYAN}  ./test-integration.sh${NC}"
echo -e "${CYAN}  ./test-e2e.sh${NC}"
echo -e "${CYAN}  ./test-all.sh${NC}"
echo ""