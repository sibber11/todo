#!/bin/bash

echo "Testing Todo App Backend..."
echo ""

# Register
echo "1. Registering user..."
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' | jq
echo ""

# Login
echo "2. Logging in..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' | jq -r '.token')
echo "Token: $TOKEN"
echo ""

# Create Project
echo "3. Creating project..."
PROJECT_ID=$(curl -s -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Work"}' | jq -r '.id')
echo "Project ID: $PROJECT_ID"
echo ""

# Create Todos
echo "4. Creating todos..."
curl -s -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Finish the app\",\"priority\":\"high\",\"project_id\":$PROJECT_ID}" | jq
  
sleep 1

curl -s -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Buy milk\",\"priority\":\"low\",\"project_id\":$PROJECT_ID}" | jq

sleep 1

curl -s -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Old task\",\"priority\":\"medium\",\"project_id\":$PROJECT_ID}" | jq
echo ""

# List Todos
echo "5. Listing todos (should be sorted: incomplete first, oldest first)..."
curl -s -X GET "http://localhost:3000/api/todos?project_id=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
echo ""

# Mark as complete
echo "6. Marking 'Finish the app' as complete..."
TODO_ID=$(curl -s -X GET "http://localhost:3000/api/todos?project_id=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')
  
curl -s -X PUT "http://localhost:3000/api/todos/$TODO_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"completed":true}' | jq
echo ""

# List again
echo "7. Listing todos again (completed should be at bottom)..."
curl -s -X GET "http://localhost:3000/api/todos?project_id=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

echo ""
echo "✅ Backend tests complete!"
