# 🧪 Test Shop Analytics - Complete Guide

## ✅ Fix Applied

The analytics issue has been fixed! Now when you switch shops, the data updates correctly.

---

## 🚀 How to Test

### Step 1: Restart React Server
```bash
# Stop React (Ctrl+C in terminal)
cd /home/dreamer/business-dashboard/frontend
npm start
```

### Step 2: Create Two Shops

**Shop 1: Main Shop (Already exists)**
- Should already be active
- We'll add data to it

**Shop 2: Downtown Store (Create new)**
1. Click [+ Add Shop]
2. Enter: "Downtown Store"
3. Click [Create]
4. Now have 2 shops

---

## 📊 Test Scenario

### Phase 1: Add Data to Main Shop

**Step 1: Make sure Main Shop is active**
```
Look at Shop Selector
Should see: [Main Shop ✓]
```

**Step 2: Go to "My Stocks" tab**
```
Click: My Stocks
```

**Step 3: Add Stock**
```
Click: Add Stock
Enter:
  - Name: "Shirts"
  - Category: "Clothing"
  - Price: "15000"
  - Quantity: "50"
Click: Save
```

**Step 4: Record Sale**
```
Click: 📤 Sale (on Shirts)
Enter: Quantity = 10
Click: Save
```

**Step 5: Check Dashboard Metrics**
```
Go back to: Dashboard tab
Should see:
  - Total Stocks: 1
  - Today's Income: 150,000 (10 × 15,000)
  - Total Expenses: 0
  - Net Profit: 150,000
```

**Step 6: Add Expense**
```
Go to: Expenses tab
Click: Add Expense
Enter:
  - Description: "Rent"
  - Category: "Rent"
  - Amount: "50000"
Click: Save
```

**Step 7: Check Updated Metrics**
```
Go back to: Dashboard tab
Should see:
  - Today's Income: 150,000 ✅
  - Total Expenses: 50,000 ✅
  - Net Profit: 100,000 ✅
```

---

### Phase 2: Add Different Data to Downtown Store

**Step 1: Switch to Downtown Store**
```
Click: [Downtown Store] in Shop Selector
```

**Step 2: Verify Shop Changed**
```
Should see: [Downtown Store ✓]
Dashboard metrics should reset to 0
```

**Step 3: Add Different Stock**
```
Go to: My Stocks tab
Click: Add Stock
Enter:
  - Name: "Shoes"
  - Category: "Footwear"
  - Price: "25000"
  - Quantity: "30"
Click: Save
```

**Step 4: Record Sale**
```
Click: 📤 Sale (on Shoes)
Enter: Quantity = 5
Click: Save
```

**Step 5: Check Dashboard Metrics**
```
Go back to: Dashboard tab
Should see:
  - Total Stocks: 1 (only Shoes)
  - Today's Income: 125,000 (5 × 25,000)
  - Total Expenses: 0
  - Net Profit: 125,000
```

**Step 6: Add Different Expense**
```
Go to: Expenses tab
Click: Add Expense
Enter:
  - Description: "Transport"
  - Category: "Transport"
  - Amount: "20000"
Click: Save
```

**Step 7: Check Updated Metrics**
```
Go back to: Dashboard tab
Should see:
  - Today's Income: 125,000 ✅
  - Total Expenses: 20,000 ✅
  - Net Profit: 105,000 ✅
```

---

### Phase 3: Verify Data Isolation

**Step 1: Switch Back to Main Shop**
```
Click: [Main Shop] in Shop Selector
```

**Step 2: Verify Main Shop Data**
```
Dashboard should show:
  - Total Stocks: 1 (Shirts only) ✅
  - Today's Income: 150,000 ✅
  - Total Expenses: 50,000 ✅
  - Net Profit: 100,000 ✅

Go to: My Stocks tab
Should see: Only "Shirts" ✅
Should NOT see: "Shoes" ✅

Go to: Expenses tab
Should see: Only "Rent" ✅
Should NOT see: "Transport" ✅
```

**Step 3: Switch to Downtown Store**
```
Click: [Downtown Store] in Shop Selector
```

**Step 4: Verify Downtown Store Data**
```
Dashboard should show:
  - Total Stocks: 1 (Shoes only) ✅
  - Today's Income: 125,000 ✅
  - Total Expenses: 20,000 ✅
  - Net Profit: 105,000 ✅

Go to: My Stocks tab
Should see: Only "Shoes" ✅
Should NOT see: "Shirts" ✅

Go to: Expenses tab
Should see: Only "Transport" ✅
Should NOT see: "Rent" ✅
```

**Step 5: Switch Back to Main Shop**
```
Click: [Main Shop] in Shop Selector
```

**Step 6: Verify Data is Correct Again**
```
Dashboard should show:
  - Total Stocks: 1 (Shirts)
  - Today's Income: 150,000
  - Total Expenses: 50,000
  - Net Profit: 100,000

All metrics should match Phase 1 ✅
```

---

## ✅ Expected Results

### Main Shop
```
Stocks: 1 (Shirts)
Sales: 10 units × 15,000 = 150,000
Expenses: 50,000 (Rent)
Net Profit: 100,000
```

### Downtown Store
```
Stocks: 1 (Shoes)
Sales: 5 units × 25,000 = 125,000
Expenses: 20,000 (Transport)
Net Profit: 105,000
```

### Data Isolation
```
Main Shop shows only:
  - Shirts (not Shoes)
  - Rent expense (not Transport)
  - 150,000 income (not 125,000)

Downtown Store shows only:
  - Shoes (not Shirts)
  - Transport expense (not Rent)
  - 125,000 income (not 150,000)
```

---

## 🎯 Success Criteria

✅ **Test Passed If:**
1. Main Shop shows Shirts, not Shoes
2. Downtown Store shows Shoes, not Shirts
3. Main Shop income is 150,000
4. Downtown Store income is 125,000
5. Main Shop expenses are 50,000
6. Downtown Store expenses are 20,000
7. Switching shops updates all metrics
8. Each shop shows only its own data
9. Analytics are accurate for each shop
10. No data mixing between shops

❌ **Test Failed If:**
1. Switching shops doesn't update data
2. Both shops show same products
3. Metrics don't change when switching
4. Income/expenses are mixed
5. Data from one shop appears in another

---

## 📋 Checklist

### Before Testing
- [ ] Restart React server
- [ ] Clear browser cache (optional)
- [ ] Open http://localhost:3000
- [ ] Login to your account

### Phase 1: Main Shop
- [ ] Main Shop is active
- [ ] Added "Shirts" stock (50 units)
- [ ] Recorded sale (10 units)
- [ ] Dashboard shows 150,000 income
- [ ] Added "Rent" expense (50,000)
- [ ] Dashboard shows 100,000 net profit

### Phase 2: Downtown Store
- [ ] Created "Downtown Store" shop
- [ ] Switched to Downtown Store
- [ ] Added "Shoes" stock (30 units)
- [ ] Recorded sale (5 units)
- [ ] Dashboard shows 125,000 income
- [ ] Added "Transport" expense (20,000)
- [ ] Dashboard shows 105,000 net profit

### Phase 3: Verification
- [ ] Switched to Main Shop
- [ ] Main Shop shows correct data
- [ ] Switched to Downtown Store
- [ ] Downtown Store shows correct data
- [ ] Switched back to Main Shop
- [ ] Main Shop data is still correct
- [ ] No data mixing between shops
- [ ] All analytics are accurate

---

## 🐛 Troubleshooting

### Issue: Metrics don't update when switching shops
**Solution:**
1. Restart React server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Refresh page (Ctrl+F5)
4. Try again

### Issue: Still seeing first shop's data
**Solution:**
1. Check Shop Selector - which shop is active?
2. Look for checkmark (✓) next to shop name
3. Click shop name again to ensure it's selected
4. Wait a moment for data to load

### Issue: Data is mixed between shops
**Solution:**
1. Stop React server (Ctrl+C)
2. Delete database: `rm db.sqlite3`
3. Run migrations: `python manage.py migrate`
4. Restart React: `npm start`
5. Start fresh with new shops

### Issue: Can't create second shop
**Solution:**
1. Check browser console (F12) for errors
2. Check Django console for errors
3. Make sure you're logged in
4. Try refreshing page and trying again

---

## 📊 Visual Verification

### Main Shop (Correct)
```
🏪 My Shops (2)
[Main Shop ✓] [Downtown Store]

Dashboard:
├─ Today's Income: 150,000
├─ Total Expenses: 50,000
├─ Net Profit: 100,000
└─ Total Stocks: 1

My Stocks:
├─ Shirts (50 units, 10 sold)
└─ (No Shoes)

Expenses:
├─ Rent: 50,000
└─ (No Transport)
```

### Downtown Store (Correct)
```
🏪 My Shops (2)
[Main Shop] [Downtown Store ✓]

Dashboard:
├─ Today's Income: 125,000
├─ Total Expenses: 20,000
├─ Net Profit: 105,000
└─ Total Stocks: 1

My Stocks:
├─ Shoes (30 units, 5 sold)
└─ (No Shirts)

Expenses:
├─ Transport: 20,000
└─ (No Rent)
```

---

## 🎉 Success!

If all tests pass, your multi-shop analytics system is working perfectly! ✅

Each shop has:
- ✅ Isolated stocks
- ✅ Isolated sales
- ✅ Isolated expenses
- ✅ Accurate metrics
- ✅ Correct analytics

---

## 📝 Notes

- Data is stored per shop in the database
- Backend filters by active shop
- Frontend updates when shop changes
- Each shop is completely independent
- No data mixing or conflicts
- Professional multi-shop system ready!

---

**Ready to test? Let's go!** 🚀
