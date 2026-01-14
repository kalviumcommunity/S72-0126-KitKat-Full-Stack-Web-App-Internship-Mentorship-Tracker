#!/bin/bash
# Master test runner for Linux/Mac
# Runs all available test suites

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}UIMP Complete Test Suite Runner${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Test counters
total_suites=0
passed_suites=0
failed_suites=0

# Check if server is running
echo -e "${YELLOW}Checking server status...${NC}"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not running!${NC}"
    echo ""
    echo -e "${YELLOW}Please start the server first:${NC}"
    echo -e "  cd server"
    echo -e "  npm run dev"
    echo ""
    exit 1
fi

echo ""

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

# Make scripts executable
chmod +x test-e2e.sh 2>/dev/null || true
chmod +x test-feedback.sh 2>/dev/null || true

# Run all test suites
run_test_suite "End-to-End Tests" "./test-e2e.sh"
run_test_suite "Feedback API Tests" "./test-feedback.sh"

# Summary
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}Complete Test Suite Summary${NC}"
echo -e "${CYAN}========================================${NC}"
echo "Total Test Suites:  $total_suites"
echo -e "${GREEN}Passed:             $passed_suites${NC}"
echo -e "${RED}Failed:             $failed_suites${NC}"

if [ $failed_suites -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All test suites passed!${NC}"
    echo -e "${CYAN}========================================${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some test suites failed. Please review the output above.${NC}"
    echo -e "${CYAN}========================================${NC}"
    exit 1
fi
