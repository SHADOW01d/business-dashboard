"""
Tests for sales and stock alert endpoints
"""
from django.test import TestCase, Client
from django.contrib.auth.models import User
from inventory.models import Stock
from sales.models import Sale
import json


class StockAlertTests(TestCase):
    """Test low stock alerts endpoint"""
    
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        # Create test stocks
        self.stock1 = Stock.objects.create(
            user=self.user,
            name='Shirts',
            category='Clothing',
            price=15000,
            quantity_in_stock=50,
            quantity_sold=0,
            min_stock_level=10
        )
        
        self.stock2 = Stock.objects.create(
            user=self.user,
            name='Shoes',
            category='Footwear',
            price=25000,
            quantity_in_stock=5,  # Below min level
            quantity_sold=10,
            min_stock_level=10
        )
        
        self.stock3 = Stock.objects.create(
            user=self.user,
            name='Hats',
            category='Accessories',
            price=5000,
            quantity_in_stock=0,  # Critical
            quantity_sold=20,
            min_stock_level=5
        )
    
    def test_low_stock_alerts_not_authenticated(self):
        """Test that unauthenticated users cannot access alerts"""
        response = self.client.get('/api/sales/low_stock_alerts/')
        self.assertEqual(response.status_code, 401)
    
    def test_low_stock_alerts_authenticated(self):
        """Test getting low stock alerts when authenticated"""
        # Login
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        # Get alerts
        response = self.client.get('/api/sales/low_stock_alerts/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        
        # Should have 2 alerts (Shoes and Hats)
        self.assertEqual(data['total_alerts'], 2)
        self.assertEqual(data['critical_alerts'], 1)  # Hats (0 stock)
        self.assertEqual(data['warning_alerts'], 1)   # Shoes (5 < 10)
    
    def test_low_stock_alerts_structure(self):
        """Test that alert structure is correct"""
        # Login
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        response = self.client.get('/api/sales/low_stock_alerts/')
        data = json.loads(response.content)
        
        # Check first alert
        alert = data['items'][0]
        self.assertIn('product_id', alert)
        self.assertIn('product_name', alert)
        self.assertIn('category', alert)
        self.assertIn('current_stock', alert)
        self.assertIn('min_stock_level', alert)
        self.assertIn('stock_deficit', alert)
        self.assertIn('price', alert)
        self.assertIn('alert_level', alert)
    
    def test_low_stock_alerts_no_alerts(self):
        """Test when there are no low stock alerts"""
        # Create a user with only good stock
        user2 = User.objects.create_user(
            username='testuser2',
            password='testpass123'
        )
        
        Stock.objects.create(
            user=user2,
            name='Pants',
            category='Clothing',
            price=20000,
            quantity_in_stock=100,
            quantity_sold=0,
            min_stock_level=10
        )
        
        # Login as user2
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser2',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        response = self.client.get('/api/sales/low_stock_alerts/')
        data = json.loads(response.content)
        
        self.assertEqual(data['total_alerts'], 0)
        self.assertEqual(data['critical_alerts'], 0)
        self.assertEqual(data['warning_alerts'], 0)
        self.assertEqual(len(data['items']), 0)


class SalesTests(TestCase):
    """Test sales endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        
        self.stock = Stock.objects.create(
            user=self.user,
            name='Shirts',
            category='Clothing',
            price=15000,
            quantity_in_stock=100,
            quantity_sold=0,
            min_stock_level=10
        )
    
    def test_record_sale_updates_stock(self):
        """Test that recording a sale updates stock quantities"""
        # Login
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        # Record sale
        response = self.client.post(
            '/api/sales/',
            data=json.dumps({
                'stock': self.stock.id,
                'quantity': 20,
                'price_per_unit': 15000,
                'total_amount': 300000
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        
        # Check stock was updated
        self.stock.refresh_from_db()
        self.assertEqual(self.stock.quantity_in_stock, 80)  # 100 - 20
        self.assertEqual(self.stock.quantity_sold, 20)      # 0 + 20
    
    def test_daily_summary(self):
        """Test daily sales summary"""
        # Login
        self.client.post(
            '/api/auth/login/',
            data=json.dumps({
                'username': 'testuser',
                'password': 'testpass123'
            }),
            content_type='application/json'
        )
        
        # Record some sales
        self.client.post(
            '/api/sales/',
            data=json.dumps({
                'stock': self.stock.id,
                'quantity': 10,
                'price_per_unit': 15000,
                'total_amount': 150000
            }),
            content_type='application/json'
        )
        
        self.client.post(
            '/api/sales/',
            data=json.dumps({
                'stock': self.stock.id,
                'quantity': 5,
                'price_per_unit': 15000,
                'total_amount': 75000
            }),
            content_type='application/json'
        )
        
        # Get daily summary
        response = self.client.get('/api/sales/daily_summary/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        
        self.assertEqual(data['total_sales'], 2)
        self.assertEqual(data['total_amount'], 225000)
