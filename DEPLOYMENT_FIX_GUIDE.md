# DEPLOYMENT FIX GUIDE - Database & Authentication Issues

## 🚨 Problem Identified

1. **Database Issue**: Your data disappears because Render is using SQLite instead of PostgreSQL
2. **Authentication Issue**: Stock/Analytics endpoints fail due to CORS/CSRF misconfiguration

## 🔧 Immediate Fixes Required

### Step 1: Fix Render Environment Variables

Go to your Render Dashboard → Backend Service → Environment Variables and set:

```
DEBUG=False
SECRET_KEY=generate-a-new-secure-key
DATABASE_URL=postgresql://postgres:iamchosen1@db.lpajeltvykjjfnhljocj.supabase.co:5432/postgres
ALLOWED_HOSTS=.onrender.com,business-dashboard-1backend.onrender.com
CORS_ALLOWED_ORIGINS=https://business-dashboard-frontend.onrender.com,https://business-dashboard-1backend.onrender.com,https://business-dashboard-1-ijxo.onrender.com
CSRF_TRUSTED_ORIGINS=https://business-dashboard-frontend.onrender.com,https://business-dashboard-1backend.onrender.com,https://business-dashboard-1-ijxo.onrender.com
```

### Step 2: Update Frontend Environment

In Render Dashboard → Frontend Service → Environment Variables:

```
VITE_API_URL=https://business-dashboard-1backend.onrender.com
```

### Step 3: Redeploy Services

1. Go to your backend service on Render
2. Click "Manual Deploy" → "Deploy Latest Commit"
3. Wait for deployment to complete
4. Do the same for frontend service

### Step 4: Test Database Connection

After redeployment, test the database:

```javascript
// In browser console on your deployed site
fetch('https://business-dashboard-1backend.onrender.com/api/test/', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('Database Test:', data))
```

### Step 5: Test Authentication

```javascript
// Test authentication
fetch('https://business-dashboard-1backend.onrender.com/api/auth/current_user/', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('Auth Test:', data))
```

## 🔍 Debugging Steps

### If Stock Still Fails:

```javascript
// Use the enhanced debug function
import { debugAPIRequest } from './src/utils/apiDebug.js';

// Test stock endpoint
debugAPIRequest('/api/stock/', 'GET');
```

### If Analytics Still Fails:

```javascript
// Test analytics endpoint
debugAPIRequest('/api/analytics/report_data/', 'GET');
```

## 🚨 Critical Issues Found

1. **render.yaml Conflict**: You were trying to create both Supabase and Render databases
2. **Missing CORS Origins**: Frontend URL wasn't included in CORS settings
3. **Environment Variables**: Not properly set in Render dashboard

## ✅ What I Fixed

1. ✅ Updated `render.yaml` to use Supabase database directly
2. ✅ Added all necessary CORS and CSRF origins
3. ✅ Enhanced database configuration with connection pooling
4. ✅ Added comprehensive debugging tools
5. ✅ Created test endpoint for authentication debugging

## 🎯 Expected Results After Fix

1. ✅ Data will persist after logout/login (PostgreSQL working)
2. ✅ Stock endpoints will work (authentication fixed)
3. ✅ Analytics endpoints will work (CORS fixed)
4. ✅ No more "failed to fetch" errors

## 📋 Verification Checklist

- [ ] Render environment variables set correctly
- [ ] Backend redeployed successfully
- [ ] Frontend redeployed successfully
- [ ] Database connection test passes
- [ ] Authentication test passes
- [ ] Stock data loads without errors
- [ ] Analytics data loads without errors
- [ ] Expenses persist after logout/login

## 🆘 If Still Having Issues

1. Check Render logs for database connection errors
2. Verify Supabase database is accessible
3. Test with the debug endpoint `/api/test/`
4. Check browser console for CORS errors
5. Verify cookies are being set correctly

## 📞 Quick Test Commands

```javascript
// Quick health check
Promise.all([
  fetch('https://business-dashboard-1backend.onrender.com/api/test/', {credentials: 'include'}).then(r => r.json()),
  fetch('https://business-dashboard-1backend.onrender.com/api/auth/current_user/', {credentials: 'include'}).then(r => r.json()),
  fetch('https://business-dashboard-1backend.onrender.com/api/stock/', {credentials: 'include'}).then(r => r.json())
]).then(([test, auth, stock]) => {
  console.log('✅ Database:', test.authenticated ? 'Connected' : 'Not Connected');
  console.log('✅ Auth:', auth.username ? 'Logged in' : 'Not logged in');
  console.log('✅ Stock:', stock.length || stock.error ? 'Working' : 'Failed');
});
```
