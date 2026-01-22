#!/bin/bash

# API Testing Script for whatsnextup
API_URL="https://whatsnextup-api-214675476458.us-central1.run.app"

echo "🧪 Testing whatsnextup API Endpoints"
echo "====================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
curl -s "${API_URL}/health" | jq '.'
echo ""

# Test 2: Chat Endpoint (no auth - should fail)
echo "2️⃣  Testing Chat Endpoint (anonymous)..."
curl -s -X POST "${API_URL}/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I want to test the API"}' | jq '.'
echo ""

# Test 3: Memories Endpoint (no auth - should fail with 401)
echo "3️⃣  Testing GET /api/memories (no auth - expect 401)..."
curl -s "${API_URL}/api/memories" | head -5
echo ""

# Test 4: Plans Endpoint (no auth - should fail with 401)
echo "4️⃣  Testing GET /api/plans (no auth - expect 401)..."
curl -s "${API_URL}/api/plans" | head -5
echo ""

# Test 5: Reflections Endpoint (no auth - should fail with 401)
echo "5️⃣  Testing GET /api/reflections (no auth - expect 401)..."
curl -s "${API_URL}/api/reflections" | head -5
echo ""

echo "✅ Basic API tests complete!"
echo ""
echo "ℹ️  Note: Protected endpoints require Firebase auth token."
echo "   Test authenticated endpoints via the frontend at whatsnextup.com"
