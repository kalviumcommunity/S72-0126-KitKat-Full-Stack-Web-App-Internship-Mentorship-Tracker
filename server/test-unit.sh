#!/bin/bash
# Bash script for running unit tests

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}UIMP Unit Tests Runner${NC}"
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

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Run unit tests
echo -e "${YELLOW}Running unit tests...${NC}"
echo ""

npm run test:unit

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All unit tests passed!${NC}"
else
    echo ""
    echo -e "${RED}✗ Some unit tests failed${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Unit Tests Completed${NC}"
echo -e "${CYAN}========================================${NC}"