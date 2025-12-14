# ProShop - Testing Guide

Complete testing guide for the ProShop Business Dashboard application.

## Prerequisites

- Both backend and frontend servers running
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Manual Testing Workflow

### 1. User Registration Test

**Steps:**
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Username: johndoe
   - Password: testpass123
   - Confirm Password: testpass123
4. Click "Create Account"

**Expected Result:**
- ✅ User is created
- ✅ Redirected to dashboard
- ✅ User name appears in header

### 2. User Login Test

**Steps:**
1. Click "Logout" to log out
2. Click "Sign In"
3. Enter credentials:
   - Username: johndoe
   - Password: testpass123
4. Click "Sign In"

**Expected Result:**
- ✅ User is logged in
- ✅ Dashboard loads
- ✅ User name appears in header

### 3. Add Stock Test

**Steps:**
1. Go to "My Stocks" section
2. Click "Add Stock" button
3. Fill in the form:
   - Product Name: T-Shirts
   - Category: Clothing
   - Price: 2500
4. Click "Add Stock"

**Expected Result:**
- ✅ Stock is added to the list
- ✅ Form closes
- ✅ Stock appears in grid view

### 4. Add Multiple Stocks Test

**Steps:**
1. Add 3-5 different products:
   - Pants (Clothing, 5000)
   - Shoes (Footwear, 8000)
   - Hats (Accessories, 1500)
   - Socks (Accessories, 800)

**Expected Result:**
- ✅ All stocks appear in the list
- ✅ Dashboard shows correct count
- ✅ Average price is calculated correctly

### 5. Record Sale Test

**Steps:**
1. In "My Stocks", click "Record Sale" on T-Shirts
2. Click "+1" button 3 times (quantity = 3)
3. Verify:
   - System Price: 7500 (3 × 2500)
   - Total: 7500
4. Click "Confirm Sale"

**Expected Result:**
- ✅ Sale is recorded
- ✅ Form closes
- ✅ Quantity sold updates in stock card
- ✅ Sale appears in "Sales" section

### 6. Adjust Price Test

**Steps:**
1. Click "Record Sale" on Pants
2. Click "+5" button (quantity = 5)
3. System Price should show: 25000 (5 × 5000)
4. Change "Actual Price" to 24000
5. Click "Confirm Sale"

**Expected Result:**
- ✅ Sale recorded with adjusted price
- ✅ Green checkmark shows price adjustment
- ✅ Total amount is 24000 (not 25000)

### 7. Dashboard Analytics Test

**Steps:**
1. Go to "Dashboard"
2. Verify the following cards:
   - Today's Income: Sum of all sales
   - Items Sold Today: Total quantity
   - Average Price: Average of all product prices
   - Total Stocks: Number of products

**Expected Result:**
- ✅ All metrics are calculated correctly
- ✅ Income & Profit Trend chart displays
- ✅ Stock Overview shows product count

### 8. Sales History Test

**Steps:**
1. Go to "Sales" section
2. Verify the sales table shows:
   - Product name
   - Quantity
   - Price per unit
   - Total amount
   - Timestamp

**Expected Result:**
- ✅ All sales are listed
- ✅ Most recent sales appear first
- ✅ Timestamps are correct

### 9. Dark/Light Mode Test

**Steps:**
1. Click the Sun/Moon icon in sidebar
2. Observe the theme change
3. Click again to switch back

**Expected Result:**
- ✅ Theme switches smoothly
- ✅ All colors update correctly
- ✅ Text remains readable
- ✅ Theme persists during session

### 10. Delete Stock Test

**Steps:**
1. In "My Stocks", hover over a stock card
2. Click the "×" button
3. Verify stock is removed

**Expected Result:**
- ✅ Stock is deleted
- ✅ Stock count decreases
- ✅ Stock no longer appears in list

### 11. Logout Test

**Steps:**
1. Click "Logout" in sidebar
2. Verify redirect to login page

**Expected Result:**
- ✅ User is logged out
- ✅ Redirected to authentication page
- ✅ Session is cleared

### 12. Login After Logout Test

**Steps:**
1. After logout, login again with same credentials
2. Verify all previous data is still there

**Expected Result:**
- ✅ User can log back in
- ✅ All stocks are preserved
- ✅ All sales history is preserved

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password_confirm": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

### Add Stock
```bash
curl -X POST http://localhost:8000/api/stocks/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "T-Shirts",
    "category": "Clothing",
    "price": "2500"
  }'
```

### Get All Stocks
```bash
curl http://localhost:8000/api/stocks/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Record Sale
```bash
curl -X POST http://localhost:8000/api/sales/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "stock": 1,
    "quantity": 5,
    "price_per_unit": "2500",
    "total_amount": "12500"
  }'
```

### Get Daily Sales Summary
```bash
curl http://localhost:8000/api/sales/daily_summary/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### Get Stock Summary
```bash
curl http://localhost:8000/api/stocks/summary/ \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

## Browser Developer Tools Testing

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform actions (add stock, record sale)
4. Verify:
   - ✅ Requests return 200/201 status
   - ✅ Response data is correct
   - ✅ No CORS errors

### Check Console for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Perform all actions
4. Verify:
   - ✅ No red error messages
   - ✅ No network errors
   - ✅ No JavaScript errors

### Check Local Storage
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Verify session data is stored correctly

## Performance Testing

### Load Time Test
1. Open http://localhost:3000
2. Measure page load time
3. Expected: < 3 seconds

### Dashboard with Multiple Stocks
1. Add 20+ stocks
2. Record 50+ sales
3. Go to Dashboard
4. Verify:
   - ✅ Page loads smoothly
   - ✅ Charts render correctly
   - ✅ No lag or freezing

### Responsive Design Test
1. Open DevTools (F12)
2. Toggle Device Toolbar
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. Verify:
   - ✅ Layout adapts correctly
   - ✅ All buttons are clickable
   - ✅ Text is readable

## Error Handling Tests

### Invalid Login
1. Try logging in with wrong password
2. Expected: Error message appears

### Duplicate Username
1. Try registering with existing username
2. Expected: Error message appears

### Missing Required Fields
1. Try adding stock without name
2. Expected: Error message appears

### Network Error Simulation
1. Stop Django server
2. Try any action
3. Expected: Network error message appears

## Data Persistence Tests

### Refresh Page
1. Add a stock
2. Refresh the page (F5)
3. Expected: Stock data persists

### Close and Reopen Browser
1. Add stocks and sales
2. Close browser completely
3. Reopen and login
4. Expected: All data is preserved

### Multiple Tabs
1. Open dashboard in two tabs
2. Add stock in tab 1
3. Refresh tab 2
4. Expected: Stock appears in tab 2

## Security Tests

### Session Expiry
1. Login to account
2. Wait 30 minutes (or modify session timeout)
3. Try performing action
4. Expected: Redirected to login

### Direct API Access
1. Try accessing `/api/stocks/` without authentication
2. Expected: 401 Unauthorized response

### CORS Test
1. Try API call from different origin
2. Expected: CORS headers are correct

## Checklist for Full Testing

- [ ] User can register successfully
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong credentials
- [ ] User can add stocks
- [ ] User can view their stocks
- [ ] User can record sales
- [ ] User can view sales history
- [ ] Dashboard shows correct metrics
- [ ] Charts render correctly
- [ ] Dark/Light mode toggle works
- [ ] User can delete stocks
- [ ] User can logout
- [ ] Data persists after refresh
- [ ] Data persists after logout/login
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] No network errors
- [ ] Price adjustment works
- [ ] Quantity calculation is correct
- [ ] Theme toggle works smoothly

## Known Limitations

- Session timeout not implemented (development only)
- No email verification
- No password reset functionality
- No file upload/export
- No real-time notifications
- No inventory alerts

## Future Testing Scenarios

- [ ] Load testing with 1000+ users
- [ ] Stress testing with 10000+ sales records
- [ ] Database backup/restore testing
- [ ] API rate limiting testing
- [ ] Payment integration testing
- [ ] Email notification testing

---

**Happy Testing! 🧪**
