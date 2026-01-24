#!/bin/bash

# OTP Password Reset API Test Script
# This script demonstrates the complete OTP-based password reset flow

BASE_URL="http://localhost:3001"
TEST_EMAIL="test@example.com"

echo "🚀 Testing OTP Password Reset API Flow"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make API calls and show responses
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}$description${NC}"
    echo "Request: $method $endpoint"
    if [ ! -z "$data" ]; then
        echo "Data: $data"
    fi
    echo "Response:"
    
    if [ -z "$data" ]; then
        curl -s -X $method "$BASE_URL$endpoint" \
             -H "Content-Type: application/json" | jq '.'
    else
        curl -s -X $method "$BASE_URL$endpoint" \
             -H "Content-Type: application/json" \
             -d "$data" | jq '.'
    fi
}

echo -e "\n${GREEN}Step 1: Initiate Password Reset${NC}"
make_request "POST" "/auth/forgot-password" "{\"email\":\"$TEST_EMAIL\"}" "Send OTP to email"

echo -e "\n${YELLOW}⏳ Waiting 2 seconds for OTP generation...${NC}"
sleep 2

echo -e "\n${GREEN}Step 2: Test OTP Verification (with invalid OTP)${NC}"
make_request "POST" "/auth/verify-otp" "{\"email\":\"$TEST_EMAIL\",\"otp\":\"123456\"}" "Verify invalid OTP (should fail)"

echo -e "\n${GREEN}Step 3: Test Password Reset (with invalid OTP)${NC}"
make_request "POST" "/auth/reset-password" "{\"email\":\"$TEST_EMAIL\",\"otp\":\"123456\",\"newPassword\":\"newPassword123!\"}" "Reset password with invalid OTP (should fail)"

echo -e "\n${GREEN}Step 4: Test Rate Limiting${NC}"
echo -e "${YELLOW}Making multiple failed attempts to trigger rate limiting...${NC}"

for i in {1..3}; do
    echo -e "\nAttempt $i:"
    make_request "POST" "/auth/verify-otp" "{\"email\":\"$TEST_EMAIL\",\"otp\":\"999999\"}" "Failed attempt $i"
done

echo -e "\n${GREEN}Step 5: Test Input Validation${NC}"

echo -e "\n${YELLOW}Invalid email format:${NC}"
make_request "POST" "/auth/forgot-password" "{\"email\":\"invalid-email\"}" "Test invalid email format"

echo -e "\n${YELLOW}Invalid OTP format:${NC}"
make_request "POST" "/auth/verify-otp" "{\"email\":\"$TEST_EMAIL\",\"otp\":\"12345\"}" "Test invalid OTP format (5 digits)"

echo -e "\n${YELLOW}Weak password:${NC}"
make_request "POST" "/auth/reset-password" "{\"email\":\"$TEST_EMAIL\",\"otp\":\"123456\",\"newPassword\":\"weak\"}" "Test weak password"

echo -e "\n${GREEN}✅ API Test Complete!${NC}"
echo -e "\n${YELLOW}Notes:${NC}"
echo "- All OTP verifications should fail since we're using dummy OTPs"
echo "- Rate limiting should kick in after multiple failed attempts"
echo "- Input validation should catch malformed requests"
echo "- In development, emails are sent to: ${OTP_TEST_EMAIL:-'user email (no override set)'}"
echo ""
echo "To test with real OTPs:"
echo "1. Check your email (or test email if OTP_TEST_EMAIL is set)"
echo "2. Use the 6-digit OTP from the email in the API calls"
echo "3. Run: npm run test:otp (for automated testing with database access)"