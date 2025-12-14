"""
Script to create default shops for existing users
Run this after migrations: python create_default_shops.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from sales.models import Shop

def create_default_shops():
    """Create a default shop for each user that doesn't have one"""
    users = User.objects.all()
    created_count = 0
    
    for user in users:
        # Check if user already has shops
        existing_shops = Shop.objects.filter(user=user)
        
        if not existing_shops.exists():
            # Create default shop
            shop = Shop.objects.create(
                user=user,
                name="Main Shop",
                location="Default",
                description="Your main shop",
                is_active=True
            )
            print(f"✅ Created default shop for user: {user.username}")
            created_count += 1
        else:
            # Make sure at least one shop is active
            if not existing_shops.filter(is_active=True).exists():
                first_shop = existing_shops.first()
                first_shop.is_active = True
                first_shop.save()
                print(f"✅ Activated shop for user: {user.username}")
    
    print(f"\n✅ Total shops created: {created_count}")
    print(f"✅ Total users processed: {users.count()}")

if __name__ == '__main__':
    print("Creating default shops for existing users...\n")
    create_default_shops()
    print("\n✅ Done!")
