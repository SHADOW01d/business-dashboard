#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🌐 ngrok Tunnel Setup for ProShop Dashboard        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}❌ ngrok is not installed!${NC}"
    echo ""
    echo "Install ngrok:"
    echo "  Mac:   brew install ngrok/ngrok/ngrok"
    echo "  Linux: Download from https://ngrok.com/download"
    echo "  Windows: choco install ngrok"
    echo ""
    echo "Then authenticate:"
    echo "  ngrok config add-authtoken YOUR_AUTH_TOKEN"
    exit 1
fi

echo -e "${GREEN}✅ ngrok is installed${NC}"
echo ""

# Check if Django is running
echo -e "${YELLOW}Checking if Django is running on port 8000...${NC}"
if ! nc -z localhost 8000 2>/dev/null; then
    echo -e "${RED}⚠️  Django is NOT running on port 8000${NC}"
    echo -e "${YELLOW}Start Django first:${NC}"
    echo "  python manage.py runserver"
    echo ""
fi

# Check if React is running
echo -e "${YELLOW}Checking if React is running on port 3000...${NC}"
if ! nc -z localhost 3000 2>/dev/null; then
    echo -e "${RED}⚠️  React is NOT running on port 3000${NC}"
    echo -e "${YELLOW}Start React first (in frontend directory):${NC}"
    echo "  npm start"
    echo ""
fi

echo -e "${YELLOW}Starting ngrok tunnels...${NC}"
echo ""

# Create log files
mkdir -p logs
LOG_DIR="logs"

# Start backend tunnel in background
echo -e "${BLUE}Starting backend tunnel (port 8000)...${NC}"
ngrok http 8000 --log=stdout > "$LOG_DIR/ngrok_backend.log" 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend tunnel PID: $BACKEND_PID${NC}"

# Wait for tunnel to initialize
sleep 4

# Start frontend tunnel in background
echo -e "${BLUE}Starting frontend tunnel (port 3000)...${NC}"
ngrok http 3000 --log=stdout > "$LOG_DIR/ngrok_frontend.log" 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend tunnel PID: $FRONTEND_PID${NC}"

# Wait for tunnels to fully initialize
sleep 4

echo ""
echo -e "${YELLOW}Fetching tunnel URLs...${NC}"

# Try to get URLs from ngrok API
BACKEND_URL=""
FRONTEND_URL=""

for i in {1..5}; do
    RESPONSE=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null)
    
    if [ ! -z "$RESPONSE" ]; then
        # Extract URLs from JSON response
        BACKEND_URL=$(echo "$RESPONSE" | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
        FRONTEND_URL=$(echo "$RESPONSE" | grep -o '"public_url":"https://[^"]*' | tail -1 | cut -d'"' -f4)
        
        if [ ! -z "$BACKEND_URL" ] && [ ! -z "$FRONTEND_URL" ]; then
            break
        fi
    fi
    
    if [ $i -lt 5 ]; then
        echo -e "${YELLOW}Waiting for tunnels to initialize... ($i/5)${NC}"
        sleep 2
    fi
done

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ ngrok Tunnels Started!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

if [ ! -z "$BACKEND_URL" ] && [ ! -z "$FRONTEND_URL" ]; then
    echo -e "${BLUE}📡 Tunnel URLs:${NC}"
    echo -e "${YELLOW}Backend:  ${NC}$BACKEND_URL"
    echo -e "${YELLOW}Frontend: ${NC}$FRONTEND_URL"
    echo ""
    
    # Extract domains
    BACKEND_DOMAIN="${BACKEND_URL#https://}"
    FRONTEND_DOMAIN="${FRONTEND_URL#https://}"
    
    echo -e "${BLUE}📝 Configuration Required:${NC}"
    echo ""
    echo -e "${YELLOW}1. Update Django ALLOWED_HOSTS:${NC}"
    echo "   Edit: config/settings.py"
    echo "   Add to ALLOWED_HOSTS list:"
    echo "   '$BACKEND_DOMAIN',"
    echo ""
    echo -e "${YELLOW}2. Update Django CORS_ALLOWED_ORIGINS:${NC}"
    echo "   Edit: config/settings.py"
    echo "   Add to CORS_ALLOWED_ORIGINS list:"
    echo "   '$FRONTEND_URL',"
    echo ""
    echo -e "${YELLOW}3. Update React API_BASE_URL:${NC}"
    echo "   Edit: frontend/src/config.js"
    echo "   Set: const API_BASE_URL = '$BACKEND_URL';"
    echo ""
    
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "   1. Update the configuration above"
    echo "   2. Restart Django: python manage.py runserver"
    echo "   3. Restart React: cd frontend && npm start"
    echo "   4. Access your app at: $FRONTEND_URL"
    echo ""
    
    echo -e "${BLUE}📊 Monitor Requests:${NC}"
    echo "   Open: http://localhost:4040"
    echo ""
    
    echo -e "${BLUE}📱 Test on Mobile:${NC}"
    echo "   Open on phone: $FRONTEND_URL"
    echo "   Login and test all features"
    echo ""
    
else
    echo -e "${RED}⚠️  Could not fetch tunnel URLs${NC}"
    echo ""
    echo -e "${YELLOW}Check ngrok status:${NC}"
    echo "   curl http://localhost:4040/api/tunnels"
    echo ""
    echo -e "${YELLOW}View logs:${NC}"
    echo "   tail -f $LOG_DIR/ngrok_backend.log"
    echo "   tail -f $LOG_DIR/ngrok_frontend.log"
    echo ""
fi

echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop ngrok tunnels${NC}"
echo -e "${YELLOW}════════════════════════════════════════════════════════════${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping ngrok tunnels...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ ngrok tunnels stopped${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
wait
