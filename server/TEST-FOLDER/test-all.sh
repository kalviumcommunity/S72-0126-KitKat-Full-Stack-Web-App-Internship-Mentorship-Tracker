#!/bin/bash
# Bash script for running all tests (unit + integration + e2e)

set -e

echo "========================================"
echo "UIMP Complete Test Suite Runner"
echo "========================================"
echo ""

# Test counters
total_suites=0
passed_suites=0
failed_suites=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to run a test suite
run_test_suite() {
    local name="$1"
    local script="$2"
    
    ((total_suites++))
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}Running: $name${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo ""
    
    if bash "$script"; then
        echo ""
        echo -e "${GREEN}✓ $name completed successfully${NC}"
        ((passed_suites++))
    else
        echo ""
        echo -e "${RED}✗ $name failed${NC}"
        ((failed_suites++))
    fi
    
    echo ""
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if command -v node &> /dev/null; then
    node_version=$(node --version)
    echo -e "${GREEN}✓ Node.js version: $node_version${NC}"
else
    echo -e "${RED}✗ Node.js is not installed or not in PATH${NC}"
    exit 1
fi

if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo -e "${GREEN}✓ npm version: $npm_version${NC}"
else
    echo -e "${RED}✗ npm is not installed or not in PATH${NC}"
    exit 1
fi

echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Run all test suites
run_test_suite "Unit Tests" "./test-unit.sh"
run_test_suite "Integration Tests" "./test-integration.sh"
run_test_suite "End-to-End Tests" "./test-e2e.sh"

# Summary
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Complete Test Suite Summary${NC}"
echo -e "${CYAN}========================================${NC}"
echo -e "${WHITE}Total Test Suites:  $total_suites${NC}"
echo -e "${GREEN}Passed:             $passed_suites${NC}"
echo -e "${RED}Failed:             $failed_suites${NC}"

if [ $total_suites -gt 0 ]; then
    success_rate=$(echo "scale=2; ($passed_suites / $total_suites) * 100" | bc -l)
    
    if (( $(echo "$success_rate >= 90" | bc -l) )); then
        color=$GREEN
    elif (( $(echo "$success_rate >= 70" | bc -l) )); then
        color=$YELLOW
    else
        color=$RED
    fi
    
    echo -e "${color}Success Rate:       ${success_rate}%${NC}"
fi

if [ $failed_suites -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All test suites passed!${NC}"
    echo -e "${GREEN}Your code is ready for deployment!${NC}"
    echo -e "${CYAN}========================================${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some test suites failed. Please review the output above.${NC}"
    echo -e "${RED}Fix the failing tests before deploying to production.${NC}"
    echo -e "${CYAN}========================================${NC}"
    exit 1
fi