# 🚀 ngrok Quick Start - 5 Minutes

## 1️⃣ Install ngrok (if not already installed)

```bash
# Mac
brew install ngrok/ngrok/ngrok

# Linux
# Download from https://ngrok.com/download
# Extract and add to PATH

# Windows
choco install ngrok
```

## 2️⃣ Get Auth Token

1. Go to https://ngrok.com/signup (free account)
2. Go to https://dashboard.ngrok.com/auth/your-authtoken
3. Copy your auth token
4. Run:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## 3️⃣ Start Services (4 Terminals)

### Terminal 1: Django Backend
```bash
python manage.py runserver
```

### Terminal 2: React Frontend
```bash
cd frontend
npm start
```

### Terminal 3: Backend Tunnel
```bash
ngrok http 8000
```
**Copy the URL:** `https://xxxx-xxxx-xxxx.ngrok.io`

### Terminal 4: Frontend Tunnel
```bash
ngrok http 3000
```
**Copy the URL:** `https://yyyy-yyyy-yyyy.ngrok.io`

## 4️⃣ Update Configuration

### Edit `config/settings.py`

Find `ALLOWED_HOSTS` and add:
```python
ALLOWED_HOSTS = [
    '*',
    'localhost',
    '127.0.0.1',
    '192.168.1.162',
    'xxxx-xxxx-xxxx.ngrok.io',  # Add this
]
```

Find `CORS_ALLOWED_ORIGINS` and add:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://yyyy-yyyy-yyyy.ngrok.io',  # Add this
]
```

### Edit `frontend/src/config.js`

```javascript
const API_BASE_URL = 'https://xxxx-xxxx-xxxx.ngrok.io';
export { API_BASE_URL };
```

## 5️⃣ Restart Servers

- **Django:** Press Ctrl+C and run `python manage.py runserver` again
- **React:** Press Ctrl+C and run `npm start` again

## 6️⃣ Access Your App

Open on any device:
```
https://yyyy-yyyy-yyyy.ngrok.io
```

Login and test!

---

## 🔧 Automated Setup (Optional)

### Linux/Mac:
```bash
chmod +x start_ngrok.sh
./start_ngrok.sh
```

### Windows:
```bash
start_ngrok.bat
```

### Python Helper:
```bash
python3 ngrok_helper.py
```

---

## 📱 Test on Phone

1. Open browser on phone
2. Go to: `https://yyyy-yyyy-yyyy.ngrok.io`
3. Login with your credentials
4. Test all features!

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Make sure Django is running on port 8000 |
| "CORS error" | Update CORS_ALLOWED_ORIGINS in settings.py |
| "Invalid host header" | Add ngrok domain to ALLOWED_HOSTS |
| "ngrok command not found" | Install ngrok or add to PATH |

---

## 📊 Monitor Requests

Open: http://localhost:4040

See all requests, responses, headers, and body data in real-time!

---

## ⚠️ Security

- Your app is now PUBLIC
- Use STRONG passwords
- Enable 2FA
- Don't share URLs publicly
- Monitor the ngrok dashboard

---

## 🎯 Summary

1. ✅ Install ngrok
2. ✅ Get auth token
3. ✅ Start 4 terminals (Django, React, 2 ngrok)
4. ✅ Update config files
5. ✅ Restart servers
6. ✅ Access from anywhere!

**That's it! Your app is now accessible from anywhere on the internet!** 🌍
