# 📱 Mobile Authentication & Connectivity Checklist

## ✅ Pre-Deployment Verification (Dec 13, 2025)

### 1. Backend Configuration Status

#### CORS Settings ✅
- [x] `CORS_ALLOW_ALL_ORIGINS = True` - Allows all origins
- [x] `CORS_ALLOWED_ORIGINS` includes network IP (192.168.1.162)
- [x] `CORS_ALLOW_CREDENTIALS = True` - Allows cookies
- [x] `CORS_EXPOSE_HEADERS` includes X-CSRFToken

#### CSRF Settings ✅
- [x] `CSRF_COOKIE_SECURE = False` - HTTP allowed (development)
- [x] `CSRF_COOKIE_HTTPONLY = False` - JavaScript can read it
- [x] `CSRF_COOKIE_SAMESITE = 'Lax'` - Cross-site cookies allowed
- [x] `CSRF_COOKIE_DOMAIN = None` - Cross-domain cookies allowed
- [x] `CSRF_TRUSTED_ORIGINS` includes network IP
- [x] `CSRF_USE_SESSIONS = False` - Token-based CSRF

#### Authentication Settings ✅
- [x] `SessionAuthentication` enabled
- [x] `AllowAny` permission for auth endpoints
- [x] `IsAuthenticated` for protected endpoints
- [x] Credentials included in all requests

#### Allowed Hosts ✅
- [x] `'*'` - Allows all hosts
- [x] `'192.168.1.162'` - Network IP
- [x] `'192.168.1.162:8000'` - With port
- [x] `'localhost'`, `'127.0.0.1'` - Local access

---

### 2. Frontend Configuration Status

#### API URL Configuration ✅
- [x] `config.js` uses dynamic hostname detection
- [x] Localhost → `http://localhost:8000`
- [x] Network IP → `http://{hostname}:8000`
- [x] Mobile → Auto-detects correct backend URL
- [x] Console logs backend URL for debugging

#### CSRF Token Handling ✅
- [x] `getCsrfToken()` called on app load
- [x] `getCsrfTokenFromCookie()` utility function
- [x] Token included in all POST/PUT/DELETE requests
- [x] `credentials: 'include'` in all fetch calls

#### Authentication Flow ✅
- [x] `checkAuth()` on app load
- [x] Redirects to AuthPage if not authenticated
- [x] Shows Dashboard if authenticated
- [x] Logout clears session and storage

---

### 3. API Endpoints Status

#### Auth Endpoints ✅
```
POST   /api/auth/register/      - Create new user
POST   /api/auth/login/         - Login user
POST   /api/auth/logout/        - Logout user
GET    /api/auth/current_user/  - Get current user
```

#### Data Endpoints ✅
```
GET    /api/stocks/             - List stocks
POST   /api/stocks/             - Create stock
GET    /api/sales/              - List sales
POST   /api/sales/              - Create sale
GET    /api/expenses/           - List expenses
POST   /api/expenses/           - Create expense
GET    /api/shops/              - List shops
POST   /api/shops/              - Create shop
```

---

### 4. Mobile Device Testing Checklist

#### Network Setup
- [ ] Backend running on `192.168.1.162:8000`
- [ ] Frontend running on `192.168.1.162:3000`
- [ ] Both on same network as client phone
- [ ] Firewall allows ports 3000 and 8000
- [ ] No VPN blocking ports

#### Browser Testing
- [ ] Chrome on Android
- [ ] Safari on iOS
- [ ] Firefox on Android
- [ ] Edge on Android

#### Authentication Tests
- [ ] Register new account on mobile
- [ ] Login with credentials
- [ ] Session persists after refresh
- [ ] Logout clears session
- [ ] Cannot access dashboard without login

#### Connectivity Tests
- [ ] API calls succeed from mobile
- [ ] CORS headers present in responses
- [ ] CSRF token properly set
- [ ] Cookies stored and sent back
- [ ] Network errors handled gracefully

#### Feature Tests
- [ ] Add stock on mobile
- [ ] Record sale on mobile
- [ ] Add expense on mobile
- [ ] View dashboard metrics
- [ ] Dark/Light mode toggle
- [ ] Responsive layout on mobile

---

### 5. Common Mobile Issues & Solutions

#### Issue: "Network error. Make sure the backend is running"
**Causes:**
- Backend not running on correct IP
- Firewall blocking ports
- Frontend using wrong API URL
- CORS not configured

**Solutions:**
- Check backend running: `python manage.py runserver 0.0.0.0:8000`
- Check firewall: `sudo ufw allow 8000/tcp`
- Verify API URL in browser console
- Check CORS headers in Network tab

#### Issue: "CSRF token missing or incorrect"
**Causes:**
- CSRF token not being read from cookie
- Token not included in request headers
- Cookie not being sent with request

**Solutions:**
- Check cookies in DevTools → Application → Cookies
- Verify `credentials: 'include'` in fetch calls
- Check `X-CSRFToken` header in Network tab
- Clear cookies and try again

#### Issue: "Unauthorized" on protected endpoints
**Causes:**
- Session not created after login
- Session cookie not being sent
- User not authenticated

**Solutions:**
- Check `sessionid` cookie exists
- Verify login response returns user data
- Check `credentials: 'include'` in all requests
- Clear cookies and login again

#### Issue: "Stuck on loading screen"
**Causes:**
- Backend not responding
- API URL incorrect
- Network timeout

**Solutions:**
- Check backend is running
- Verify API URL in console
- Check network tab for failed requests
- Increase timeout if network is slow

---

### 6. Pre-Deployment Checklist

#### Backend
- [ ] Database migrations applied
- [ ] No pending migrations
- [ ] Static files collected
- [ ] Admin user created
- [ ] Test user created
- [ ] All apps installed
- [ ] No import errors
- [ ] Server starts without errors

#### Frontend
- [ ] Dependencies installed
- [ ] No build errors
- [ ] API URL correct
- [ ] CSRF token handling works
- [ ] Auth flow tested
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] No console errors

#### Network
- [ ] Backend accessible from phone
- [ ] Frontend accessible from phone
- [ ] Ports 3000 and 8000 open
- [ ] Same network as phone
- [ ] No firewall blocking
- [ ] No VPN interfering

#### Security (Development Only)
- [ ] DEBUG = True (for development)
- [ ] ALLOWED_HOSTS includes network IP
- [ ] CORS allows network IP
- [ ] CSRF allows network IP
- [ ] Session cookies work
- [ ] HTTPS not required (HTTP OK for dev)

---

### 7. Quick Start Commands

#### Start Backend
```bash
cd /home/dreamer/business-dashboard
python manage.py runserver 0.0.0.0:8000
```

#### Start Frontend
```bash
cd /home/dreamer/business-dashboard/frontend
npm start
```

#### Test from Mobile
```
1. Get your computer's IP: ifconfig | grep "inet "
2. On phone browser: http://{IP}:3000
3. Should see login page
4. Register or login
5. Should see dashboard
```

#### Debug Backend
```bash
# Check if running
curl http://192.168.1.162:8000/api/auth/current_user/

# Check CORS headers
curl -i http://192.168.1.162:8000/api/auth/current_user/

# Check logs
python manage.py runserver 0.0.0.0:8000 --verbosity 2
```

#### Debug Frontend
```bash
# Check API URL
Open DevTools → Console
Type: API_BASE_URL

# Check CORS errors
DevTools → Network tab → Look for red requests

# Check CSRF token
DevTools → Application → Cookies → csrftoken
```

---

### 8. Mobile Testing Procedure

#### Step 1: Prepare Backend
```bash
cd /home/dreamer/business-dashboard
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

#### Step 2: Prepare Frontend
```bash
cd /home/dreamer/business-dashboard/frontend
npm install
npm start
```

#### Step 3: Get Your IP
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.162
```

#### Step 4: Test on Phone
- Open phone browser
- Go to: `http://192.168.1.162:3000`
- Should see login page
- Try registering new account
- Try logging in
- Try adding stock
- Try recording sale
- Try adding expense

#### Step 5: Check DevTools
- Open DevTools on desktop (F12)
- Go to Network tab
- Perform action on phone
- Check requests are successful (200, 201)
- Check CORS headers present
- Check CSRF token in cookies

---

### 9. Troubleshooting Guide

#### Backend Not Responding
```bash
# Check if running
ps aux | grep "python manage.py runserver"

# Check port 8000 is open
netstat -an | grep 8000

# Restart backend
python manage.py runserver 0.0.0.0:8000
```

#### Frontend Not Loading
```bash
# Check if running
ps aux | grep "npm start"

# Check port 3000 is open
netstat -an | grep 3000

# Restart frontend
npm start
```

#### CORS Errors
```
Error: "Access to XMLHttpRequest at 'http://...' from origin 'http://...' 
has been blocked by CORS policy"

Solution:
1. Check CORS_ALLOWED_ORIGINS in settings.py
2. Add your IP to CORS_ALLOWED_ORIGINS
3. Restart backend
4. Clear browser cache
5. Try again
```

#### CSRF Errors
```
Error: "CSRF token missing or incorrect"

Solution:
1. Check csrftoken cookie exists
2. Check X-CSRFToken header in request
3. Verify credentials: 'include' in fetch
4. Clear cookies and try again
5. Check CSRF_TRUSTED_ORIGINS in settings.py
```

#### Session Errors
```
Error: "Unauthorized" after login

Solution:
1. Check sessionid cookie exists
2. Verify login response
3. Check credentials: 'include' in all requests
4. Verify SESSION_COOKIE_SECURE = False
5. Clear cookies and login again
```

---

### 10. Success Criteria

✅ **Backend**
- Server starts without errors
- All endpoints respond with 200/201
- CORS headers present
- CSRF token generated
- Session created after login

✅ **Frontend**
- App loads without errors
- API URL correct in console
- Auth flow works
- Can register and login
- Can access dashboard

✅ **Mobile**
- Can access from phone browser
- Can register and login
- Can add stocks
- Can record sales
- Can add expenses
- Responsive layout works
- Dark mode works

✅ **Network**
- Backend accessible from phone
- Frontend accessible from phone
- Cookies sent and stored
- CSRF token working
- Sessions persisting

---

### 11. Final Verification

Run this checklist before giving access to client:

- [ ] Backend running on 0.0.0.0:8000
- [ ] Frontend running on 0.0.0.0:3000
- [ ] Can access from phone browser
- [ ] Can register new account
- [ ] Can login with account
- [ ] Can add stock
- [ ] Can record sale
- [ ] Can add expense
- [ ] Dashboard shows data
- [ ] Dark mode works
- [ ] Logout works
- [ ] No console errors
- [ ] No network errors
- [ ] Responsive on mobile
- [ ] All features working

---

## 🚀 Status: READY FOR MOBILE TESTING

All authentication and connectivity configurations are in place.
Ready to test on client phone.

**Next Steps:**
1. Run backend on 0.0.0.0:8000
2. Run frontend on 0.0.0.0:3000
3. Test from phone browser
4. Verify all features work
5. Check for any errors
6. Fix issues if found
7. Deploy when ready
