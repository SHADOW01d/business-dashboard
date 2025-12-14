# 🌐 Complete ngrok Setup Guide for ProShop Dashboard

## Overview

This guide will help you access your ProShop Dashboard from anywhere on the internet using ngrok.

**What you'll get:**
- ✅ Access your dashboard from any device
- ✅ Test on mobile phones and tablets
- ✅ Share with team members
- ✅ Demo to clients
- ✅ Works from anywhere (different networks, countries, etc.)

---

## 📋 What is ngrok?

ngrok creates a secure tunnel from your local application to the internet. It gives you a public URL that forwards to your local application.

```
Your Computer (localhost:8000)
        ↓
    ngrok tunnel
        ↓
Public Internet (https://xxxx-xxxx.ngrok.io)
        ↓
    Any Device
```

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install ngrok

**Mac:**
```bash
brew install ngrok/ngrok/ngrok
```

**Linux:**
```bash
# Download from https://ngrok.com/download
# Extract and add to PATH
```

**Windows:**
```bash
choco install ngrok
```

### Step 2: Authenticate

1. Sign up at https://ngrok.com (free)
2. Get token from https://dashboard.ngrok.com/auth/your-authtoken
3. Run:
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### Step 3: Start Tunnels

**Terminal 1:**
```bash
ngrok http 8000
```
Copy the URL: `https://xxxx-xxxx-xxxx.ngrok.io`

**Terminal 2:**
```bash
ngrok http 3000
```
Copy the URL: `https://yyyy-yyyy-yyyy.ngrok.io`

### Step 4: Update Settings

**Edit `config/settings.py`:**
```python
ALLOWED_HOSTS = [
    '*',
    'localhost',
    '127.0.0.1',
    '192.168.1.162',
    'xxxx-xxxx-xxxx.ngrok.io',  # Add backend URL
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://yyyy-yyyy-yyyy.ngrok.io',  # Add frontend URL
]
```

**Edit `frontend/src/config.js`:**
```javascript
const API_BASE_URL = 'https://xxxx-xxxx-xxxx.ngrok.io';
export { API_BASE_URL };
```

### Step 5: Restart Servers

```bash
# Terminal 3: Django
python manage.py runserver

# Terminal 4: React
cd frontend && npm start
```

### Step 6: Access

Open on any device:
```
https://yyyy-yyyy-yyyy.ngrok.io
```

**Done! 🎉**

---

## 🛠️ Automated Setup

### Using Shell Script (Linux/Mac)

```bash
chmod +x start_ngrok.sh
./start_ngrok.sh
```

This will:
- Check if ngrok is installed
- Start both tunnels
- Display URLs
- Show configuration instructions

### Using Python Helper

```bash
python3 ngrok_helper.py
```

This will:
- Check services
- Fetch tunnel URLs
- Display configuration
- Show next steps

### Using Batch Script (Windows)

```bash
start_ngrok.bat
```

---

## 📱 Testing on Mobile

### From Same Network:
1. Get your computer's IP: `192.168.1.162`
2. On phone: `http://192.168.1.162:3000`
3. Test all features

### From Different Network (Using ngrok):
1. Get ngrok frontend URL: `https://yyyy-yyyy-yyyy.ngrok.io`
2. On phone: Open that URL
3. Login and test
4. Works from anywhere!

### Testing Checklist:
- [ ] Can access frontend URL
- [ ] Can login
- [ ] Can add stock
- [ ] Can record sales
- [ ] Can view dashboard
- [ ] Dark/light mode works
- [ ] All buttons work
- [ ] Forms submit correctly
- [ ] Charts display
- [ ] Responsive on mobile

---

## 🔒 Security

### ⚠️ Important

Your ngrok URL is **PUBLIC**. Anyone with the URL can access your app.

### Best Practices:

1. **Use Strong Passwords**
   - Min 12 characters
   - Mix of uppercase, lowercase, numbers, symbols

2. **Enable 2FA**
   - Two-factor authentication
   - SMS or authenticator app

3. **Don't Share URLs**
   - Keep ngrok URLs private
   - Change them periodically

4. **Monitor Access**
   - Check ngrok dashboard
   - Look for suspicious activity

5. **Add Basic Auth** (ngrok paid feature)
```bash
ngrok http 8000 --basic-auth="username:password"
```

6. **IP Whitelist** (ngrok paid feature)
```bash
ngrok http 8000 --allow-user-agent="Mozilla/*"
```

---

## 🔄 URL Management

### URLs Change Every Time

By default, ngrok generates new URLs each time you start it.

**Solution 1: Use Reserved Domains** (paid)
```bash
ngrok http 8000 --domain=your-reserved-domain.ngrok.io
```

**Solution 2: Update Settings Each Time**
- Run `python3 ngrok_helper.py`
- Update config files
- Restart servers

**Solution 3: Use ngrok's Reserved Domains**
- Upgrade to ngrok Pro
- Reserve a domain
- Use same URL every time

---

## 📊 Monitoring

### ngrok Dashboard

Open: http://localhost:4040

**See:**
- All requests and responses
- Headers and body data
- Response codes
- Request/response times
- Real-time traffic

### Useful for:
- Debugging API calls
- Checking request format
- Monitoring traffic
- Testing webhooks

---

## 🆘 Troubleshooting

### Issue: "Connection refused"
**Cause:** Django not running on port 8000
**Fix:**
```bash
python manage.py runserver
```

### Issue: "CORS error"
**Cause:** Frontend URL not in CORS_ALLOWED_ORIGINS
**Fix:** Update `config/settings.py`
```python
CORS_ALLOWED_ORIGINS = [
    'https://yyyy-yyyy-yyyy.ngrok.io',
]
```

### Issue: "Invalid host header"
**Cause:** Backend domain not in ALLOWED_HOSTS
**Fix:** Update `config/settings.py`
```python
ALLOWED_HOSTS = [
    'xxxx-xxxx-xxxx.ngrok.io',
]
```

### Issue: "ngrok command not found"
**Cause:** ngrok not installed or not in PATH
**Fix:**
```bash
# Check installation
ngrok --version

# If not found, install it
brew install ngrok/ngrok/ngrok  # Mac
# or download from https://ngrok.com/download
```

### Issue: "Tunnel URL keeps changing"
**Cause:** Using free ngrok (URLs change each time)
**Fix:**
- Option 1: Update settings each time
- Option 2: Upgrade to ngrok Pro for reserved domains
- Option 3: Use `python3 ngrok_helper.py` to automate

### Issue: "Can't access from phone"
**Cause:** Phone not connected to internet or firewall blocking
**Fix:**
- Check phone has internet
- Try from different network
- Check ngrok dashboard shows tunnel is active
- Try accessing from computer first

### Issue: "API calls failing on phone"
**Cause:** API_BASE_URL not set correctly
**Fix:** Check `frontend/src/config.js`
```javascript
// Should be ngrok backend URL
const API_BASE_URL = 'https://xxxx-xxxx-xxxx.ngrok.io';
```

---

## 💡 Pro Tips

### 1. Keep URLs in Notes
```
Backend:  https://xxxx-xxxx-xxxx.ngrok.io
Frontend: https://yyyy-yyyy-yyyy.ngrok.io
```

### 2. Use Environment Variables
```bash
export NGROK_BACKEND_URL=https://xxxx-xxxx-xxxx.ngrok.io
export NGROK_FRONTEND_URL=https://yyyy-yyyy-yyyy.ngrok.io
```

### 3. Create Config Template
```bash
# ngrok_config.txt
BACKEND_URL=https://xxxx-xxxx-xxxx.ngrok.io
FRONTEND_URL=https://yyyy-yyyy-yyyy.ngrok.io
```

### 4. Automate Updates
```bash
#!/bin/bash
# update_config.sh
BACKEND_URL=$1
FRONTEND_URL=$2

# Update Django settings
sed -i "s|'.*\.ngrok\.io'|'$BACKEND_URL'|g" config/settings.py

# Update React config
sed -i "s|https://.*\.ngrok\.io|$BACKEND_URL|g" frontend/src/config.js
```

### 5. Monitor in Real-time
```bash
# Watch ngrok dashboard
watch -n 1 'curl -s http://localhost:4040/api/tunnels | jq'
```

---

## 📈 Performance

### Typical Latency:
- Local network: < 10ms
- Same region: 20-50ms
- Different region: 50-100ms
- Different continent: 100-200ms

### Bandwidth:
- Free plan: Unlimited
- Paid plans: Higher priority

### Reliability:
- 99.9% uptime SLA (paid)
- Free plan: Best effort

---

## 🎯 Common Workflows

### Workflow 1: Local Testing
```bash
# Terminal 1
python manage.py runserver

# Terminal 2
cd frontend && npm start

# Access at: http://localhost:3000
```

### Workflow 2: Mobile Testing (Same Network)
```bash
# Get your IP
ifconfig | grep inet

# On phone: http://192.168.1.162:3000
```

### Workflow 3: Remote Testing (ngrok)
```bash
# Terminal 1
python manage.py runserver

# Terminal 2
cd frontend && npm start

# Terminal 3
ngrok http 8000

# Terminal 4
ngrok http 3000

# Update config files with ngrok URLs
# On any device: https://yyyy-yyyy-yyyy.ngrok.io
```

### Workflow 4: Demo to Client
```bash
# Start everything with ngrok
./start_ngrok.sh

# Share frontend URL with client
# They can access and test
# You can monitor in ngrok dashboard
```

---

## 🚀 Advanced Features

### Custom Domains (Paid)
```bash
ngrok http 8000 --domain=myapp.ngrok.io
```

### OAuth Authentication (Paid)
```bash
ngrok http 8000 --oauth=google
```

### IP Restrictions (Paid)
```bash
ngrok http 8000 --allow-user-agent="Mozilla/*"
```

### Rate Limiting
```bash
ngrok http 8000 --rate-limit=10
```

### Custom Headers
```bash
ngrok http 8000 --add-header="X-Original-Host: localhost"
```

---

## 📚 Resources

- **ngrok Docs:** https://ngrok.com/docs
- **ngrok Dashboard:** https://dashboard.ngrok.com
- **ngrok Pricing:** https://ngrok.com/pricing
- **ngrok Status:** https://status.ngrok.com

---

## ✅ Checklist

### Before Starting:
- [ ] ngrok installed
- [ ] ngrok authenticated
- [ ] Django running
- [ ] React running

### During Setup:
- [ ] Backend tunnel started
- [ ] Frontend tunnel started
- [ ] URLs copied
- [ ] Django settings updated
- [ ] React config updated
- [ ] Servers restarted

### After Setup:
- [ ] Can access frontend URL
- [ ] Can login
- [ ] Can add stock
- [ ] Can record sales
- [ ] Can view dashboard
- [ ] Mobile testing done
- [ ] Security measures in place

---

## 🎓 Learning Resources

### ngrok Concepts:
- **Tunneling:** Creating secure connection to local app
- **Public URL:** Internet-accessible address
- **Forwarding:** Routing requests to local port
- **Authentication:** Securing your tunnel
- **Monitoring:** Viewing requests and responses

### Best Practices:
- Use strong passwords
- Enable 2FA
- Monitor access
- Change URLs periodically
- Keep ngrok updated
- Use HTTPS (ngrok provides this)

---

## 🆘 Getting Help

### If Something Goes Wrong:

1. **Check ngrok Status:**
   ```bash
   curl http://localhost:4040/api/tunnels
   ```

2. **View Logs:**
   ```bash
   # Check ngrok logs
   tail -f logs/ngrok_backend.log
   tail -f logs/ngrok_frontend.log
   ```

3. **Test Connectivity:**
   ```bash
   # Test backend
   curl https://xxxx-xxxx-xxxx.ngrok.io/api/

   # Test frontend
   curl https://yyyy-yyyy-yyyy.ngrok.io
   ```

4. **Check Django:**
   ```bash
   # Test Django directly
   curl http://localhost:8000/api/
   ```

5. **Check React:**
   ```bash
   # Test React directly
   curl http://localhost:3000
   ```

---

## 📞 Support

- **ngrok Support:** https://ngrok.com/support
- **ngrok Community:** https://ngrok.com/community
- **Django Docs:** https://docs.djangoproject.com
- **React Docs:** https://react.dev

---

## 🎉 Summary

You now have:
- ✅ ngrok installed and authenticated
- ✅ Tunnels configured for backend and frontend
- ✅ Django and React settings updated
- ✅ Ability to access from anywhere
- ✅ Mobile testing capability
- ✅ Security best practices in place

**Your ProShop Dashboard is now accessible from anywhere on the internet!** 🌍

---

## 🔄 Next Steps

1. **Test locally first** - Make sure everything works
2. **Test on mobile** - Try from phone/tablet
3. **Share with team** - Give them the frontend URL
4. **Monitor access** - Check ngrok dashboard
5. **Keep it secure** - Use strong passwords and 2FA
6. **Plan for production** - Consider upgrading to ngrok Pro

---

**Happy testing! 🚀**
