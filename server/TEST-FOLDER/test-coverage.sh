#!/bin/bash
# Bash script for running tests with coverage reporting

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}UIMP Test Coverage Report${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Clean previous coverage reports
if [ -d "coverage" ]; then
    echo -e "${YELLOW}Cleaning previous coverage reports...${NC}"
    rm -rf coverage
    echo -e "${GREEN}✓ Previous coverage cleaned${NC}"
fi

echo ""

# Run tests with coverage
echo -e "${YELLOW}Running tests with coverage...${NC}"
echo -e "${GRAY}This may take a few minutes...${NC}"
echo ""

npm run test:coverage

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Coverage Report Generated!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Check if coverage directory exists
if [ -d "coverage" ]; then
    echo -e "${WHITE}Coverage reports available:${NC}"
    echo -e "${CYAN}  Text Report: See output above${NC}"
    echo -e "${CYAN}  HTML Report: coverage/lcov-report/index.html${NC}"
    echo -e "${CYAN}  LCOV Report: coverage/lcov.info${NC}"
    echo ""
    
    # Try to open HTML report
    html_report="coverage/lcov-report/index.html"
    if [ -f "$html_report" ]; then
        echo -e "${YELLOW}HTML coverage report available at: $html_report${NC}"
        
        # Try to open in browser (works on most Linux/Mac systems)
        if command -v xdg-open &> /dev/null; then
            echo -e "${YELLOW}Opening HTML coverage report...${NC}"
            xdg-open "$html_report" &
            echo -e "${GREEN}✓ HTML report opened in browser${NC}"
        elif command -v open &> /dev/null; then
            echo -e "${YELLOW}Opening HTML coverage report...${NC}"
            open "$html_report"
            echo -e "${GREEN}✓ HTML report opened in browser${NC}"
        else
            echo -e "${YELLOW}Please open the HTML report manually: $html_report${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ Coverage directory not found${NC}"
fi

echo ""
echo -e "${GREEN}Coverage analysis complete!${NC}"