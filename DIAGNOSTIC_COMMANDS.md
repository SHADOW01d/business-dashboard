# Diagnostic Commands for Business Dashboard

## Quick Browser Console Tests

Run these commands in your browser's developer console:

### Test 1: Check if user is authenticated
```javascript
fetch('https://business-dashboard-1backend.onrender.com/api/auth/current_user/', {
  credentials: 'include'
})
.then(r => console.log('Auth check:', r.status, r.ok))
.catch(e => console.error('Auth error:', e));
```

### Test 2: Try to get stock list
```javascript
fetch('https://business-dashboard-1backend.onrender.com/api/stock/', {
  credentials: 'include'
})
.then(r => console.log('Stock GET:', r.status))
.catch(e => console.error('Stock error:', e));
```

### Test 3: Check what cookies are present
```javascript
console.log('All cookies:', document.cookie);
console.log('Session ID present:', document.cookie.includes('sessionid'));
console.log('CSRF present:', document.cookie.includes('csrftoken'));
```

### Test 4: Use the enhanced debugging function
```javascript
// Import and use the debug function (if in frontend dev environment)
import { debugAPIRequest } from './src/utils/apiDebug.js';

// Test stock endpoint
debugAPIRequest('/api/stock/', 'GET');

// Test creating a stock item
debugAPIRequest('/api/stock/', 'POST', {
  name: 'Test Product',
  quantity: 10,
  price: 99.99
});
```

### Test 5: Test the new debug endpoint
```javascript
fetch('https://business-dashboard-1backend.onrender.com/api/test/', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log('Debug endpoint data:', data))
.catch(e => console.error('Debug endpoint error:', e));
```

## What to Check in Render Dashboard

1. **Environment Variables**: Ensure `DATABASE_URL` is set
2. **Database**: Verify PostgreSQL database is attached and healthy
3. **Service Status**: Both frontend and backend should be "Live"
4. **Logs**: Check for any database connection errors

## Frontend Debug Tools

The enhanced debugging function is now available at:
- `frontend/src/utils/apiDebug.js`
- Function: `debugAPIRequest(endpoint, method, data)`

Usage examples:
```javascript
// Debug authentication
debugAPIRequest('/api/auth/current_user/', 'GET');

// Debug stock operations
debugAPIRequest('/api/stock/', 'POST', {name: 'Test', quantity: 10});

// Debug analytics
debugAPIRequest('/api/analytics/report_data/', 'GET');
```

## Backend Test Endpoint

New debug endpoint available at: `/api/test/`

Returns comprehensive authentication and request information including:
- Authentication status
- User information
- Request headers
- Cookies
- Session data

## PostgreSQL Configuration

The Django settings now use:
```python
if 'DATABASE_URL' in os.environ:
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```

This ensures:
- PostgreSQL in production (when DATABASE_URL is present)
- SQLite for local development
- Connection pooling and health checks
- Proper fallback behavior
