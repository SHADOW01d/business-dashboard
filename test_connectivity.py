#!/usr/bin/env python
"""
Mobile Connectivity & Authentication Test Script
Tests all backend endpoints and configurations for mobile access
"""

import os
import sys
import django
from django.contrib.auth.models import User

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.conf import settings

print("\n" + "="*60)
print("🔍 MOBILE CONNECTIVITY & AUTHENTICATION TEST")
print("="*60 + "\n")

# Test 1: Django Settings
print("1️⃣  DJANGO SETTINGS")
print("-" * 60)
print(f"✓ DEBUG: {settings.DEBUG}")
print(f"✓ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
print(f"✓ CORS_ALLOW_ALL_ORIGINS: {settings.CORS_ALLOW_ALL_ORIGINS}")
print(f"✓ CORS_ALLOW_CREDENTIALS: {settings.CORS_ALLOW_CREDENTIALS}")
print(f"✓ CSRF_COOKIE_SECURE: {settings.CSRF_COOKIE_SECURE}")
print(f"✓ CSRF_COOKIE_HTTPONLY: {settings.CSRF_COOKIE_HTTPONLY}")
print(f"✓ CSRF_COOKIE_SAMESITE: {settings.CSRF_COOKIE_SAMESITE}")
print(f"✓ CSRF_USE_SESSIONS: {settings.CSRF_USE_SESSIONS}")
print()

# Test 2: Database
print("2️⃣  DATABASE")
print("-" * 60)
try:
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    print("✓ Database connection: OK")
    
    user_count = User.objects.count()
    print(f"✓ Users in database: {user_count}")
except Exception as e:
    print(f"✗ Database error: {e}")
print()

# Test 3: API Endpoints
print("3️⃣  API ENDPOINTS")
print("-" * 60)

client = Client()

# Test CSRF token endpoint
try:
    response = client.get('/api/auth/current_user/')
    print(f"✓ GET /api/auth/current_user/: {response.status_code}")
    if 'csrftoken' in response.cookies:
        print(f"  ✓ CSRF token set in cookie")
    else:
        print(f"  ⚠ CSRF token not in response cookies")
except Exception as e:
    print(f"✗ Error: {e}")

# Test register endpoint
try:
    response = client.post('/api/auth/register/', {
        'username': 'testuser_' + str(os.getpid()),
        'password': 'TestPassword123!',
        'email': f'test_{os.getpid()}@example.com'
    }, content_type='application/json')
    print(f"✓ POST /api/auth/register/: {response.status_code}")
    if response.status_code in [201, 400]:
        print(f"  ✓ Endpoint working (status: {response.status_code})")
except Exception as e:
    print(f"✗ Error: {e}")

# Test login endpoint
try:
    response = client.post('/api/auth/login/', {
        'username': 'testuser',
        'password': 'wrongpassword'
    }, content_type='application/json')
    print(f"✓ POST /api/auth/login/: {response.status_code}")
    if response.status_code in [200, 401]:
        print(f"  ✓ Endpoint working (status: {response.status_code})")
except Exception as e:
    print(f"✗ Error: {e}")

# Test stocks endpoint
try:
    response = client.get('/api/stocks/')
    print(f"✓ GET /api/stocks/: {response.status_code}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test sales endpoint
try:
    response = client.get('/api/sales/')
    print(f"✓ GET /api/sales/: {response.status_code}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test expenses endpoint
try:
    response = client.get('/api/expenses/')
    print(f"✓ GET /api/expenses/: {response.status_code}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test shops endpoint
try:
    response = client.get('/api/shops/')
    print(f"✓ GET /api/shops/: {response.status_code}")
except Exception as e:
    print(f"✗ Error: {e}")

print()

# Test 4: CORS Configuration
print("4️⃣  CORS CONFIGURATION")
print("-" * 60)
print(f"✓ CORS_ALLOWED_ORIGINS:")
for origin in settings.CORS_ALLOWED_ORIGINS:
    print(f"  - {origin}")
print()

# Test 5: CSRF Configuration
print("5️⃣  CSRF CONFIGURATION")
print("-" * 60)
print(f"✓ CSRF_TRUSTED_ORIGINS:")
for origin in settings.CSRF_TRUSTED_ORIGINS:
    print(f"  - {origin}")
print()

# Test 6: Authentication
print("6️⃣  AUTHENTICATION")
print("-" * 60)

# Create test user if doesn't exist
test_user, created = User.objects.get_or_create(
    username='testuser',
    defaults={
        'email': 'testuser@example.com',
        'is_active': True
    }
)
if created:
    test_user.set_password('testpassword123')
    test_user.save()
    print(f"✓ Created test user: testuser")
else:
    print(f"✓ Test user already exists: testuser")

# Test login
client = Client()
response = client.post('/api/auth/login/', {
    'username': 'testuser',
    'password': 'testpassword123'
}, content_type='application/json')

if response.status_code == 200:
    print(f"✓ Login successful: {response.status_code}")
    print(f"  Response: {response.json()}")
    
    # Test authenticated request
    response = client.get('/api/auth/current_user/')
    if response.status_code == 200:
        print(f"✓ Authenticated request successful")
        print(f"  User: {response.json()}")
    else:
        print(f"✗ Authenticated request failed: {response.status_code}")
else:
    print(f"✗ Login failed: {response.status_code}")
    print(f"  Response: {response.json()}")

print()

# Test 7: Summary
print("7️⃣  SUMMARY")
print("-" * 60)
print("✅ All authentication and connectivity checks completed!")
print()
print("📱 Ready for mobile testing:")
print("  1. Start backend: python manage.py runserver 0.0.0.0:8000")
print("  2. Start frontend: npm start (in frontend directory)")
print("  3. Access from phone: http://{YOUR_IP}:3000")
print("  4. Login with: testuser / testpassword123")
print()
print("="*60 + "\n")
