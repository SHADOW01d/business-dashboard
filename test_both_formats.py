#!/usr/bin/env python
"""
Test both PDF and DOCX generation
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

def test_both_formats():
    print("🧪 Testing PDF and DOCX generation...")
    
    # Get or create user
    user, _ = User.objects.get_or_create(username='testuser', defaults={'email': 'test@test.com'})
    
    # Test PDF
    print("\n📄 Testing PDF generation...")
    factory = APIRequestFactory()
    request = factory.get('/api/reports/reports/generate/?period=daily&format=pdf')
    request.user = user
    drf_request = Request(request)
    
    viewset = ReportViewSet()
    viewset.request = drf_request
    
    try:
        response = viewset.generate(drf_request)
        if response.status_code == 200 and response.content.startswith(b'%PDF'):
            print("✅ PDF generation works!")
            with open('test_final_pdf.pdf', 'wb') as f:
                f.write(response.content)
            print("📄 PDF saved as 'test_final_pdf.pdf'")
        else:
            print("❌ PDF generation failed")
    except Exception as e:
        print(f"❌ PDF error: {e}")
    
    # Test DOCX
    print("\n📝 Testing DOCX generation...")
    request = factory.get('/api/reports/reports/generate/?period=daily&format=docx')
    request.user = user
    drf_request = Request(request)
    viewset.request = drf_request
    
    try:
        response = viewset.generate(drf_request)
        if response.status_code == 200:
            # Check if it's a valid DOCX file
            content = response.content
            if content.startswith(b'PK\x03\x04'):  # ZIP signature (DOCX is a ZIP file)
                print("✅ DOCX generation works!")
                with open('test_final_docx.docx', 'wb') as f:
                    f.write(response.content)
                print("📝 DOCX saved as 'test_final_docx.docx'")
            else:
                print("❌ DOCX generation failed - not a valid DOCX file")
        else:
            print(f"❌ DOCX generation failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ DOCX error: {e}")

if __name__ == '__main__':
    test_both_formats()
