#!/bin/bash

# ProShop Mobile Setup Script
# This script helps you set up mobile access to your dashboard

echo "🚀 ProShop Mobile Setup"
echo "======================="
echo ""

# Get local IP address
echo "📱 Finding your computer's IP address..."
echo ""

# Try to get IP (works on Linux/Mac)
IP=$(ifconfig 2>/dev/null | grep -E 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -1)

if [ -z "$IP" ]; then
    # Fallback for systems without ifconfig
    IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

if [ -z "$IP" ]; then
    echo "❌ Could not automatically detect IP address"
    echo ""
    echo "Please find your IP manually:"
    echo "  Linux/Mac: ifconfig | grep 'inet '"
    echo "  Windows: ipconfig"
    echo ""
    read -p "Enter your computer's IP address (e.g., 192.168.1.100): " IP
fi

echo "✅ Your IP Address: $IP"
echo ""

# Confirm with user
read -p "Is this correct? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter correct IP address: " IP
fi

echo ""
echo "🔧 Updating frontend files..."
echo ""

# Files to update
FILES=(
    "frontend/src/pages/Dashboard.js"
    "frontend/src/components/StockForm.js"
    "frontend/src/components/SalesForm.js"
    "frontend/src/components/ExpenseForm.js"
    "frontend/src/components/ReportGenerator.js"
)

# Replace localhost with IP in all files
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        sed -i "s|http://localhost:8000|http://$IP:8000|g" "$file"
        echo "✅ Updated: $file"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Start backend:"
echo "   python manage.py runserver 0.0.0.0:8000"
echo ""
echo "2. In another terminal, start frontend:"
echo "   cd frontend && npm start"
echo ""
echo "3. On your phone, open:"
echo "   http://$IP:3000"
echo ""
echo "🎉 Your ProShop dashboard is now accessible from your phone!"
