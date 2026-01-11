#!/usr/bin/env python
"""
Simple test to verify PDF generation works
"""
import os
import sys
import django

# Setup Django
sys.path.append('/home/dreamer/business-dashboard')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from reports.views import ReportViewSet
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory
from django.http import HttpRequest

def test_pdf_simple():
    """Simple PDF generation test"""
    try:
        print("Testing PDF generation with mock data...")
        
        # Create or get a test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={'email': 'test@example.com'}
        )
        
        # Create a proper DRF request
        factory = APIRequestFactory()
        django_request = factory.get('/api/reports/reports/generate/?period=daily')
        django_request.user = user
        
        # Convert to DRF request
        drf_request = Request(django_request)
        
        # Create viewset instance
        viewset = ReportViewSet()
        viewset.request = drf_request
        viewset.format_kwarg = None
        
        # Call the generate method
        response = viewset.generate(drf_request)
        
        print(f"Response status: {response.status_code}")
        print(f"Response content type: {response.get('Content-Type')}")
        
        if response.status_code == 200:
            content = response.content
            print(f"PDF size: {len(content)} bytes")
            
            # Check if it's actually a PDF
            if content.startswith(b'%PDF'):
                print("✅ Response is a valid PDF!")
                
                # Save test PDF
                with open('/home/dreamer/business-dashboard/test_simple_report.pdf', 'wb') as f:
                    f.write(content)
                print("Test PDF saved as test_simple_report.pdf")
                
                return True
            else:
                print("❌ Response is not a PDF!")
                print(f"First 100 bytes: {content[:100]}")
                return False
        else:
            print(f"❌ Endpoint returned error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error testing: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = test_pdf_simple()
    if success:
        print("✅ PDF generation test passed!")
    else:
        print("❌ PDF generation test failed!")
