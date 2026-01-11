#!/usr/bin/env python3
"""
Test script for file upload functionality
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.append('/home/dreamer/business-dashboard')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User
from reports.models import UploadedFile
from reports.views import ReportViewSet
from reports.serializers import UploadedFileSerializer
from io import BytesIO

def test_file_upload():
    print("Testing file upload functionality...")
    
    # Create test user
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={'email': 'test@example.com'}
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print("Created test user")
    else:
        print("Using existing test user")
    
    # Create request factory
    factory = RequestFactory()
    
    # Create a simple test file
    from django.core.files.uploadedfile import SimpleUploadedFile
    test_file = SimpleUploadedFile(
        "test_report.pdf", 
        b"Test PDF content for demonstration", 
        content_type="application/pdf"
    )
    
    # Test file upload
    view = ReportViewSet()
    request = factory.post('/api/reports/reports/upload_file/', {'file': test_file})
    request.user = user
    request.FILES = {'file': test_file}
    
    try:
        response = view.upload_file(request)
        print(f"Upload response status: {response.status_code}")
        if response.status_code == 201:
            print("✅ File upload test PASSED")
            data = response.data
            print(f"Uploaded file: {data.get('filename')}")
            return data.get('id')
        else:
            print("❌ File upload test FAILED")
            print(f"Error: {response.data}")
            return None
    except Exception as e:
        print(f"❌ File upload test FAILED with exception: {e}")
        return None

def test_file_list():
    print("\nTesting file list functionality...")
    
    # Get test user
    try:
        user = User.objects.get(username='testuser')
    except User.DoesNotExist:
        print("❌ Test user not found")
        return
    
    # Create request factory
    factory = RequestFactory()
    
    # Test file list
    view = ReportViewSet()
    request = factory.get('/api/reports/reports/list_files/')
    request.user = user
    
    try:
        response = view.list_files(request)
        print(f"List response status: {response.status_code}")
        if response.status_code == 200:
            print("✅ File list test PASSED")
            files = response.data
            print(f"Found {len(files)} files")
            for file in files:
                print(f"  - {file['filename']} ({file['file_size_display']})")
            return True
        else:
            print("❌ File list test FAILED")
            print(f"Error: {response.data}")
            return False
    except Exception as e:
        print(f"❌ File list test FAILED with exception: {e}")
        return False

def test_model_creation():
    print("\nTesting UploadedFile model...")
    
    # Get test user
    try:
        user = User.objects.get(username='testuser')
    except User.DoesNotExist:
        print("❌ Test user not found")
        return False
    
    try:
        # Test model creation
        uploaded_file = UploadedFile.objects.create(
            user=user,
            filename='test_model.pdf',
            file_type='pdf',
            file_size=1024
        )
        print(f"✅ Created UploadedFile: {uploaded_file}")
        
        # Test serializer
        serializer = UploadedFileSerializer(uploaded_file)
        data = serializer.data
        print(f"✅ Serialized data: {data}")
        
        # Clean up
        uploaded_file.delete()
        return True
    except Exception as e:
        print(f"❌ Model test FAILED with exception: {e}")
        return False

if __name__ == '__main__':
    print("🧪 Running file upload functionality tests...\n")
    
    # Test model
    model_ok = test_model_creation()
    
    # Test file list
    list_ok = test_file_list()
    
    # Test file upload
    file_id = test_file_upload()
    
    print(f"\n📊 Test Results:")
    print(f"Model test: {'✅ PASSED' if model_ok else '❌ FAILED'}")
    print(f"List test: {'✅ PASSED' if list_ok else '❌ FAILED'}")
    print(f"Upload test: {'✅ PASSED' if file_id else '❌ FAILED'}")
    
    if model_ok and list_ok and file_id:
        print("\n🎉 All tests PASSED! File upload functionality is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the implementation.")
