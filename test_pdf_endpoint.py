#!/usr/bin/env python
"""
Test script to verify the PDF report endpoint
"""
import os
import sys
import django

# Setup Django
sys.path.append('/home/dreamer/business-dashboard')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import RequestFactory
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import User
from reports.views import ReportViewSet
from datetime import date, timedelta

def test_pdf_endpoint():
    """Test the PDF report endpoint"""
    try:
        print("Testing PDF report endpoint...")
        
        # Create or get a test user
        user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
            }
        )
        if not created:
            # Set password if user already exists
            user.set_password('testpass123')
            user.save()
        
        # Create DRF request factory
        factory = APIRequestFactory()
        request = factory.get('/api/reports/reports/generate/?period=daily')
        request.user = user
        
        # Create viewset instance
        viewset = ReportViewSet()
        viewset.request = request
        viewset.format_kwarg = None
        
        # Call the generate method
        response = viewset.generate(request)
        
        print(f"Response status: {response.status_code}")
        print(f"Response content type: {response.get('Content-Type')}")
        print(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            content = response.content
            print(f"PDF size: {len(content)} bytes")
            
            # Check if it's actually a PDF
            if content.startswith(b'%PDF'):
                print("✅ Response is a valid PDF!")
                
                # Save test PDF
                with open('/home/dreamer/business-dashboard/test_endpoint_report.pdf', 'wb') as f:
                    f.write(content)
                print("Test PDF saved as test_endpoint_report.pdf")
                
                return True
            else:
                print("❌ Response is not a PDF!")
                print(f"First 100 bytes: {content[:100]}")
                return False
        else:
            print(f"❌ Endpoint returned error: {response.status_code}")
            if hasattr(response, 'content'):
                print(f"Error content: {response.content}")
            return False
            
    except Exception as e:
        print(f"Error testing endpoint: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Clean up test user
        try:
            User.objects.filter(username='testuser').delete()
        except:
            pass

if __name__ == '__main__':
    success = test_pdf_endpoint()
    if success:
        print("✅ PDF endpoint test passed!")
    else:
        print("❌ PDF endpoint test failed!")
