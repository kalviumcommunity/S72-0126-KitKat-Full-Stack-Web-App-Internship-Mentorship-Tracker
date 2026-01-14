#!/bin/bash

# Bash script to test Feedback API endpoints
# Tests mentor authorization and feedback CRUD operations

BASE_URL="http://localhost:3000/api"

echo "========================================"
echo "Feedback API Test Script"
echo "========================================"
echo ""

# Variables to store tokens and IDs
MENTOR_TOKEN=""
STUDENT_TOKEN=""
ADMIN_TOKEN=""
APPLICATION_ID=""
FEEDBACK_ID=""

# Test 1: Login as Student
echo "Test 1: Login as Student"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "Student123!"
  }')

STUDENT_TOKEN=$(echo $RESPONSE | jq -r '.data.token')
if [ "$STUDENT_TOKEN" != "null" ] && [ -n "$STUDENT_TOKEN" ]; then
  echo "✓ Student login successful"
  echo "  Token: ${STUDENT_TOKEN:0:20}..."
else
  echo "✗ Student login failed"
  echo "  Response: $RESPONSE"
fi
echo ""

# Test 2: Login as Mentor
echo "Test 2: Login as Mentor"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mentor@test.com",
    "password": "Mentor123!"
  }')

MENTOR_TOKEN=$(echo $RESPONSE | jq -r '.data.token')
if [ "$MENTOR_TOKEN" != "null" ] && [ -n "$MENTOR_TOKEN" ]; then
  echo "✓ Mentor login successful"
  echo "  Token: ${MENTOR_TOKEN:0:20}..."
else
  echo "✗ Mentor login failed"
  echo "  Response: $RESPONSE"
fi
echo ""

# Test 3: Login as Admin
echo "Test 3: Login as Admin"
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }')

ADMIN_TOKEN=$(echo $RESPONSE | jq -r '.data.token')
if [ "$ADMIN_TOKEN" != "null" ] && [ -n "$ADMIN_TOKEN" ]; then
  echo "✓ Admin login successful"
  echo "  Token: ${ADMIN_TOKEN:0:20}..."
else
  echo "✗ Admin login failed"
  echo "  Response: $RESPONSE"
fi
echo ""

# Test 4: Create an application as student
echo "Test 4: Create Application as Student"
RESPONSE=$(curl -s -X POST "$BASE_URL/applications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "company": "Test Company",
    "role": "Software Engineer",
    "platform": "LINKEDIN",
    "status": "APPLIED",
    "notes": "Test application for feedback"
  }')

APPLICATION_ID=$(echo $RESPONSE | jq -r '.data.application.id')
if [ "$APPLICATION_ID" != "null" ] && [ -n "$APPLICATION_ID" ]; then
  echo "✓ Application created successfully"
  echo "  Application ID: $APPLICATION_ID"
else
  echo "✗ Application creation failed"
  echo "  Response: $RESPONSE"
fi
echo ""

# Test 5: Student tries to create feedback (should fail)
echo "Test 5: Student Tries to Create Feedback (Should Fail)"
RESPONSE=$(curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d "{
    \"applicationId\": \"$APPLICATION_ID\",
    \"content\": \"This should fail because students cannot create feedback\",
    \"tags\": [\"RESUME\"],
    \"priority\": \"MEDIUM\"
  }")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "false" ]; then
  echo "✓ Student correctly denied from creating feedback"
else
  echo "✗ Student was able to create feedback (should have failed)"
fi
echo ""

# Test 6: Mentor creates feedback
echo "Test 6: Mentor Creates Feedback"
RESPONSE=$(curl -s -X POST "$BASE_URL/feedback" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MENTOR_TOKEN" \
  -d "{
    \"applicationId\": \"$APPLICATION_ID\",
    \"content\": \"Great application! Your resume looks professional. Consider adding more quantifiable achievements and specific technologies you've worked with. The cover letter is well-written.\",
    \"tags\": [\"RESUME\", \"COMMUNICATION\"],
    \"priority\": \"HIGH\"
  }")

FEEDBACK_ID=$(echo $RESPONSE | jq -r '.data.feedback.id')
if [ "$FEEDBACK_ID" != "null" ] && [ -n "$FEEDBACK_ID" ]; then
  echo "✓ Feedback created successfully"
  echo "  Feedback ID: $FEEDBACK_ID"
  CONTENT=$(echo $RESPONSE | jq -r '.data.feedback.content')
  echo "  Content: ${CONTENT:0:50}..."
  TAGS=$(echo $RESPONSE | jq -r '.data.feedback.tags | join(", ")')
  echo "  Tags: $TAGS"
  PRIORITY=$(echo $RESPONSE | jq -r '.data.feedback.priority')
  echo "  Priority: $PRIORITY"
else
  echo "✗ Feedback creation failed"
  echo "  Response: $RESPONSE"
fi
echo ""

# Test 7: Get feedback by ID as student
echo "Test 7: Get Feedback by ID as Student"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback/$FEEDBACK_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Feedback retrieved successfully"
  MENTOR_NAME=$(echo $RESPONSE | jq -r '.data.feedback.mentor.firstName + " " + .data.feedback.mentor.lastName')
  echo "  Mentor: $MENTOR_NAME"
  COMPANY=$(echo $RESPONSE | jq -r '.data.feedback.application.company')
  ROLE=$(echo $RESPONSE | jq -r '.data.feedback.application.role')
  echo "  Application: $COMPANY - $ROLE"
else
  echo "✗ Failed to retrieve feedback"
fi
echo ""

# Test 8: List all feedback as student
echo "Test 8: List All Feedback as Student"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback?page=1&limit=10" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Feedback list retrieved successfully"
  TOTAL=$(echo $RESPONSE | jq -r '.data.pagination.total')
  echo "  Total feedback: $TOTAL"
  COUNT=$(echo $RESPONSE | jq -r '.data.items | length')
  echo "  Items on page: $COUNT"
else
  echo "✗ Failed to list feedback"
fi
echo ""

# Test 9: Get feedback for specific application
echo "Test 9: Get Feedback for Specific Application"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback/application/$APPLICATION_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Application feedback retrieved successfully"
  COUNT=$(echo $RESPONSE | jq -r '.data.feedback | length')
  echo "  Feedback count: $COUNT"
else
  echo "✗ Failed to retrieve application feedback"
fi
echo ""

# Test 10: Update feedback as mentor
echo "Test 10: Update Feedback as Mentor"
RESPONSE=$(curl -s -X PATCH "$BASE_URL/feedback/$FEEDBACK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MENTOR_TOKEN" \
  -d '{
    "content": "Updated feedback: Your resume is excellent! I'\''ve reviewed it again and noticed you'\''ve made great improvements. Keep up the good work!",
    "priority": "MEDIUM"
  }')

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Feedback updated successfully"
  CONTENT=$(echo $RESPONSE | jq -r '.data.feedback.content')
  echo "  New content: ${CONTENT:0:50}..."
  PRIORITY=$(echo $RESPONSE | jq -r '.data.feedback.priority')
  echo "  New priority: $PRIORITY"
else
  echo "✗ Failed to update feedback"
fi
echo ""

# Test 11: Student tries to update feedback (should fail)
echo "Test 11: Student Tries to Update Feedback (Should Fail)"
RESPONSE=$(curl -s -X PATCH "$BASE_URL/feedback/$FEEDBACK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -d '{
    "content": "Student trying to update mentor'\''s feedback"
  }')

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "false" ]; then
  echo "✓ Student correctly denied from updating feedback"
else
  echo "✗ Student was able to update feedback (should have failed)"
fi
echo ""

# Test 12: Get feedback statistics
echo "Test 12: Get Feedback Statistics"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback/stats" \
  -H "Authorization: Bearer $MENTOR_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Feedback statistics retrieved successfully"
  TOTAL=$(echo $RESPONSE | jq -r '.data.stats.total')
  echo "  Total feedback: $TOTAL"
  BY_PRIORITY=$(echo $RESPONSE | jq -c '.data.stats.byPriority')
  echo "  By priority: $BY_PRIORITY"
else
  echo "✗ Failed to retrieve feedback statistics"
fi
echo ""

# Test 13: Filter feedback by tags
echo "Test 13: Filter Feedback by Tags"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback?tags=RESUME&tags=COMMUNICATION" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Filtered feedback retrieved successfully"
  COUNT=$(echo $RESPONSE | jq -r '.data.items | length')
  echo "  Filtered results: $COUNT"
else
  echo "✗ Failed to filter feedback"
fi
echo ""

# Test 14: Filter feedback by priority
echo "Test 14: Filter Feedback by Priority"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback?priority=HIGH&priority=MEDIUM" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Filtered feedback by priority retrieved successfully"
  COUNT=$(echo $RESPONSE | jq -r '.data.items | length')
  echo "  Filtered results: $COUNT"
else
  echo "✗ Failed to filter feedback by priority"
fi
echo ""

# Test 15: Delete feedback as mentor
echo "Test 15: Delete Feedback as Mentor"
RESPONSE=$(curl -s -X DELETE "$BASE_URL/feedback/$FEEDBACK_ID" \
  -H "Authorization: Bearer $MENTOR_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "true" ]; then
  echo "✓ Feedback deleted successfully"
else
  echo "✗ Failed to delete feedback"
fi
echo ""

# Test 16: Verify feedback is deleted
echo "Test 16: Verify Feedback is Deleted"
RESPONSE=$(curl -s -X GET "$BASE_URL/feedback/$FEEDBACK_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN")

SUCCESS=$(echo $RESPONSE | jq -r '.success')
if [ "$SUCCESS" == "false" ]; then
  echo "✓ Feedback correctly deleted"
else
  echo "✗ Feedback still exists (should have been deleted)"
fi
echo ""

echo "========================================"
echo "Feedback API Tests Completed"
echo "========================================"
