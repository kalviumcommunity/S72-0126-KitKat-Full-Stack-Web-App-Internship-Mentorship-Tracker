#!/bin/bash
# Bash script for End-to-End API Verification
# Tests all major API endpoints and features

BASE_URL="http://localhost:3001/api"
CONTENT_TYPE="application/json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}End-to-End API Verification Test Suite${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Test counters
total_tests=0
passed_tests=0
failed_tests=0

# Variables to store tokens and IDs
student_token=""
mentor_token=""
admin_token=""
student_id=""
mentor_id=""
application_id=""
feedback_id=""

# Function to test endpoints
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local body="$4"
    local expected_status="${5:-200}"
    local token="$6"
    
    ((total_tests++))
    echo -e "${YELLOW}Test $total_tests: $name${NC}"
    
    # Build curl command
    local curl_cmd="curl -s -w '\n%{http_code}' -X $method"
    curl_cmd="$curl_cmd -H 'Content-Type: $CONTENT_TYPE'"
    
    if [ -n "$token" ]; then
        curl_cmd="$curl_cmd -H 'Authorization: Bearer $token'"
    fi
    
    if [ -n "$body" ]; then
        curl_cmd="$curl_cmd -d '$body'"
    fi
    
    curl_cmd="$curl_cmd '$url'"
    
    # Execute request
    local response=$(eval $curl_cmd)
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    # Check status code
    if [ "$http_code" -eq "$expected_status" ] || ([ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ] && [ "$expected_status" -eq 200 ]); then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        ((passed_tests++))
        echo "$body"
    else
        echo -e "  ${RED}✗ FAILED: Expected $expected_status, got $http_code${NC}"
        ((failed_tests++))
        echo ""
    fi
}

# ============================================
# 1. HEALTH CHECK
# ============================================
echo -e "\n${CYAN}=== 1. Health Check ===${NC}"
test_endpoint "Health Check" "GET" "$BASE_URL/../health"

# ============================================
# 2. AUTHENTICATION TESTS
# ============================================
echo -e "\n${CYAN}=== 2. Authentication Tests ===${NC}"

# Register Student
signup_body='{
    "email": "e2e-student@test.com",
    "password": "Student123!",
    "confirmPassword": "Student123!",
    "firstName": "E2E",
    "lastName": "Student",
    "role": "STUDENT"
}'

response=$(test_endpoint "Register Student" "POST" "$BASE_URL/auth/signup" "$signup_body" 201)
student_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Register Mentor
signup_body='{
    "email": "e2e-mentor@test.com",
    "password": "Mentor123!",
    "confirmPassword": "Mentor123!",
    "firstName": "E2E",
    "lastName": "Mentor",
    "role": "MENTOR"
}'

response=$(test_endpoint "Register Mentor" "POST" "$BASE_URL/auth/signup" "$signup_body" 201)
mentor_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Login Student
login_body='{
    "email": "e2e-student@test.com",
    "password": "Student123!"
}'

response=$(test_endpoint "Login Student" "POST" "$BASE_URL/auth/login" "$login_body")
student_token=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Login Mentor
login_body='{
    "email": "e2e-mentor@test.com",
    "password": "Mentor123!"
}'

response=$(test_endpoint "Login Mentor" "POST" "$BASE_URL/auth/login" "$login_body")
mentor_token=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Login Admin (assuming seeded)
login_body='{
    "email": "admin@test.com",
    "password": "Admin123!"
}'

response=$(test_endpoint "Login Admin" "POST" "$BASE_URL/auth/login" "$login_body")
admin_token=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# ============================================
# 3. USER MANAGEMENT TESTS
# ============================================
echo -e "\n${CYAN}=== 3. User Management Tests ===${NC}"

test_endpoint "Get Current User Profile" "GET" "$BASE_URL/users/me" "" 200 "$student_token"
test_endpoint "List All Users (Admin)" "GET" "$BASE_URL/users" "" 200 "$admin_token"

# ============================================
# 4. APPLICATION CRUD TESTS
# ============================================
echo -e "\n${CYAN}=== 4. Application CRUD Tests ===${NC}"

# Create Application
app_body="{
    \"company\": \"E2E Test Corp\",
    \"role\": \"Software Engineer\",
    \"platform\": \"LINKEDIN\",
    \"status\": \"APPLIED\",
    \"notes\": \"End-to-end test application\",
    \"appliedDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")\"
}"

response=$(test_endpoint "Create Application" "POST" "$BASE_URL/applications" "$app_body" 201 "$student_token")
application_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Get Application
test_endpoint "Get Application by ID" "GET" "$BASE_URL/applications/$application_id" "" 200 "$student_token"

# List Applications
test_endpoint "List Applications" "GET" "$BASE_URL/applications?page=1&limit=10" "" 200 "$student_token"

# Update Application
update_body='{
    "status": "INTERVIEW",
    "notes": "Updated to interview stage"
}'

test_endpoint "Update Application" "PATCH" "$BASE_URL/applications/$application_id" "$update_body" 200 "$student_token"

# Get Application Stats
test_endpoint "Get Application Statistics" "GET" "$BASE_URL/applications/stats" "" 200 "$student_token"

# ============================================
# 5. MENTOR ASSIGNMENT TESTS
# ============================================
echo -e "\n${CYAN}=== 5. Mentor Assignment Tests ===${NC}"

# Assign Mentor (Admin only)
assign_body="{
    \"mentorId\": \"$mentor_id\",
    \"studentId\": \"$student_id\"
}"

test_endpoint "Assign Mentor to Student" "POST" "$BASE_URL/users/mentor-assignments" "$assign_body" 201 "$admin_token"

# ============================================
# 6. FEEDBACK TESTS
# ============================================
echo -e "\n${CYAN}=== 6. Feedback Tests ===${NC}"

# Create Feedback (Mentor)
feedback_body="{
    \"applicationId\": \"$application_id\",
    \"content\": \"Great application! Your resume is well-structured. Consider adding more quantifiable achievements and specific technologies you've worked with.\",
    \"tags\": [\"RESUME\", \"COMMUNICATION\"],
    \"priority\": \"HIGH\"
}"

response=$(test_endpoint "Create Feedback (Mentor)" "POST" "$BASE_URL/feedback" "$feedback_body" 201 "$mentor_token")
feedback_id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

# Get Feedback
test_endpoint "Get Feedback by ID" "GET" "$BASE_URL/feedback/$feedback_id" "" 200 "$mentor_token"

# List Feedback
test_endpoint "List Feedback" "GET" "$BASE_URL/feedback?page=1&limit=10" "" 200 "$mentor_token"

# Get Feedback for Application
test_endpoint "Get Application Feedback" "GET" "$BASE_URL/feedback/application/$application_id" "" 200 "$student_token"

# Get Feedback Stats
test_endpoint "Get Feedback Statistics" "GET" "$BASE_URL/feedback/stats" "" 200 "$student_token"

# ============================================
# 7. AUTHORIZATION TESTS
# ============================================
echo -e "\n${CYAN}=== 7. Authorization Tests ===${NC}"

# Student tries to create feedback (should fail)
feedback_body="{
    \"applicationId\": \"$application_id\",
    \"content\": \"This should fail\",
    \"tags\": [\"RESUME\"],
    \"priority\": \"LOW\"
}"

test_endpoint "Student Cannot Create Feedback" "POST" "$BASE_URL/feedback" "$feedback_body" 403 "$student_token"

# Mentor tries to create application (should fail)
app_body='{
    "company": "Test",
    "role": "Test",
    "platform": "LINKEDIN",
    "status": "DRAFT"
}'

test_endpoint "Mentor Cannot Create Application" "POST" "$BASE_URL/applications" "$app_body" 403 "$mentor_token"

# ============================================
# 8. VALIDATION TESTS
# ============================================
echo -e "\n${CYAN}=== 8. Validation Tests ===${NC}"

# Invalid email format
invalid_body='{
    "email": "invalid-email",
    "password": "Test123!"
}'

test_endpoint "Invalid Email Format" "POST" "$BASE_URL/auth/login" "$invalid_body" 400

# Missing required fields
invalid_body='{
    "company": "Test"
}'

test_endpoint "Missing Required Fields" "POST" "$BASE_URL/applications" "$invalid_body" 400 "$student_token"

# ============================================
# 9. PAGINATION TESTS
# ============================================
echo -e "\n${CYAN}=== 9. Pagination Tests ===${NC}"

test_endpoint "Pagination - Page 1" "GET" "$BASE_URL/applications?page=1&limit=5" "" 200 "$student_token"
test_endpoint "Pagination - Page 2" "GET" "$BASE_URL/applications?page=2&limit=5" "" 200 "$student_token"

# ============================================
# 10. FILTERING TESTS
# ============================================
echo -e "\n${CYAN}=== 10. Filtering Tests ===${NC}"

test_endpoint "Filter by Status" "GET" "$BASE_URL/applications?status=INTERVIEW" "" 200 "$student_token"
test_endpoint "Filter by Platform" "GET" "$BASE_URL/applications?platform=LINKEDIN" "" 200 "$student_token"
test_endpoint "Search by Company" "GET" "$BASE_URL/applications?search=E2E" "" 200 "$student_token"

# ============================================
# 11. SORTING TESTS
# ============================================
echo -e "\n${CYAN}=== 11. Sorting Tests ===${NC}"

test_endpoint "Sort by Created Date (Desc)" "GET" "$BASE_URL/applications?sortBy=createdAt&sortOrder=desc" "" 200 "$student_token"
test_endpoint "Sort by Company (Asc)" "GET" "$BASE_URL/applications?sortBy=company&sortOrder=asc" "" 200 "$student_token"

# ============================================
# 12. RATE LIMITING TESTS
# ============================================
echo -e "\n${CYAN}=== 12. Rate Limiting Tests ===${NC}"

echo "  Testing rate limits (this may take a moment)..."
for i in {1..5}; do
    test_endpoint "Rate Limit Test $i" "GET" "$BASE_URL/applications" "" 200 "$student_token"
done

# ============================================
# 13. ERROR HANDLING TESTS
# ============================================
echo -e "\n${CYAN}=== 13. Error Handling Tests ===${NC}"

# Non-existent resource
test_endpoint "404 - Non-existent Application" "GET" "$BASE_URL/applications/00000000-0000-0000-0000-000000000000" "" 404 "$student_token"

# Unauthorized access
test_endpoint "401 - No Token" "GET" "$BASE_URL/applications" "" 401

# Invalid token
test_endpoint "401 - Invalid Token" "GET" "$BASE_URL/applications" "" 401 "invalid-token"

# ============================================
# 14. CLEANUP TESTS
# ============================================
echo -e "\n${CYAN}=== 14. Cleanup Tests ===${NC}"

# Delete Feedback
test_endpoint "Delete Feedback" "DELETE" "$BASE_URL/feedback/$feedback_id" "" 200 "$mentor_token"

# Delete Application
test_endpoint "Delete Application" "DELETE" "$BASE_URL/applications/$application_id" "" 200 "$student_token"

# ============================================
# SUMMARY
# ============================================
echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}Test Summary${NC}"
echo -e "${CYAN}========================================${NC}"
echo "Total Tests:  $total_tests"
echo -e "${GREEN}Passed:       $passed_tests${NC}"
echo -e "${RED}Failed:       $failed_tests${NC}"

success_rate=$(awk "BEGIN {printf \"%.2f\", ($passed_tests / $total_tests) * 100}")
if (( $(echo "$success_rate >= 90" | bc -l) )); then
    color=$GREEN
elif (( $(echo "$success_rate >= 70" | bc -l) )); then
    color=$YELLOW
else
    color=$RED
fi
echo -e "${color}Success Rate: $success_rate%${NC}"

if [ $failed_tests -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
else
    echo -e "\n${RED}✗ Some tests failed. Please review the output above.${NC}"
fi

echo -e "${CYAN}========================================${NC}"
