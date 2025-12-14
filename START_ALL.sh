#!/bin/bash

# ProShop Business Dashboard - Complete Startup Script
# This script starts both Django backend and React frontend

echo "🚀 Starting ProShop Business Dashboard..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill any existing processes on ports 8000 and 3000
echo -e "${YELLOW}🧹 Cleaning up old processes...${NC}"
lsof -i :8000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9 2>/dev/null
sleep 1

# Start Backend (Django)
echo -e "${BLUE}📦 Starting Django Backend...${NC}"
cd /home/dreamer/business-dashboard
source venv/bin/activate
python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
echo "   URL: http://localhost:8000"
echo ""

# Wait for backend to start
sleep 2

# Start Frontend (React)
echo -e "${BLUE}⚛️  Starting React Frontend...${NC}"
cd /home/dreamer/business-dashboard/frontend
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
echo "   URL: http://localhost:3000"
echo ""

echo -e "${GREEN}🎉 ProShop Dashboard is running!${NC}"
echo ""
echo "📊 Backend:  http://localhost:8000"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
