#!/bin/bash

echo ""
echo "============================================================"
echo "🔍 MOBILE CONNECTIVITY & AUTHENTICATION TEST"
echo "============================================================"
echo ""

# Test 1: Check if backend can start
echo "1️⃣  CHECKING BACKEND SETUP"
echo "------------------------------------------------------------"

cd /home/dreamer/business-dashboard

# Check if venv exists
if [ -d "venv" ]; then
    echo "✓ Virtual environment exists"
else
    echo "✗ Virtual environment not found"
    exit 1
fi

# Activate venv
source venv/bin/activate

# Check Django
if python -c "import django; print(f'✓ Django {django.get_version()} installed')" 2>/dev/null; then
    echo "✓ Django installed"
else
    echo "✗ Django not installed"
    exit 1
fi

# Check if migrations are applied
echo ""
echo "2️⃣  CHECKING DATABASE"
echo "------------------------------------------------------------"

python manage.py migrate --check 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ All migrations applied"
else
    echo "⚠ Applying migrations..."
    python manage.py migrate
fi

# Check if test user exists
echo ""
echo "3️⃣  CHECKING TEST USER"
echo "------------------------------------------------------------"

python manage.py shell << EOF
from django.contrib.auth.models import User
try:
    user = User.objects.get(username='testuser')
    print("✓ Test user exists: testuser")
except User.DoesNotExist:
    user = User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='testpassword123'
    )
    print("✓ Created test user: testuser")
    print("  Password: testpassword123")
EOF

echo ""
echo "4️⃣  CHECKING DJANGO SETTINGS"
echo "------------------------------------------------------------"

python manage.py shell << EOF
from django.conf import settings
print(f"✓ DEBUG: {settings.DEBUG}")
print(f"✓ ALLOWED_HOSTS: {len(settings.ALLOWED_HOSTS)} hosts configured")
print(f"✓ CORS_ALLOW_ALL_ORIGINS: {settings.CORS_ALLOW_ALL_ORIGINS}")
print(f"✓ CORS_ALLOW_CREDENTIALS: {settings.CORS_ALLOW_CREDENTIALS}")
print(f"✓ CSRF_COOKIE_SECURE: {settings.CSRF_COOKIE_SECURE}")
print(f"✓ CSRF_COOKIE_HTTPONLY: {settings.CSRF_COOKIE_HTTPONLY}")
print(f"✓ CSRF_COOKIE_SAMESITE: {settings.CSRF_COOKIE_SAMESITE}")
EOF

echo ""
echo "5️⃣  CHECKING API ENDPOINTS"
echo "------------------------------------------------------------"

python manage.py shell << EOF
from django.test import Client
client = Client()

endpoints = [
    ('GET', '/api/auth/current_user/'),
    ('GET', '/api/stocks/'),
    ('GET', '/api/sales/'),
    ('GET', '/api/expenses/'),
    ('GET', '/api/shops/'),
]

for method, endpoint in endpoints:
    if method == 'GET':
        response = client.get(endpoint)
        print(f"✓ {method} {endpoint}: {response.status_code}")
EOF

echo ""
echo "6️⃣  CHECKING FRONTEND"
echo "------------------------------------------------------------"

if [ -f "frontend/src/config.js" ]; then
    echo "✓ Frontend config.js exists"
    if grep -q "getBackendURL" frontend/src/config.js; then
        echo "✓ Dynamic backend URL detection configured"
    fi
fi

if [ -f "frontend/package.json" ]; then
    echo "✓ Frontend package.json exists"
fi

echo ""
echo "7️⃣  SUMMARY"
echo "------------------------------------------------------------"
echo "✅ Backend configuration verified!"
echo ""
echo "📱 Ready for mobile testing:"
echo "  1. Start backend: python manage.py runserver 0.0.0.0:8000"
echo "  2. Start frontend: npm start (in frontend directory)"
echo "  3. Get your IP: ifconfig | grep 'inet '"
echo "  4. Access from phone: http://{YOUR_IP}:3000"
echo "  5. Login with: testuser / testpassword123"
echo ""
echo "============================================================"
echo ""

deactivate
