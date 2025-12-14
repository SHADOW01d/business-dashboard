# Testing Runbook - ProShop Dashboard Bug Fixes

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Superuser created: `username: dreamer`

### Start Servers
```bash
# Terminal 1: Backend
cd /home/dreamer/business-dashboard
source venv/bin/activate
python manage.py runserver

# Terminal 2: Frontend
cd /home/dreamer/business-dashboard/frontend
npm start
```

---

## 🧪 Test Cases

### 1. **Auth/Routing Bug Fix** ✅

#### Test 1.1: Dashboard Should NOT Load Without Login
**Steps:**
1. Open browser DevTools (F12)
2. Clear all cookies for localhost
3. Refresh page
4. **Expected:** Login page appears (NOT dashboard)
5. **Check:** Console should show "Not authenticated"

**Verification:**
```javascript
// In browser console
document.cookie  // Should be empty
```

#### Test 1.2: Login with Valid Credentials
**Steps:**
1. Enter username: `dreamer`
2. Enter password: (your password)
3. Click "Sign In"
4. **Expected:** Dashboard loads successfully
5. **Check:** No CSRF errors in console

**Verification:**
```javascript
// In browser console
localStorage.getItem('user')  // Should show user data
```

#### Test 1.3: Logout Then Login Again
**Steps:**
1. Click "Logout" button in navbar
2. **Expected:** Redirected to login page
3. Enter credentials again
4. Click "Sign In"
5. **Expected:** Dashboard loads (no "wrong credentials" error)

**Verification:**
```javascript
// After logout, cookies should be cleared
document.cookie  // Should be empty or minimal
```

#### Test 1.4: Page Reload Should Validate Auth
**Steps:**
1. Login successfully
2. Go to dashboard
3. Press F5 to reload page
4. **Expected:** Dashboard still shows (session validated)
5. **Check:** No login page flash

**Verification:**
```bash
# In backend console, should see:
# GET /api/auth/current_user/ 200
```

---

### 2. **Navbar Buttons Visibility Fix** ✅

#### Test 2.1: Dark/Light Mode Button Visible
**Steps:**
1. Login to dashboard
2. Look at top-right navbar
3. **Expected:** Sun/Moon icon button is visible
4. **Expected:** Button is clickable
5. Click button
6. **Expected:** Theme changes (background color changes)

**Verification:**
```javascript
// In browser console
document.querySelector('[aria-label="Light"]')  // Should exist
// Or find the button with Moon/Sun icon
```

#### Test 2.2: Logout Button Visible and Clickable
**Steps:**
1. Login to dashboard
2. Look at top-right navbar
3. **Expected:** "Logout" button is visible
4. **Expected:** Button has red background
5. Click "Logout"
6. **Expected:** Redirected to login page

**Verification:**
```javascript
// In browser console
document.querySelector('button:contains("Logout")')  // Should exist
```

#### Test 2.3: Theme Toggle Works
**Steps:**
1. Click dark/light mode button
2. **Expected:** Background changes from dark to light
3. Click again
4. **Expected:** Background changes back to dark
5. Reload page
6. **Expected:** Theme persists

---

### 3. **Stock Alert Search Fix** ✅

#### Test 3.1: Low Stock Alerts Endpoint Works
**Steps:**
1. Login to dashboard
2. Go to "Stock Alerts" section
3. **Expected:** No "Failed to search stock alert" error
4. **Expected:** Shows alert summary (Critical, Warning, Total)
5. **Expected:** Shows list of low stock items

**Verification:**
```bash
# In browser DevTools Network tab
# GET /api/sales/low_stock_alerts/
# Status: 200
# Response shows: critical_alerts, warning_alerts, total_alerts, items
```

#### Test 3.2: Create Low Stock Situation
**Steps:**
1. Go to "My Stocks" tab
2. Add a stock: "Test Product", min level: 10
3. Record a sale to reduce stock below 10
4. Go back to "Stock Alerts"
5. **Expected:** Product appears in alerts
6. **Expected:** Shows as "Warning" alert

**Verification:**
```bash
# In browser DevTools Network tab
# GET /api/sales/low_stock_alerts/
# Response should include the new product
```

#### Test 3.3: Critical Alert (Zero Stock)
**Steps:**
1. Add a stock with min level: 5
2. Record sales until stock = 0
3. Go to "Stock Alerts"
4. **Expected:** Product shows as "Critical" alert
5. **Expected:** Red color indicator

---

### 4. **Settings Load Fix** ✅

#### Test 4.1: Settings Page Loads
**Steps:**
1. Login to dashboard
2. Click "Settings" in sidebar
3. **Expected:** Settings page loads
4. **Expected:** No "Failed to load setting" error
5. **Expected:** Can see theme, language, notification options

**Verification:**
```bash
# In browser DevTools Network tab
# GET /api/auth/settings/my_settings/
# Status: 200 or 404 (404 is OK, means no custom settings yet)
```

#### Test 4.2: Change Language Setting
**Steps:**
1. Go to Settings
2. Find "Language" dropdown
3. Select "Swahili" (or another language)
4. Click "Save Settings"
5. **Expected:** Settings saved message
6. Reload page
7. **Expected:** Language persists

---

### 5. **Navbar Styling** ✅

#### Test 5.1: Buttons Have Proper Styling
**Steps:**
1. Login to dashboard
2. Inspect navbar buttons with DevTools (F12)
3. **Expected:** Buttons have:
   - `cursor: pointer`
   - `z-index: 1000`
   - Visible background color
   - Proper padding
4. Hover over buttons
5. **Expected:** Hover effect visible

**Verification:**
```javascript
// In browser console
const btn = document.querySelector('button');
const styles = window.getComputedStyle(btn);
console.log(styles.cursor);      // Should be 'pointer'
console.log(styles.zIndex);      // Should be '1000'
console.log(styles.backgroundColor);  // Should not be transparent
```

---

### 6. **Complete Workflow Test** ✅

#### Test 6.1: Full User Journey
**Steps:**
1. **Clear cookies** - Open DevTools, clear all cookies
2. **Refresh** - Page should show login
3. **Login** - Enter credentials, click Sign In
4. **Dashboard** - Should load without errors
5. **Add Stock** - Click "Add Stock", fill form, save
6. **Record Sale** - Click "Record Sale", select stock, enter quantity
7. **Check Alerts** - Go to "Stock Alerts", should see data
8. **Settings** - Go to "Settings", verify it loads
9. **Toggle Theme** - Click dark/light button, theme changes
10. **Logout** - Click "Logout", redirected to login
11. **Login Again** - Enter credentials, should work (no "wrong credentials")

**Expected Result:** All steps complete without errors ✅

---

## 🧬 Backend Tests

### Run Unit Tests
```bash
cd /home/dreamer/business-dashboard

# Run all tests
python manage.py test tests/

# Run specific test file
python manage.py test tests.test_auth
python manage.py test tests.test_sales

# Run specific test
python manage.py test tests.test_auth.AuthenticationTests.test_login_success

# Run with verbose output
python manage.py test tests/ -v 2
```

### Test Coverage
```bash
# Install coverage
pip install coverage

# Run tests with coverage
coverage run --source='.' manage.py test tests/
coverage report
coverage html  # Creates htmlcov/index.html
```

---

## 🔍 Manual API Testing

### Using cURL

#### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"dreamer","password":"your_password"}' \
  -c cookies.txt
```

#### Test Current User
```bash
curl -X GET http://localhost:8000/api/auth/current_user/ \
  -b cookies.txt
```

#### Test Low Stock Alerts
```bash
curl -X GET http://localhost:8000/api/sales/low_stock_alerts/ \
  -b cookies.txt
```

#### Test Logout
```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -b cookies.txt
```

### Using Postman

1. **Create Collection:** "ProShop Tests"
2. **Add Requests:**
   - `POST /api/auth/login/`
   - `GET /api/auth/current_user/`
   - `GET /api/sales/low_stock_alerts/`
   - `POST /api/auth/logout/`
3. **Set Environment Variables:**
   - `base_url`: `http://localhost:8000`
   - `username`: `dreamer`
   - `password`: `your_password`
4. **Run Collection** - All should pass ✅

---

## 📊 Browser Console Checks

### Check CSRF Token
```javascript
// Should see csrftoken in cookies
document.cookie.split(';').find(c => c.includes('csrftoken'))
```

### Check Session
```javascript
// Should see sessionid in cookies
document.cookie.split(';').find(c => c.includes('sessionid'))
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions (login, add stock, etc.)
4. Check requests:
   - Status codes should be 200, 201, etc. (not 401, 403, 404)
   - Headers should include `X-CSRFToken`
   - Responses should have data

---

## ✅ Checklist

- [ ] Dashboard doesn't load without login
- [ ] Login works with valid credentials
- [ ] Logout clears session
- [ ] Can login again after logout
- [ ] Page reload validates auth
- [ ] Dark/Light mode button visible
- [ ] Dark/Light mode button clickable
- [ ] Logout button visible
- [ ] Logout button clickable
- [ ] Theme toggle works
- [ ] Stock alerts load without error
- [ ] Low stock alerts show correct data
- [ ] Settings page loads
- [ ] Language setting works
- [ ] Navbar buttons have proper styling
- [ ] Complete workflow works end-to-end
- [ ] All unit tests pass
- [ ] No console errors
- [ ] No network errors (401, 403, 404)

---

## 🐛 Troubleshooting

### Issue: "Dashboard loads without login"
**Solution:**
1. Clear browser cookies (DevTools → Application → Cookies)
2. Refresh page
3. Should show login page

### Issue: "CSRF token error"
**Solution:**
1. Restart Django server
2. Clear browser cookies
3. Refresh page

### Issue: "Settings load failure"
**Solution:**
1. Check network tab - should see 200 or 404 (both OK)
2. If 500 error, check Django console for traceback
3. Restart Django server

### Issue: "Navbar buttons not visible"
**Solution:**
1. Open DevTools (F12)
2. Inspect button element
3. Check computed styles
4. Look for `display: none` or `visibility: hidden`
5. Check z-index is not too low

### Issue: "Stock alerts not loading"
**Solution:**
1. Check network tab - GET /api/sales/low_stock_alerts/
2. Should return 200 with data
3. If 401, login first
4. If 404, endpoint not registered in urls.py

---

## 📝 Test Report Template

```
Test Date: [DATE]
Tester: [NAME]
Environment: [DEV/STAGING/PROD]

Results:
- Auth/Routing: ✅ PASS / ❌ FAIL
- Navbar Buttons: ✅ PASS / ❌ FAIL
- Stock Alerts: ✅ PASS / ❌ FAIL
- Settings: ✅ PASS / ❌ FAIL
- Theme Toggle: ✅ PASS / ❌ FAIL
- Complete Workflow: ✅ PASS / ❌ FAIL

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]
```

---

## 🎯 Success Criteria

All tests should pass:
- ✅ No 401/403/404 errors
- ✅ No CSRF errors
- ✅ No console errors
- ✅ All buttons visible and clickable
- ✅ Auth flow works correctly
- ✅ Settings load successfully
- ✅ Stock alerts display data
- ✅ Theme toggle works
- ✅ Complete workflow succeeds

