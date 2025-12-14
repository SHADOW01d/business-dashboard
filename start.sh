#!/bin/bash

# ProShop - Start both backend and frontend servers

echo "🚀 Starting ProShop Business Dashboard..."
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install -q -r requirements.txt

# Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate --noinput

# Start Django server in background
echo "🔧 Starting Django backend server..."
python manage.py runserver &
DJANGO_PID=$!

# Start React frontend
echo "⚛️ Starting React frontend server..."
cd frontend
npm install --silent
npm start &
REACT_PID=$!

echo ""
echo "✅ ProShop is starting!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $DJANGO_PID $REACT_PID
