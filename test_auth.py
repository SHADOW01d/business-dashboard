#!/usr/bin/env python3
"""
Quick Authentication Fix Test
Run this to verify authentication is working
"""
import os
import django
from django.test import Client
from django.contrib.auth.models import User

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_authentication():
    """Test authentication endpoints"""
    print("🔐 Testing Authentication System")
    print("=" * 40)
    
    client = Client()
    
    # Test current user endpoint
    response = client.get('/api/auth/current_user/')
    print(f"📊 Current User Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Endpoint accessible")
    elif response.status_code == 401:
        print("❌ Authentication required (this is expected for unauthenticated)")
    elif response.status_code == 403:
        print("❌ CSRF token missing")
    else:
        print(f"❌ Unexpected error: {response.status_code}")
    
    # Test stock endpoint
    response = client.get('/api/stock/')
    print(f"📦 Stock Endpoint Status: {response.status_code}")
    if response.status_code == 401:
        print("❌ Stock requires authentication (expected)")
    elif response.status_code == 403:
        print("❌ Stock CSRF issue")
    else:
        print(f"📊 Stock response: {response.status_code}")
    
    # Check if users exist
    user_count = User.objects.count()
    print(f"👥 Users in database: {user_count}")
    
    # Check settings
    from django.conf import settings
    print(f"🔧 DEBUG mode: {settings.DEBUG}")
    print(f"🔧 CORS_ALLOW_ALL_ORIGINS: {getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', 'Not set')}")
    print(f"🔧 CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'Not set')}")
    print(f"🔧 CSRF_TRUSTED_ORIGINS: {getattr(settings, 'CSRF_TRUSTED_ORIGINS', 'Not set')}")

if __name__ == "__main__":
    test_authentication()
