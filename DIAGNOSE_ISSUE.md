# 🔍 Diagnostic Guide - Network Error Issue

## **Root Cause Analysis**

The error "Network error. Make sure the backend is running" is triggered when the `fetch()` call throws an exception (line 106 in AuthPage.js).

This can happen for these reasons:

1. **Backend not running** ❌
2. **Wrong URL** ❌
3. **CORS blocking** ❌
4. **Network timeout** ❌
5. **DNS resolution failure** ❌

---

## **Step-by-Step Diagnostic**

### **1. Verify Backend is Running**
```bash
# Check if Django is running
ps aux | grep "manage.py runserver"

# Should show:
# python manage.py runserver 0.0.0.0:8000
```

### **2. Test Backend Directly**
```bash
# Try to reach backend
curl -v http://localhost:8000/api/auth/current_user/

# Should respond with 403 (not authenticated) or 200
# NOT connection refused
```

### **3. Check Frontend Config**
```bash
# View the config file
cat /home/dreamer/business-dashboard/frontend/src/config.js

# Should show:
# export const API_BASE_URL = 'http://localhost:8000';
```

### **4. Check Browser Network Tab**
1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Go to **Network** tab
4. Try to login
5. Look for the POST request to `/api/auth/login/`
6. Check:
   - Status code (should be 200, 400, or 403 - NOT connection error)
   - Response headers (should have CORS headers)
   - Response body (should have JSON)

### **5. Check Browser Console**
1. Press F12 (DevTools)
2. Go to **Console** tab
3. Look for error messages
4. Check if there are CORS errors
5. Look for specific error details

---

## **Common Issues & Fixes**

### **Issue: "Connection refused"**
**Cause:** Backend not running
**Fix:**
```bash
cd /home/dreamer/business-dashboard
source venv/bin/activate
python3 manage.py runserver 0.0.0.0:8000
```

### **Issue: "CORS error"**
**Cause:** CORS not configured properly
**Fix:** Check `/home/dreamer/business-dashboard/config/settings.py`
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### **Issue: "404 Not Found"**
**Cause:** Wrong URL or endpoint doesn't exist
**Fix:** Verify endpoint:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### **Issue: "Timeout"**
**Cause:** Backend slow or not responding
**Fix:** 
```bash
# Check if backend is responsive
curl -v http://localhost:8000/

# Should respond quickly
```

---

## **Advanced Debugging**

### **Enable Verbose Logging in Frontend**

Edit `/home/dreamer/business-dashboard/frontend/src/pages/AuthPage.js` line 105-106:

```javascript
} catch (err) {
  console.error('FETCH ERROR DETAILS:', {
    message: err.message,
    stack: err.stack,
    url: `${API_BASE_URL}/api/auth/${endpoint}/`,
    method: 'POST',
  });
  setError('Network error. Make sure the backend is running.');
}
```

Then check browser console for detailed error info.

### **Test Fetch Directly in Browser Console**

1. Open http://localhost:3000
2. Press F12 → Console
3. Paste this:
```javascript
fetch('http://localhost:8000/api/auth/current_user/')
  .then(r => r.json())
  .then(d => console.log('SUCCESS:', d))
  .catch(e => console.error('ERROR:', e))
```

4. Check the output

---

## **Network Connectivity Test**

```bash
# Test if ports are open
netstat -tlnp | grep 8000
netstat -tlnp | grep 3000

# Test DNS resolution
nslookup localhost
ping localhost

# Test connectivity
telnet localhost 8000
```

---

## **Quick Checklist**

- [ ] Backend running on 8000?
- [ ] Frontend running on 3000?
- [ ] Can reach http://localhost:8000 in browser?
- [ ] Can reach http://localhost:3000 in browser?
- [ ] Backend responds to curl?
- [ ] No CORS errors in console?
- [ ] Correct API_BASE_URL in config.js?
- [ ] Browser cache cleared (Ctrl+Shift+R)?

---

## **If Still Not Working**

1. **Kill all processes:**
   ```bash
   pkill -f "manage.py runserver"
   pkill -f "npm start"
   ```

2. **Wait 5 seconds**

3. **Restart backend:**
   ```bash
   cd /home/dreamer/business-dashboard
   source venv/bin/activate
   python3 manage.py runserver 0.0.0.0:8000
   ```

4. **Restart frontend (in new terminal):**
   ```bash
   cd /home/dreamer/business-dashboard/frontend
   npm start
   ```

5. **Hard refresh browser:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

6. **Check console for specific error**

---

**Last Updated:** 2025-11-18 05:35 EAT
