# 📱 Mobile Testing Guide - ProShop Dashboard

## ✅ Pre-Testing Verification (Dec 13, 2025)

### Backend Status
```
✓ Django 5.2.7 installed
✓ All migrations applied
✓ Test user created (testuser / testpassword123)
✓ DEBUG = True
✓ ALLOWED_HOSTS: 8 hosts configured
✓ CORS_ALLOW_ALL_ORIGINS: True
✓ CORS_ALLOW_CREDENTIALS: True
✓ CSRF_COOKIE_SECURE: False
✓ CSRF_COOKIE_HTTPONLY: False
✓ CSRF_COOKIE_SAMESITE: Lax
✓ API endpoints responding
```

### Frontend Status
```
✓ Frontend config.js exists
✓ Dynamic backend URL detection configured
✓ package.json exists
✓ Ready for npm start
```

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your Computer's IP Address

**On Linux/Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
# Output example: inet 192.168.1.162
```

**On Windows:**
```cmd
ipconfig
# Look for "IPv4 Address" under your network adapter
```

### Step 2: Start Backend Server

```bash
cd /home/dreamer/business-dashboard
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

**Expected output:**
```
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

### Step 3: Start Frontend Server (New Terminal)

```bash
cd /home/dreamer/business-dashboard/frontend
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

### Step 4: Access from Phone

1. **Get your IP** from Step 1 (e.g., 192.168.1.162)
2. **Open phone browser** (Chrome, Safari, Firefox)
3. **Go to:** `http://192.168.1.162:3000`
4. **Should see:** ProShop Dashboard login page

### Step 5: Test Login

**Credentials:**
- Username: `testuser`
- Password: `testpassword123`

**Expected:**
- Login succeeds
- Redirected to dashboard
- See metrics cards
- See stock/sales tables

---

## 📋 Detailed Testing Checklist

### 1. Network Connectivity

- [ ] Phone and computer on same WiFi network
- [ ] Can ping computer from phone (optional)
- [ ] Backend accessible: `http://{IP}:8000/api/auth/current_user/`
- [ ] Frontend accessible: `http://{IP}:3000`
- [ ] No firewall blocking ports 3000 and 8000

**Test Command (on phone):**
```
Open browser and go to:
http://192.168.1.162:8000/api/auth/current_user/

Should see JSON response (might be empty object or error, that's OK)
```

### 2. Authentication Flow

#### Registration
- [ ] Click "Register" link
- [ ] Enter username (e.g., `mobileuser`)
- [ ] Enter email (e.g., `mobile@example.com`)
- [ ] Enter password (e.g., `MobilePass123!`)
- [ ] Click "Register"
- [ ] Should see success message
- [ ] Should be logged in automatically
- [ ] Should see dashboard

#### Login
- [ ] Click "Login" link
- [ ] Enter username: `testuser`
- [ ] Enter password: `testpassword123`
- [ ] Click "Login"
- [ ] Should see dashboard
- [ ] Should see user name in header

#### Session Persistence
- [ ] Login to dashboard
- [ ] Refresh page (F5 or pull down)
- [ ] Should still be logged in
- [ ] Should NOT see login page

#### Logout
- [ ] Click "Logout" button (top right)
- [ ] Should see login page
- [ ] Should NOT be able to access dashboard
- [ ] Try to go back with browser back button
- [ ] Should still see login page

### 3. Stock Management

#### Add Stock
- [ ] Click "My Stocks" tab
- [ ] Click "Add Stock" button
- [ ] Enter stock details:
  - Name: `Test Product`
  - Category: `Electronics`
  - Price: `5000`
  - Quantity: `10`
- [ ] Click "Add Stock"
- [ ] Should see success message
- [ ] Stock should appear in table
- [ ] Remaining units should show: `10`

#### View Stock Details
- [ ] Click "👁️ Details" button on stock
- [ ] Should see modal with:
  - Product name
  - Category
  - Price
  - Total units
  - Available units
  - Sold units
  - Progress bars
- [ ] Close modal

#### Delete Stock
- [ ] Click "🗑️ Delete" button on stock
- [ ] Should see confirmation
- [ ] Click confirm
- [ ] Stock should disappear from table

### 4. Sales Recording

#### Record Sale
- [ ] Click "My Stocks" tab
- [ ] Click "📤 Sale" button on a stock
- [ ] Enter quantity: `2`
- [ ] Enter price: `5000`
- [ ] Click "Record Sale"
- [ ] Should see success message
- [ ] Stock quantity should decrease
- [ ] Sale should appear in sales table

#### View Sales
- [ ] Click "Sales" tab
- [ ] Should see list of sales
- [ ] Each sale shows:
  - Product name
  - Quantity
  - Price per unit
  - Total amount
  - Date/time

### 5. Expense Tracking

#### Add Expense
- [ ] Click "Expenses" tab
- [ ] Click "Add Expense" button
- [ ] Select category: `Supplies`
- [ ] Enter description: `Test expense`
- [ ] Enter amount: `1000`
- [ ] Click "Add Expense"
- [ ] Should see success message
- [ ] Expense should appear in table

#### View Expenses
- [ ] Click "Expenses" tab
- [ ] Should see list of expenses
- [ ] Each expense shows:
  - Description
  - Category
  - Amount
  - Date/time

### 6. Dashboard Features

#### Metrics Cards
- [ ] Should see 4 metric cards:
  - Total Income
  - Total Expenses
  - Net Profit
  - Total Stocks
- [ ] Numbers should be accurate
- [ ] Should update when adding sales/expenses

#### Charts
- [ ] Income vs Expenses chart visible
- [ ] Stock overview chart visible
- [ ] Charts should be responsive
- [ ] Charts should update with new data

#### Dark/Light Mode
- [ ] Click theme toggle (top right)
- [ ] Should switch to light mode
- [ ] Click again
- [ ] Should switch to dark mode
- [ ] All components should be visible in both modes

#### Search
- [ ] Type in search box
- [ ] Should filter sales/expenses
- [ ] Results should update in real-time

### 7. Responsive Design

#### Portrait Mode
- [ ] All content visible
- [ ] No horizontal scrolling needed
- [ ] Buttons easily clickable
- [ ] Text readable
- [ ] Tables scrollable horizontally if needed

#### Landscape Mode
- [ ] All content visible
- [ ] Layout adjusts properly
- [ ] No overlapping elements
- [ ] Charts visible

#### Different Screen Sizes
- [ ] Test on phone (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on small laptop (1024px width)

### 8. Error Handling

#### Network Error
- [ ] Turn off WiFi
- [ ] Try to load page
- [ ] Should show error message
- [ ] Turn on WiFi
- [ ] Should recover

#### Invalid Login
- [ ] Enter wrong username
- [ ] Click login
- [ ] Should show error message
- [ ] Should NOT be logged in

#### Missing Fields
- [ ] Try to add stock without name
- [ ] Should show error message
- [ ] Form should not submit

### 9. Performance

#### Page Load Time
- [ ] Dashboard should load in < 3 seconds
- [ ] Tables should load in < 2 seconds
- [ ] Forms should respond immediately

#### Scrolling
- [ ] Smooth scrolling
- [ ] No lag or jank
- [ ] Tables scroll smoothly

#### Button Clicks
- [ ] Buttons respond immediately
- [ ] No double-click issues
- [ ] Loading indicators show

### 10. Browser Compatibility

#### Chrome Android
- [ ] [ ] All features work
- [ ] [ ] No console errors
- [ ] [ ] Responsive layout

#### Safari iOS
- [ ] [ ] All features work
- [ ] [ ] No console errors
- [ ] [ ] Responsive layout

#### Firefox Android
- [ ] [ ] All features work
- [ ] [ ] No console errors
- [ ] [ ] Responsive layout

#### Edge Android
- [ ] [ ] All features work
- [ ] [ ] No console errors
- [ ] [ ] Responsive layout

---

## 🔍 Debugging on Mobile

### Open Developer Tools

**Chrome/Firefox Android:**
1. Open browser
2. Go to `chrome://inspect` (Chrome) or `about:debugging` (Firefox)
3. Connect phone via USB
4. Enable USB debugging on phone
5. Click "Inspect" on your app

**Safari iOS:**
1. Connect iPhone to Mac
2. Open Safari on Mac
3. Go to Develop menu
4. Select your iPhone
5. Select your app

### Check Console Logs

Look for:
- ✅ `🔧 Backend URL: http://192.168.1.162:8000`
- ❌ Network errors
- ❌ CORS errors
- ❌ CSRF errors
- ❌ JavaScript errors

### Check Network Requests

Look for:
- ✅ API requests returning 200/201
- ✅ CORS headers present
- ✅ CSRF token in cookies
- ❌ 404 errors
- ❌ 403 errors
- ❌ 500 errors

### Common Issues & Solutions

#### Issue: "Cannot reach server"
**Solution:**
1. Check backend is running: `python manage.py runserver 0.0.0.0:8000`
2. Check IP address is correct
3. Check firewall allows port 8000
4. Check phone is on same network

#### Issue: "CORS error"
**Solution:**
1. Check CORS_ALLOW_ALL_ORIGINS = True in settings.py
2. Check CORS_ALLOWED_ORIGINS includes your IP
3. Restart backend
4. Clear browser cache

#### Issue: "CSRF token missing"
**Solution:**
1. Check csrftoken cookie exists (DevTools → Application → Cookies)
2. Check X-CSRFToken header in requests
3. Clear cookies and try again
4. Check CSRF_COOKIE_HTTPONLY = False

#### Issue: "Unauthorized after login"
**Solution:**
1. Check sessionid cookie exists
2. Check credentials: 'include' in fetch calls
3. Check SESSION_COOKIE_SECURE = False
4. Clear cookies and login again

#### Issue: "Stuck on loading screen"
**Solution:**
1. Check backend is running
2. Check API URL in console
3. Check network tab for failed requests
4. Refresh page
5. Clear cache and cookies

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________
Device: _______________
Browser: _______________
Network: _______________

AUTHENTICATION
- [ ] Register: PASS / FAIL
- [ ] Login: PASS / FAIL
- [ ] Session Persistence: PASS / FAIL
- [ ] Logout: PASS / FAIL

STOCKS
- [ ] Add Stock: PASS / FAIL
- [ ] View Details: PASS / FAIL
- [ ] Delete Stock: PASS / FAIL

SALES
- [ ] Record Sale: PASS / FAIL
- [ ] View Sales: PASS / FAIL

EXPENSES
- [ ] Add Expense: PASS / FAIL
- [ ] View Expenses: PASS / FAIL

DASHBOARD
- [ ] Metrics Cards: PASS / FAIL
- [ ] Charts: PASS / FAIL
- [ ] Dark Mode: PASS / FAIL
- [ ] Light Mode: PASS / FAIL

RESPONSIVE
- [ ] Portrait: PASS / FAIL
- [ ] Landscape: PASS / FAIL

PERFORMANCE
- [ ] Load Time: PASS / FAIL
- [ ] Scrolling: PASS / FAIL
- [ ] Button Clicks: PASS / FAIL

OVERALL: PASS / FAIL

Issues Found:
1. _______________
2. _______________
3. _______________

Notes:
_______________
_______________
```

---

## 🎯 Success Criteria

✅ **All of the following must pass:**

1. Can access frontend from phone browser
2. Can register new account
3. Can login with credentials
4. Session persists after refresh
5. Can add stocks
6. Can record sales
7. Can add expenses
8. Dashboard metrics update correctly
9. Dark/Light mode works
10. Responsive layout on mobile
11. No console errors
12. No network errors
13. All buttons clickable
14. Forms submit successfully
15. Logout works

---

## 🚀 Deployment Checklist

Before giving access to client:

- [ ] Backend running on 0.0.0.0:8000
- [ ] Frontend running on 0.0.0.0:3000
- [ ] Can access from phone
- [ ] All tests passing
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] All features working
- [ ] Documentation provided
- [ ] Support contact provided

---

## 📞 Support

If issues occur:

1. **Check console logs** (DevTools → Console)
2. **Check network requests** (DevTools → Network)
3. **Check backend logs** (Terminal where backend is running)
4. **Try clearing cache** (Ctrl+Shift+Delete in browser)
5. **Try restarting backend** (Ctrl+C then run again)
6. **Try restarting frontend** (Ctrl+C then npm start)

---

## 📝 Notes

- Test user credentials: `testuser` / `testpassword123`
- Backend IP: Get from `ifconfig | grep "inet "`
- Frontend port: 3000
- Backend port: 8000
- Access URL: `http://{YOUR_IP}:3000`
- All data is stored locally in SQLite database
- No internet connection required (same network only)

---

**Status: READY FOR MOBILE TESTING ✅**

All systems configured and verified. Ready to test on client phone.
