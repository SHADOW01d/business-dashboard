# 🚀 ProShop Dashboard - Complete Startup Guide

## ⚡ Quick Start (Recommended)

### Linux/Mac
```bash
cd /home/dreamer/business-dashboard
chmod +x START_ALL.sh
./START_ALL.sh
```

### Windows
```bash
cd /home/dreamer/business-dashboard
START_ALL.bat
```

This will automatically:
- ✅ Kill any old processes on ports 8000 and 3000
- ✅ Start Django backend on http://localhost:8000
- ✅ Start React frontend on http://localhost:3000
- ✅ Open both in your browser

---

## 🔧 Manual Startup (If Needed)

### Terminal 1: Start Backend

```bash
cd /home/dreamer/business-dashboard
source venv/bin/activate
python3 manage.py runserver 0.0.0.0:8000
```

**Expected Output:**
```
Watching for file changes with StatReloader
Performing system checks...
System check identified no issues (0 silenced).
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

### Terminal 2: Start Frontend

```bash
cd /home/dreamer/business-dashboard/frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

---

## 🌐 Access the Application

### After Both Are Running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | ProShop Dashboard UI |
| **Backend** | http://localhost:8000 | Django API & Admin |
| **Admin** | http://localhost:8000/admin | Django Admin Panel |

---

## 🧹 Troubleshooting

### Port Already in Use

**Error:**
```
Error: That port is already in use.
```

**Solution:**

**Linux/Mac:**
```bash
# Kill process on port 8000
lsof -i :8000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9

# Kill process on port 3000
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

**Windows:**
```bash
# Kill process on port 8000
netstat -aon | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -aon | findstr :3000
taskkill /PID <PID> /F
```

### Network Error in Frontend

**Error:**
```
Network error: Failed to fetch from http://localhost:8000
```

**Solution:**
1. Make sure backend is running on Terminal 1
2. Check backend URL is http://localhost:8000
3. Check frontend config.js has correct API_BASE_URL
4. Refresh browser (Ctrl+R or Cmd+R)

### npm start Not Working

**Error:**
```
npm: command not found
```

**Solution:**
```bash
# Install Node.js from https://nodejs.org/
# Then reinstall dependencies
cd /home/dreamer/business-dashboard/frontend
npm install
npm start
```

### Django Migrations Error

**Error:**
```
django.db.utils.OperationalError: no such table
```

**Solution:**
```bash
cd /home/dreamer/business-dashboard
source venv/bin/activate
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
```

---

## 📊 Testing the Connection

### Test Backend API

```bash
# In a new terminal, test the API
curl http://localhost:8000/api/auth/current_user/
```

**Expected Response:**
```json
{
  "detail": "Not authenticated"
}
```

Or if logged in:
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com"
}
```

### Test Frontend

1. Open http://localhost:3000 in browser
2. You should see the login page
3. Try logging in with test credentials

---

## 🎯 First Time Setup

### 1. Create Superuser (Admin)
```bash
cd /home/dreamer/business-dashboard
source venv/bin/activate
python3 manage.py createsuperuser
```

Follow prompts to create admin account.

### 2. Access Admin Panel
- Go to http://localhost:8000/admin
- Login with superuser credentials
- Manage users, stocks, sales, etc.

### 3. Test Frontend
- Go to http://localhost:3000
- Register a new account
- Add stocks and record sales
- View dashboard

---

## 🔄 Workflow

### Daily Startup
```bash
# Linux/Mac
./START_ALL.sh

# Windows
START_ALL.bat
```

### Daily Shutdown
- Press Ctrl+C in each terminal
- Or close the terminal windows

### Restart Services
```bash
# Kill all processes
pkill -f "python manage.py"  # Linux/Mac
pkill -f "npm start"         # Linux/Mac

# Then run START_ALL.sh or START_ALL.bat
```

---

## 📱 Access from Mobile Device

### On Same WiFi Network

1. Find your computer's IP:
   ```bash
   # Linux/Mac
   hostname -I
   
   # Windows
   ipconfig
   ```

2. On mobile device, open:
   ```
   http://<YOUR_IP>:3000
   ```

### Example:
If your computer IP is `192.168.1.100`:
- Open `http://192.168.1.100:3000` on phone
- You should see the ProShop login page

---

## 🚀 Production Deployment

### Build for Production

```bash
cd /home/dreamer/business-dashboard/frontend
npm run build
```

This creates an optimized production build in `frontend/build/`

### Deploy Frontend
```bash
# Using Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build

# Or using Vercel
npm install -g vercel
vercel --prod
```

### Deploy Backend
```bash
# Using Heroku
heroku login
heroku create your-app-name
git push heroku main
```

---

## 📋 Checklist Before Going Live

- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] Can login/register
- [ ] Can add stocks
- [ ] Can record sales
- [ ] Can view dashboard
- [ ] Dark/Light mode works
- [ ] Mobile responsive
- [ ] All API endpoints working
- [ ] Admin panel accessible

---

## 🆘 Getting Help

### Check Logs

**Backend Logs:**
- Look at Terminal 1 where Django is running
- Check for error messages
- Look for stack traces

**Frontend Logs:**
- Open DevTools (F12)
- Go to Console tab
- Look for error messages

### Common Issues

1. **Port in use** → Kill old processes
2. **Network error** → Check backend is running
3. **Login fails** → Check database migrations
4. **Blank page** → Check browser console for errors
5. **Slow performance** → Check network tab in DevTools

---

## 🎉 You're Ready!

Your ProShop Dashboard is now ready to use!

```
🚀 Backend:  http://localhost:8000
🌐 Frontend: http://localhost:3000
```

**Happy selling! 📊**
