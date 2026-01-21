#!/bin/bash

# UIMP Authentication System Test Script
# This script tests the authentication and RBAC system

BASE_URL="http://localhost:3001/api"
COOKIE_JAR="cookies.txt"

echo "🚀 Testing UIMP Authentication System"
echo "======================================"

# Clean up previous cookies
rm -f $COOKIE_JAR

echo ""
echo "1. Testing Public Route (No Auth Required)"
echo "----------------------------------------"
curl -s -X GET "$BASE_URL/auth-test/public" | jq '.'

echo ""
echo "2. Testing User Registration"
echo "---------------------------"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-student@example.com",
    "password": "password123",
    "role": "STUDENT",
    "firstName": "Test",
    "lastName": "Student"
  }')

echo $SIGNUP_RESPONSE | jq '.'

if echo $SIGNUP_RESPONSE | jq -e '.success' > /dev/null; then
  echo "✅ Signup successful"
else
  echo "❌ Signup failed"
fi

echo ""
echo "3. Testing User Login"
echo "--------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{
    "email": "test-student@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE | jq '.'

if echo $LOGIN_RESPONSE | jq -e '.success' > /dev/null; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  exit 1
fi

echo ""
echo "4. Testing Protected Route (Auth Required)"
echo "-----------------------------------------"
curl -s -X GET "$BASE_URL/auth/me" -b $COOKIE_JAR | jq '.'

echo ""
echo "5. Testing Role-Based Access Control"
echo "-----------------------------------"

echo "Testing Student-only route:"
curl -s -X GET "$BASE_URL/auth-test/student-only" -b $COOKIE_JAR | jq '.'

echo ""
echo "Testing Mentor-only route (should fail):"
curl -s -X GET "$BASE_URL/auth-test/mentor-only" -b $COOKIE_JAR | jq '.'

echo ""
echo "Testing Admin-only route (should fail):"
curl -s -X GET "$BASE_URL/auth-test/admin-only" -b $COOKIE_JAR | jq '.'

echo ""
echo "6. Testing Token Information"
echo "---------------------------"
curl -s -X GET "$BASE_URL/auth-test/token-info" -b $COOKIE_JAR | jq '.'

echo ""
echo "7. Testing Role Hierarchy"
echo "------------------------"
curl -s -X GET "$BASE_URL/auth-test/role-info" -b $COOKIE_JAR | jq '.'

echo ""
echo "8. Testing Logout"
echo "----------------"
LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" -b $COOKIE_JAR)
echo $LOGOUT_RESPONSE | jq '.'

echo ""
echo "9. Testing Access After Logout (should fail)"
echo "--------------------------------------------"
curl -s -X GET "$BASE_URL/auth/me" -b $COOKIE_JAR | jq '.'

echo ""
echo "10. Testing Rate Limiting (Login Attempts)"
echo "------------------------------------------"
echo "Making 6 failed login attempts to trigger rate limiting..."

for i in {1..6}; do
  echo "Attempt $i:"
  curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test-student@example.com",
      "password": "wrongpassword"
    }' | jq -r '.error.message // .message'
done

# Clean up
rm -f $COOKIE_JAR

echo ""
echo "🎉 Authentication system test completed!"
echo "========================================"
echo ""
echo "To test with different roles, create users with MENTOR or ADMIN roles:"
echo "curl -X POST $BASE_URL/auth/signup -H 'Content-Type: application/json' -d '{\"email\":\"mentor@example.com\",\"password\":\"password123\",\"role\":\"MENTOR\"}'"
echo "curl -X POST $BASE_URL/auth/signup -H 'Content-Type: application/json' -d '{\"email\":\"admin@example.com\",\"password\":\"password123\",\"role\":\"ADMIN\"}'"