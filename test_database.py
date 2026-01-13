#!/usr/bin/env python3
"""
Database connectivity test script for Render deployment
"""
import os
import django
from django.conf import settings
from django.db import connection
from django.core.management import execute_from_command_line

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def test_database_connection():
    """Test database connectivity and migrations"""
    print("🔍 Testing Database Configuration")
    print("=" * 50)
    
    # Check database configuration
    print(f"📊 Database Engine: {settings.DATABASES['default']['ENGINE']}")
    print(f"📊 Database Name: {settings.DATABASES['default']['NAME']}")
    
    # Test connection
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print(f"✅ Database Connection: SUCCESS (result: {result})")
    except Exception as e:
        print(f"❌ Database Connection: FAILED - {e}")
        return False
    
    # Check if tables exist
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """)
            tables = cursor.fetchall()
            print(f"📋 Database Tables: {len(tables)} found")
            for table in tables[:10]:  # Show first 10
                print(f"  - {table[0]}")
            if len(tables) > 10:
                print(f"  ... and {len(tables) - 10} more")
    except Exception as e:
        print(f"❌ Table Query Failed: {e}")
    
    # Test migrations
    print("\n🔄 Checking Migrations...")
    try:
        from django.core.management import call_command
        call_command('showmigrations', '--plan', verbosity=0)
        print("✅ Migrations check completed")
    except Exception as e:
        print(f"❌ Migration Check Failed: {e}")
    
    return True

def test_models():
    """Test if models can be created and retrieved"""
    print("\n🧪 Testing Model Operations")
    print("=" * 50)
    
    try:
        from django.contrib.auth.models import User
        from expenses.models import Expense
        from inventory.models import Stock
        from shops.models import Shop
        
        # Test User
        user_count = User.objects.count()
        print(f"👥 Users in database: {user_count}")
        
        # Test Expenses
        expense_count = Expense.objects.count()
        print(f"💰 Expenses in database: {expense_count}")
        
        # Test Stock
        stock_count = Stock.objects.count()
        print(f"📦 Stock items in database: {stock_count}")
        
        # Test Shops
        shop_count = Shop.objects.count()
        print(f"🏪 Shops in database: {shop_count}")
        
        return True
    except Exception as e:
        print(f"❌ Model Test Failed: {e}")
        return False

def check_environment():
    """Check environment variables"""
    print("\n🌍 Environment Variables")
    print("=" * 50)
    
    env_vars = [
        'DATABASE_URL',
        'DEBUG',
        'SECRET_KEY',
        'ALLOWED_HOSTS'
    ]
    
    for var in env_vars:
        value = os.environ.get(var, 'NOT SET')
        if var == 'DATABASE_URL' and value != 'NOT SET':
            # Hide password in database URL
            if '@' in value:
                parts = value.split('@')
                user_pass = parts[0].split('//')[1]
                if ':' in user_pass:
                    user = user_pass.split(':')[0]
                    value = f"{parts[0].split('//')[0]}//{user}:***@{parts[1]}"
        print(f"🔑 {var}: {value}")

if __name__ == "__main__":
    print("🚀 Business Dashboard Database Diagnostic Tool")
    print("=" * 60)
    
    check_environment()
    
    if test_database_connection():
        test_models()
    
    print("\n" + "=" * 60)
    print("✅ Diagnostic Complete")
