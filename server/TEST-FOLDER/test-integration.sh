#!/bin/bash
# Bash script for running integration tests

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}UIMP Integration Tests Runner${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if Node.js is available
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js version: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js is not installed or not in PATH${NC}"
    exit 1
fi

# Check if npm is available
if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm version: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm is not installed or not in PATH${NC}"
    exit 1
fi

echo ""

# Check if test database is configured
if [ -z "$TEST_DATABASE_URL" ] && [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  Warning: No test database URL configured${NC}"
    echo -e "${YELLOW}   Set TEST_DATABASE_URL or DATABASE_URL environment variable${NC}"
    echo -e "${GRAY}   Example: postgresql://test:test@localhost:5432/uimp_test${NC}"
    echo ""
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Generate Prisma client if needed
echo -e "${YELLOW}Generating Prisma client...${NC}"
npm run prisma:generate
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

# Run integration tests
echo -e "${YELLOW}Running integration tests...${NC}"
echo -e "${GRAY}Note: These tests require a test database connection${NC}"
echo ""

npm run test:integration

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All integration tests passed!${NC}"
else
    echo ""
    echo -e "${RED}✗ Some integration tests failed${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting tips:${NC}"
    echo -e "${GRAY}1. Ensure test database is running and accessible${NC}"
    echo -e "${GRAY}2. Check TEST_DATABASE_URL environment variable${NC}"
    echo -e "${GRAY}3. Run 'npm run prisma:migrate' to apply migrations${NC}"
    echo -e "${GRAY}4. Ensure test database has proper permissions${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Integration Tests Completed${NC}"
echo -e "${CYAN}========================================${NC}"