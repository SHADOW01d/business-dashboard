#!/bin/bash
# Test script to verify PDF generation works
echo "🚀 Starting PDF generation test..."

cd /home/dreamer/business-dashboard

# Activate virtual environment
source venv/bin/activate

# Start Django server in background
python manage.py runserver 0.0.0.0:8000 &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test the endpoint
echo "📡 Testing PDF endpoint..."
curl -H "Accept: application/pdf" \
     -H "Content-Type: application/json" \
     -b "sessionid=test" \
     -c cookies.txt \
     "http://localhost:8000/api/reports/reports/generate/?period=daily" \
     --output test_download.pdf

# Check if PDF was created
if [ -f test_download.pdf ]; then
    if file test_download.pdf | grep -q "PDF"; then
        echo "✅ SUCCESS: PDF generated correctly!"
        echo "📄 File saved as: test_download.pdf"
        echo "📊 Size: $(wc -c < test_download.pdf) bytes"
    else
        echo "❌ FAILED: Generated file is not a PDF"
        echo "📄 File type: $(file test_download.pdf)"
    fi
else
    echo "❌ FAILED: No file generated"
fi

# Stop server
kill $SERVER_PID 2>/dev/null

echo "🏁 Test completed!"
