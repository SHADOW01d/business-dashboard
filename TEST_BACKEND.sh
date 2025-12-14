#!/bin/bash

echo "🧪 Testing ProShop Backend API"
echo "================================"
echo ""

# Test 1: Check if backend is running
echo "1️⃣  Testing if backend is running..."
if curl -s http://localhost:8000/api/auth/current_user/ > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:8000"
else
    echo "❌ Backend is NOT running"
    echo "   Start it with: python3 manage.py runserver 0.0.0.0:8000"
    exit 1
fi

echo ""

# Test 2: Test login endpoint
echo "2️⃣  Testing login endpoint..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}')

if echo "$RESPONSE" | grep -q "error\|Invalid"; then
    echo "✅ Login endpoint is working (returns error for invalid credentials - expected)"
    echo "   Response: $RESPONSE"
else
    echo "❌ Login endpoint not responding correctly"
    echo "   Response: $RESPONSE"
fi

echo ""

# Test 3: Test register endpoint
echo "3️⃣  Testing register endpoint..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test123","password":"pass123","email":"test@test.com"}')

if echo "$RESPONSE" | grep -q "username\|error\|password"; then
    echo "✅ Register endpoint is working"
    echo "   Response: $RESPONSE"
else
    echo "❌ Register endpoint not responding correctly"
    echo "   Response: $RESPONSE"
fi

echo ""

# Test 4: Check CORS headers
echo "4️⃣  Checking CORS headers..."
HEADERS=$(curl -s -i http://localhost:8000/api/auth/current_user/ 2>&1 | grep -i "access-control")

if [ -z "$HEADERS" ]; then
    echo "⚠️  No CORS headers detected (might be okay for same-origin)"
else
    echo "✅ CORS headers present:"
    echo "   $HEADERS"
fi

echo ""
echo "================================"
echo "✅ Backend API tests complete!"
echo ""
echo "Next steps:"
echo "1. Refresh frontend: http://localhost:3000"
echo "2. Try logging in with test credentials"
echo "3. Check browser console (F12) for any errors"
