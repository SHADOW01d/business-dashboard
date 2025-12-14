# 🌐 ngrok Setup Guide - Access Dashboard Outside Local Network

## What is ngrok?

ngrok is a tool that creates a secure tunnel to your local application, making it accessible from anywhere on the internet. Perfect for testing, demos, and mobile access.

---

## 📋 Prerequisites

- ngrok account (free at https://ngrok.com)
- ngrok installed on your system
- Django backend running on port 8000
- React frontend running on port 3000

---

## 🚀 Step 1: Install ngrok

### On Linux/Mac:
```bash
# Using Homebrew (Mac)
brew install ngrok/ngrok/ngrok

# Or download from https://ngrok.com/download
# Extract and add to PATH
```

### On Windows:
```bash
# Using Chocolatey
choco install ngrok

# Or download from https://ngrok.com/download
# Extract and add to PATH
```

### Verify Installation:
```bash
ngrok --version
```

---

## 🔑 Step 2: Authenticate ngrok

1. **Sign up at https://ngrok.com** (free account)
2. **Get your auth token** from https://dashboard.ngrok.com/auth/your-authtoken
3. **Add auth token:**

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

Replace `YOUR_AUTH_TOKEN_HERE` with your actual token from the dashboard.

---

## 🔌 Step 3: Start ngrok Tunnels

You need **two separate ngrok tunnels** - one for backend, one for frontend.

### Terminal 1: Backend Tunnel (Django on port 8000)
```bash
ngrok http 8000
```

**Output will show:**
```
ngrok                                       (Ctrl+C to quit)

Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        us (United States)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040

Forwarding                    https://xxxx-xx-xxx-xxxx-xx.ngrok.io -> http://localhost:8000
```

**Copy the URL:** `https://xxxx-xx-xxx-xxxx-xx.ngrok.io`

### Terminal 2: Frontend Tunnel (React on port 3000)
```bash
ngrok http 3000
```

**Output will show:**
```
Forwarding                    https://yyyy-yy-yyy-yyyy-yy.ngrok.io -> http://localhost:3000
```

**Copy the URL:** `https://yyyy-yy-yyy-yyyy-yy.ngrok.io`

---

## ⚙️ Step 4: Update Django Settings

Update `config/settings.py` to allow ngrok URLs:

```python
ALLOWED_HOSTS = [
    '*',  # Allow all hosts for development
    'localhost',
    '127.0.0.1',
    '192.168.1.162',
    'localhost:8000',
    '127.0.0.1:8000',
    '192.168.1.162:8000',
    'testserver',
    # Add your ngrok backend URL (without https://)
    'xxxx-xx-xxx-xxxx-xx.ngrok.io',
]

# CORS settings - allow ngrok frontend URL
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.162:3000',
    'https://yyyy-yy-yyy-yyyy-yy.ngrok.io',  # Your ngrok frontend URL
]
```

---

## 🔗 Step 5: Update Frontend Config

Update `frontend/src/config.js`:

```javascript
// config.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://xxxx-xx-xxx-xxxx-xx.ngrok.io';

export { API_BASE_URL };
```

Or set environment variable:

```bash
# In frontend directory
export REACT_APP_API_URL=https://xxxx-xx-xxx-xxxx-xx.ngrok.io
npm start
```

---

## 🎯 Step 6: Access from Outside

### From Another Device:
1. **Open browser** on any device (phone, tablet, laptop)
2. **Go to:** `https://yyyy-yy-yyy-yyyy-yy.ngrok.io`
3. **Login** with your credentials
4. **Use the dashboard** normally!

### From Same Network:
- Still works! ngrok tunnels work from anywhere
- No need to be on same WiFi

### From Different Network:
- Works perfectly! That's the whole point of ngrok

---

## 🔒 Security Considerations

### ⚠️ Important:
- ngrok URLs are **public** - anyone with the URL can access
- Use **strong passwords** for your accounts
- Consider using ngrok's **IP restrictions** (paid feature)
- Never share ngrok URLs publicly

### Protect Your URL:
```bash
# Option 1: Use ngrok's basic auth (free)
ngrok http 8000 --basic-auth="username:password"

# Option 2: Use ngrok's OAuth (paid)
ngrok http 8000 --oauth=google

# Option 3: IP restriction (paid)
ngrok http 8000 --allow-user-agent="Mozilla/*"
```

---

## 📱 Mobile Testing

### Test on Phone:
1. **Get ngrok frontend URL:** `https://yyyy-yy-yyy-yyyy-yy.ngrok.io`
2. **On phone browser:** Go to that URL
3. **Login** with your credentials
4. **Test all features:**
   - Add stock
   - Record sales
   - View dashboard
   - Dark/light mode
   - All responsive features

### Troubleshooting:
- If page won't load: Check backend tunnel is running
- If API calls fail: Check CORS settings in Django
- If login fails: Check ALLOWED_HOSTS in Django

---

## 🔄 Automated Setup Script

Create `start_ngrok.sh`:

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting ngrok tunnels...${NC}"

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo -e "${RED}ngrok is not installed. Please install it first.${NC}"
    exit 1
fi

# Start backend tunnel
echo -e "${GREEN}Starting backend tunnel on port 8000...${NC}"
ngrok http 8000 --log=stdout > ngrok_backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for tunnel to start
sleep 3

# Start frontend tunnel
echo -e "${GREEN}Starting frontend tunnel on port 3000...${NC}"
ngrok http 3000 --log=stdout > ngrok_frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for tunnel to start
sleep 3

# Get the URLs
echo -e "${YELLOW}Getting tunnel URLs...${NC}"
BACKEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | head -1 | cut -d'"' -f4)
FRONTEND_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"[^"]*' | tail -1 | cut -d'"' -f4)

echo -e "${GREEN}✅ ngrok tunnels started!${NC}"
echo ""
echo -e "${YELLOW}Backend URL:${NC} $BACKEND_URL"
echo -e "${YELLOW}Frontend URL:${NC} $FRONTEND_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update ALLOWED_HOSTS in config/settings.py with: ${BACKEND_URL#https://}"
echo "2. Update CORS_ALLOWED_ORIGINS in config/settings.py with: $FRONTEND_URL"
echo "3. Update API_BASE_URL in frontend/src/config.js with: $BACKEND_URL"
echo "4. Restart Django and React servers"
echo ""
echo -e "${YELLOW}Access your app at: $FRONTEND_URL${NC}"
echo ""
echo "Press Ctrl+C to stop ngrok tunnels"

# Keep script running
wait
```

Make it executable:
```bash
chmod +x start_ngrok.sh
./start_ngrok.sh
```

---

## 🐍 Python Helper Script

Create `ngrok_helper.py`:

```python
#!/usr/bin/env python3
"""
ngrok Helper - Automatically configure ngrok tunnels
"""

import subprocess
import json
import time
import requests
import sys

def get_ngrok_urls():
    """Get current ngrok tunnel URLs"""
    try:
        response = requests.get('http://localhost:4040/api/tunnels')
        data = response.json()
        
        urls = {}
        for tunnel in data['tunnels']:
            if tunnel['config']['addr'] == 'localhost:8000':
                urls['backend'] = tunnel['public_url']
            elif tunnel['config']['addr'] == 'localhost:3000':
                urls['frontend'] = tunnel['public_url']
        
        return urls
    except Exception as e:
        print(f"Error getting ngrok URLs: {e}")
        return None

def update_django_settings(backend_url):
    """Update Django settings with ngrok URL"""
    settings_file = 'config/settings.py'
    
    try:
        with open(settings_file, 'r') as f:
            content = f.read()
        
        # Extract domain from URL
        domain = backend_url.replace('https://', '').replace('http://', '')
        
        # Add to ALLOWED_HOSTS if not already there
        if domain not in content:
            print(f"✅ Adding {domain} to ALLOWED_HOSTS")
            # This is a simple approach - you might want more sophisticated parsing
            print(f"   Manually add '{domain}' to ALLOWED_HOSTS in config/settings.py")
        
    except Exception as e:
        print(f"Error updating Django settings: {e}")

def main():
    print("🌐 ngrok Helper Script")
    print("=" * 50)
    
    # Check if ngrok is running
    try:
        response = requests.get('http://localhost:4040/api/tunnels')
        print("✅ ngrok is running")
    except:
        print("❌ ngrok is not running")
        print("   Start ngrok with: ngrok http 8000 & ngrok http 3000")
        sys.exit(1)
    
    # Get URLs
    print("\n📡 Fetching tunnel URLs...")
    time.sleep(2)  # Wait for tunnels to fully initialize
    
    urls = get_ngrok_urls()
    
    if urls:
        print("\n✅ Tunnel URLs:")
        print(f"   Backend:  {urls.get('backend', 'Not found')}")
        print(f"   Frontend: {urls.get('frontend', 'Not found')}")
        
        print("\n📝 Configuration needed:")
        if urls.get('backend'):
            backend_domain = urls['backend'].replace('https://', '')
            print(f"   1. Add to ALLOWED_HOSTS: '{backend_domain}'")
            print(f"   2. Add to CORS_ALLOWED_ORIGINS: '{urls['frontend']}'")
        
        if urls.get('frontend'):
            print(f"   3. Set API_BASE_URL to: '{urls['backend']}'")
        
        print("\n🚀 Then restart your servers:")
        print("   Django: python manage.py runserver")
        print("   React:  npm start")
    else:
        print("❌ Could not fetch tunnel URLs")
        print("   Make sure both tunnels are fully initialized")

if __name__ == '__main__':
    main()
```

Run it:
```bash
python3 ngrok_helper.py
```

---

## 🆘 Troubleshooting

### Issue: "Connection refused"
**Solution:** Make sure Django is running on port 8000
```bash
python manage.py runserver
```

### Issue: "CORS error"
**Solution:** Update CORS_ALLOWED_ORIGINS in settings.py with your ngrok frontend URL

### Issue: "Invalid host header"
**Solution:** Add ngrok domain to ALLOWED_HOSTS in settings.py

### Issue: "ngrok command not found"
**Solution:** Install ngrok or add it to PATH
```bash
# Linux/Mac
export PATH=$PATH:/path/to/ngrok

# Windows
# Add ngrok folder to System Environment Variables PATH
```

### Issue: "Tunnel URL keeps changing"
**Solution:** Use ngrok's reserved domains (paid feature) or update settings each time

---

## 💡 Pro Tips

### 1. Keep URLs Consistent
```bash
# Use reserved domains (ngrok paid feature)
ngrok http 8000 --domain=your-reserved-domain.ngrok.io
```

### 2. Monitor Requests
```bash
# View all requests in real-time
# Open: http://localhost:4040
```

### 3. Custom Headers
```bash
# Add custom headers to requests
ngrok http 8000 --add-header="X-Original-Host: localhost"
```

### 4. Rate Limiting
```bash
# Limit requests per second
ngrok http 8000 --rate-limit=10
```

### 5. Logging
```bash
# Log all traffic
ngrok http 8000 --log=stdout
```

---

## 📊 ngrok Dashboard

Access ngrok's web interface:
- **URL:** http://localhost:4040
- **Shows:** All requests, response codes, headers, body
- **Useful for:** Debugging API calls

---

## 🔐 Security Best Practices

1. **Use Strong Passwords** - Your app is now public
2. **Enable 2FA** - Add two-factor authentication
3. **Limit Access** - Use ngrok's IP whitelist (paid)
4. **Monitor Requests** - Check ngrok dashboard regularly
5. **Rotate URLs** - Change ngrok URLs periodically
6. **Use HTTPS** - ngrok provides HTTPS by default
7. **Add Basic Auth** - Use ngrok's basic auth for extra security

---

## 📱 Testing Checklist

- [ ] Backend tunnel running
- [ ] Frontend tunnel running
- [ ] Django settings updated
- [ ] React config updated
- [ ] Can access frontend URL from phone
- [ ] Can login successfully
- [ ] Can add stock
- [ ] Can record sales
- [ ] Can view dashboard
- [ ] Dark/light mode works
- [ ] All API calls work

---

## 🎯 Quick Start Command

```bash
# Terminal 1: Backend
ngrok http 8000

# Terminal 2: Frontend
ngrok http 3000

# Terminal 3: Django
python manage.py runserver

# Terminal 4: React
cd frontend && npm start
```

Then access from any device using the ngrok frontend URL!

---

## 📚 More Resources

- **ngrok Docs:** https://ngrok.com/docs
- **ngrok Dashboard:** https://dashboard.ngrok.com
- **ngrok Pricing:** https://ngrok.com/pricing
- **Django CORS:** https://github.com/adamchainz/django-cors-headers

---

## ✨ Summary

1. ✅ Install ngrok
2. ✅ Authenticate with token
3. ✅ Start two tunnels (8000 and 3000)
4. ✅ Update Django ALLOWED_HOSTS
5. ✅ Update Django CORS_ALLOWED_ORIGINS
6. ✅ Update React API_BASE_URL
7. ✅ Restart servers
8. ✅ Access from anywhere!

Your ProShop dashboard is now accessible from anywhere on the internet! 🚀
