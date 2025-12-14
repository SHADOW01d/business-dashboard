#!/bin/bash

# 🚀 QUICK COMMANDS - Multi-Shop System Setup

echo "🔧 Multi-Shop System - Quick Setup"
echo "===================================="
echo ""

# Step 1: Delete old migrations
echo "Step 1: Cleaning old migrations..."
cd /home/dreamer/business-dashboard
rm -f sales/migrations/0*.py
echo "✅ Old migrations deleted"
echo ""

# Step 2: Create migrations
echo "Step 2: Creating migrations..."
python manage.py makemigrations sales
echo "✅ Migrations created"
echo ""

# Step 3: Apply migrations
echo "Step 3: Applying migrations..."
python manage.py migrate
echo "✅ Migrations applied"
echo ""

# Step 4: Create default shops
echo "Step 4: Creating default shops..."
python create_default_shops.py
echo "✅ Default shops created"
echo ""

# Step 5: Instructions
echo "Step 5: Ready to start servers!"
echo ""
echo "🚀 In Terminal 1, run:"
echo "   python manage.py runserver"
echo ""
echo "🚀 In Terminal 2, run:"
echo "   cd frontend && npm start"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "✅ All done! Your multi-shop system is ready!"
