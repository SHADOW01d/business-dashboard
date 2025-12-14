"""
Tests for authentication endpoints
"""
from django.test import TestCase, Client
from django.contrib.auth.models import User
import json


class AuthenticationTests(TestCase):
    """Test authentication flow"""
    
    def setUp(self):
        """Set up test client and user"""
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_login_success(self):
        """Test successful login"""
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.content)
        self.assertIn('error', data)
    
    def test_logout_clears_session(self):
        """Test that logout clears session"""
        # First login
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        # Then logout
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, 200)
        
        # Try to access protected endpoint
        response = self.client.get('/api/auth/current_user/')
        self.assertEqual(response.status_code, 403)
    
    def test_current_user_authenticated(self):
        """Test getting current user when authenticated"""
        # Login first
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        # Get current user
        response = self.client.get('/api/auth/current_user/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data['username'], 'testuser')
    
    def test_current_user_not_authenticated(self):
        """Test getting current user when not authenticated"""
        response = self.client.get('/api/auth/current_user/')
        self.assertEqual(response.status_code, 403)
    
    def test_register_new_user(self):
        """Test user registration"""
        response = self.client.post(
            '/api/auth/register/',
            data=json.dumps({
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'newpass123',
                'password_confirm': 'newpass123',
                'first_name': 'New',
                'last_name': 'User'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertEqual(data['username'], 'newuser')
        
        # Verify user was created
        user = User.objects.get(username='newuser')
        self.assertEqual(user.email, 'newuser@example.com')
