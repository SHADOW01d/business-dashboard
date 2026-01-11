#!/usr/bin/env python
"""
Quick test to verify PDF is working - run this to confirm
"""
import os
import sys
import django

# Setup Django
sys.path.append('/home/dreamer/business-dashboard')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from reports.views import ReportViewSet
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request

def quick_test():
    print("🧪 Testing PDF generation...")
    
    # Get or create user
    user, _ = User.objects.get_or_create(username='testuser', defaults={'email': 'test@test.com'})
    
    # Create request
    factory = APIRequestFactory()
    request = factory.get('/api/reports/reports/generate/?period=daily')
    request.user = user
    drf_request = Request(request)
    
    # Generate PDF
    viewset = ReportViewSet()
    viewset.request = drf_request
    
    try:
        response = viewset.generate(drf_request)
        if response.status_code == 200 and response.content.startswith(b'%PDF'):
            print("✅ PDF generation works perfectly!")
            with open('final_test_report.pdf', 'wb') as f:
                f.write(response.content)
            print("📄 Sample PDF saved as 'final_test_report.pdf'")
            return True
        else:
            print("❌ Something went wrong")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    quick_test()
