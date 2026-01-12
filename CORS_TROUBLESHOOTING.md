# CORS & Cookie Troubleshooting Guide

## 🚨 Current Issue
Frontend on `https://business-dashboard-1-ijxo.onrender.com` cannot access backend on `https://business-dashboard-1backend.onrender.com` due to cross-domain cookie restrictions.

## ✅ Fixes Applied

### 1. Django Settings Updates
- ✅ Added exact frontend URL to `ALLOWED_HOSTS`
- ✅ Set `SESSION_COOKIE_SAMESITE = 'None'`
- ✅ Set `CSRF_COOKIE_SAMESITE = 'None'`
- ✅ Set `SESSION_COOKIE_SECURE = True`
- ✅ Set `CSRF_COOKIE_SECURE = True`
- ✅ Set `CSRF_COOKIE_DOMAIN = '.onrender.com'`
- ✅ Set `SESSION_COOKIE_DOMAIN = '.onrender.com'`
- ✅ Added `CORS_ALLOW_CREDENTIALS = True`

### 2. Frontend Improvements
- ✅ Created robust CSRF token management
- ✅ Added debugging utilities
- ✅ Updated API configuration

## 🔍 Debug Steps

### In Browser Console
```javascript
// Run full debug suite
runFullDebug()

// Check API configuration
debugApiConfig()

// Check cookies
debugCookies()

// Test connectivity
testApiConnectivity()
```

### Expected Results
1. **API Configuration**: Should show correct backend URL
2. **Cookies**: Should show sessionid and csrftoken
3. **Connectivity**: Should return 200/401 (not CORS errors)
4. **CSRF Endpoint**: Should return token

## 🛠️ Manual Testing

### 1. Test Basic Connectivity
```javascript
fetch('https://business-dashboard-1backend.onrender.com/api/auth/current_user/', {
  credentials: 'include'
})
.then(res => console.log('Status:', res.status))
.catch(err => console.error('Error:', err))
```

### 2. Test CSRF Token
```javascript
fetch('https://business-dashboard-1backend.onrender.com/api/auth/csrf/', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('CSRF:', data))
```

### 3. Check Cookies
```javascript
console.log('All cookies:', document.cookie)
console.log('Session:', document.cookie.includes('sessionid'))
console.log('CSRF:', document.cookie.includes('csrftoken'))
```

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Symptoms**: `Access-Control-Allow-Origin` errors
**Solutions**:
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Verify `CORS_ALLOW_CREDENTIALS = True`
- Ensure preflight requests are handled

### Issue 2: CSRF Token Missing
**Symptoms**: 403 Forbidden on POST requests
**Solutions**:
- Check `CSRF_COOKIE_SECURE = True`
- Verify `CSRF_COOKIE_SAMESITE = 'None'`
- Ensure CSRF endpoint is accessible

### Issue 3: Session Not Persisting
**Symptoms**: Login works but user appears logged out
**Solutions**:
- Check `SESSION_COOKIE_SECURE = True`
- Verify `SESSION_COOKIE_SAMESITE = 'None'`
- Ensure `SESSION_COOKIE_DOMAIN = '.onrender.com'`

### Issue 4: Cookies Not Being Set
**Symptoms**: No cookies in browser
**Solutions**:
- Check frontend URL is in `ALLOWED_HOSTS`
- Verify HTTPS is being used
- Ensure `SECURE_SSL_REDIRECT = True`

## 🔧 Alternative Solutions

### Option 1: Use Proxy (Recommended for Development)
```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://business-dashboard-1backend.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})

// .env.production
VITE_API_URL=/api
```

### Option 2: Subdomain Approach
- Deploy both frontend and backend on same domain
- Use subdomains: `app.yourdomain.com` and `api.yourdomain.com`
- Set cookie domain to `.yourdomain.com`

### Option 3: Token-based Authentication
- Switch from session to JWT tokens
- Store tokens in localStorage/memory
- Include token in Authorization header

## 📋 Verification Checklist

- [ ] Frontend URL in `ALLOWED_HOSTS`
- [ ] Backend URL in `CSRF_TRUSTED_ORIGINS`
- [ ] Frontend URL in `CORS_ALLOWED_ORIGINS`
- [ ] `CORS_ALLOW_CREDENTIALS = True`
- [ ] `SESSION_COOKIE_SAMESITE = 'None'`
- [ ] `CSRF_COOKIE_SAMESITE = 'None'`
- [ ] `SESSION_COOKIE_SECURE = True`
- [ ] `CSRF_COOKIE_SECURE = True`
- [ ] `CSRF_COOKIE_DOMAIN = '.onrender.com'`
- [ ] `SESSION_COOKIE_DOMAIN = '.onrender.com'`
- [ ] HTTPS being used
- [ ] CSRF endpoint accessible
- [ ] Cookies visible in browser

## 🚀 Next Steps

1. **Deploy Changes**: Restart backend with new settings
2. **Clear Browser Data**: Clear cookies and cache
3. **Test Again**: Run `runFullDebug()` in console
4. **Check Network Tab**: Look for CORS headers
5. **Verify Cookies**: Check sessionid and csrftoken exist

## 📞 If Still Issues

1. **Screenshot** browser console errors
2. **Screenshot** network tab failing request
3. **Copy** full console output from `runFullDebug()`
4. **Check** Render dashboard for service status
5. **Verify** environment variables are set correctly

## 🎯 Expected Behavior After Fix

- ✅ No CORS errors in console
- ✅ Session and CSRF cookies visible
- ✅ Login/authentication works
- ✅ POST requests succeed with CSRF
- ✅ User stays logged in across page refreshes
