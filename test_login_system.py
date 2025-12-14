#!/usr/bin/env python3
"""
Test script to verify login system works correctly
Tests both valid and invalid credentials
"""

import os
import sys
import json

# Setup Django first
sys.path.insert(0, '/home/dreamer/business-dashboard')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.test import Client
from django.contrib.auth.models import User

# Create test client
client = Client()

print("=" * 60)
print("LOGIN SYSTEM TEST")
print("=" * 60)

# Test 1: Create a test user
print("\n[TEST 1] Creating test user...")
try:
    # Delete if exists
    User.objects.filter(username='testuser').delete()
    
    test_user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='TestPassword123!',
        first_name='Test',
        last_name='User'
    )
    print(f"✓ Test user created: {test_user.username}")
except Exception as e:
    print(f"✗ Error creating test user: {e}")
    sys.exit(1)

# Test 2: Test valid login
print("\n[TEST 2] Testing valid login...")
response = client.post(
    '/api/auth/login/',
    data=json.dumps({'username': 'testuser', 'password': 'TestPassword123!'}),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 200:
    data = response.json()
    if 'user' in data:
        user_data = data['user']
        print(f"✓ Login successful!")
        print(f"  - Username: {user_data.get('username')}")
        print(f"  - Email: {user_data.get('email')}")
        print(f"  - First Name: {user_data.get('first_name')}")
    else:
        print(f"✗ Response missing 'user' field")
else:
    print(f"✗ Login failed with status {response.status_code}")

# Test 3: Test invalid password
print("\n[TEST 3] Testing invalid password...")
response = client.post(
    '/api/auth/login/',
    data=json.dumps({'username': 'testuser', 'password': 'WrongPassword'}),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 401:
    data = response.json()
    if 'error' in data:
        print(f"✓ Invalid password correctly rejected")
        print(f"  - Error message: {data['error']}")
    else:
        print(f"✗ Response missing 'error' field")
else:
    print(f"✗ Expected status 401, got {response.status_code}")

# Test 4: Test invalid username
print("\n[TEST 4] Testing invalid username...")
response = client.post(
    '/api/auth/login/',
    data=json.dumps({'username': 'nonexistent', 'password': 'SomePassword'}),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 401:
    data = response.json()
    if 'error' in data:
        print(f"✓ Invalid username correctly rejected")
        print(f"  - Error message: {data['error']}")
    else:
        print(f"✗ Response missing 'error' field")
else:
    print(f"✗ Expected status 401, got {response.status_code}")

# Test 5: Test missing credentials
print("\n[TEST 5] Testing missing credentials...")
response = client.post(
    '/api/auth/login/',
    data=json.dumps({'username': 'testuser'}),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 400:
    data = response.json()
    if 'error' in data:
        print(f"✓ Missing credentials correctly rejected")
        print(f"  - Error message: {data['error']}")
    else:
        print(f"✗ Response missing 'error' field")
else:
    print(f"✗ Expected status 400, got {response.status_code}")

# Test 6: Test registration
print("\n[TEST 6] Testing registration...")
response = client.post(
    '/api/auth/register/',
    data=json.dumps({
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'NewPassword123!',
        'password_confirm': 'NewPassword123!',
        'first_name': 'New',
        'last_name': 'User'
    }),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 201:
    print(f"✓ Registration successful")
    
    # Try to login with new user
    print("\n[TEST 6.1] Testing login with newly registered user...")
    response = client.post(
        '/api/auth/login/',
        data=json.dumps({'username': 'newuser', 'password': 'NewPassword123!'}),
        content_type='application/json'
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print(f"✓ New user can login successfully")
    else:
        print(f"✗ New user login failed")
else:
    print(f"✗ Registration failed with status {response.status_code}")

# Test 7: Test password mismatch in registration
print("\n[TEST 7] Testing registration with mismatched passwords...")
response = client.post(
    '/api/auth/register/',
    data=json.dumps({
        'username': 'mismatchuser',
        'email': 'mismatch@example.com',
        'password': 'Password123!',
        'password_confirm': 'DifferentPassword123!',
        'first_name': 'Mismatch',
        'last_name': 'User'
    }),
    content_type='application/json'
)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")

if response.status_code == 400:
    print(f"✓ Mismatched passwords correctly rejected")
else:
    print(f"✗ Expected status 400, got {response.status_code}")

# Cleanup
print("\n[CLEANUP] Removing test users...")
User.objects.filter(username__in=['testuser', 'newuser', 'mismatchuser']).delete()
print("✓ Test users removed")

print("\n" + "=" * 60)
print("LOGIN SYSTEM TEST COMPLETE")
print("=" * 60)
