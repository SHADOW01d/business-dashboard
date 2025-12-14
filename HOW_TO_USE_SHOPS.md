# 🏪 How to View & Manage Shops

## 📍 Where to Find Shop Selector

The **Shop Selector** is at the **TOP of your Dashboard**, right below the header.

```
┌─────────────────────────────────────────────────────────────┐
│  ProShop Dashboard                    🌙 Logout             │
├─────────────────────────────────────────────────────────────┤
│  🏪 My Shops (2)                           [+ Add Shop]     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Main Shop ✓]  [Downtown Store]                      │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  📊 Dashboard  | 📦 My Stocks  | 💰 Expenses  | 📄 Reports  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dashboard Content Here...                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step: View Your Shops

### Step 1: Login to Dashboard
1. Go to http://localhost:3000
2. Login with your account
3. You're now on the Dashboard

### Step 2: Look at Shop Selector
Look at the **top of the page** for:
```
🏪 My Shops (2)        [+ Add Shop]
```

This shows:
- 🏪 = Shop icon
- "My Shops" = Label
- (2) = Number of shops you have
- [+ Add Shop] = Button to create new shop

### Step 3: See Your Shops
Below that, you'll see your shops as buttons:
```
[Main Shop ✓]  [Downtown Store]
```

- **Main Shop ✓** = Currently active shop (has checkmark)
- **Downtown Store** = Another shop (no checkmark)

---

## 🔄 How to Switch Between Shops

### To View a Different Shop's Data

**Click on the shop name:**
```
[Main Shop ✓]  [Downtown Store]
                    ↑
                Click here
```

**What happens:**
1. Shop becomes active (gets checkmark) ✓
2. Dashboard updates automatically
3. Shows only that shop's data
4. All metrics update for that shop

**Example:**
```
Before clicking:
[Main Shop ✓]  [Downtown Store]
- Stocks: 50
- Sales: 100
- Expenses: 5,000

After clicking "Downtown Store":
[Main Shop]  [Downtown Store ✓]
- Stocks: 30
- Sales: 50
- Expenses: 3,000
```

---

## ➕ How to Create a New Shop

### Step 1: Click "Add Shop" Button
```
🏪 My Shops (2)        [+ Add Shop]
                            ↑
                        Click here
```

### Step 2: Fill in Shop Details
A form appears:
```
┌─────────────────────────────────┐
│ Create New Shop                 │
├─────────────────────────────────┤
│ Shop name: [_____________]      │
│ Location:  [_____________]      │
├─────────────────────────────────┤
│ [Cancel]  [Create]              │
└─────────────────────────────────┘
```

**Fields:**
- **Shop name** (required): e.g., "Downtown Store", "Mall Shop"
- **Location** (optional): e.g., "Downtown", "Shopping Mall"

### Step 3: Click "Create"
```
[Cancel]  [Create]
              ↑
          Click here
```

### Step 4: New Shop Appears
```
🏪 My Shops (3)        [+ Add Shop]
[Main Shop]  [Downtown Store]  [Mall Shop]
```

Your new shop is now in the list!

---

## 📊 View Shop Data

### What Data Shows Per Shop?

When you click a shop to make it active, you see:

#### **Dashboard Tab**
- Total Stocks (for that shop)
- Today's Income (from that shop's sales)
- Total Expenses (for that shop)
- Net Profit (for that shop)

#### **My Stocks Tab**
- Only stocks added to that shop
- Stock alerts for that shop
- Profit analysis for that shop

#### **Expenses Tab**
- Only expenses for that shop
- Expense breakdown for that shop

#### **Reports Tab**
- Reports for that shop
- PDF includes only that shop's data

---

## 🎯 Example Workflow

### Scenario: You have 3 shops

```
Shop 1: Main Shop (Downtown)
- 50 stocks
- 100 sales today
- 5,000 expenses

Shop 2: Mall Store
- 30 stocks
- 50 sales today
- 3,000 expenses

Shop 3: Airport Store
- 20 stocks
- 30 sales today
- 2,000 expenses
```

### How to View Each Shop

**Step 1: View Main Shop**
```
Click: [Main Shop ✓]
See: 50 stocks, 100 sales, 5,000 expenses
```

**Step 2: Switch to Mall Store**
```
Click: [Mall Store]
See: 30 stocks, 50 sales, 3,000 expenses
```

**Step 3: Switch to Airport Store**
```
Click: [Airport Store]
See: 20 stocks, 30 sales, 2,000 expenses
```

**Step 4: Back to Main Shop**
```
Click: [Main Shop]
See: 50 stocks, 100 sales, 5,000 expenses
```

---

## 💡 Key Points

✅ **Shop Selector is always visible** - Top of dashboard
✅ **Active shop has checkmark** - Shows which shop you're viewing
✅ **Click to switch** - Instantly see different shop's data
✅ **All data is isolated** - Each shop has separate data
✅ **Easy to create** - Just click "Add Shop"
✅ **Easy to switch** - Just click shop name

---

## 🔍 What You Can Do With Each Shop

### For Each Shop You Can:

1. **View Stocks**
   - See all products in that shop
   - Add new stocks
   - Record sales
   - View stock alerts

2. **Record Sales**
   - Sell products from that shop
   - See sales history
   - Track revenue

3. **Track Expenses**
   - Add expenses for that shop
   - View expense breakdown
   - See total expenses

4. **View Analytics**
   - Dashboard metrics for that shop
   - Charts and reports
   - Profit analysis

5. **Generate Reports**
   - PDF reports for that shop
   - Daily/Weekly reports
   - Export data

---

## 📱 Shop Selector Features

### Visual Indicators

**Active Shop:**
```
[Main Shop ✓]
```
- Has checkmark ✓
- Blue/highlighted background
- This is the shop you're viewing

**Inactive Shop:**
```
[Downtown Store]
```
- No checkmark
- Light background
- Click to view this shop

### Shop Count
```
🏪 My Shops (3)
```
- Shows total number of shops
- Updates when you create new shop

### Add Shop Button
```
[+ Add Shop]
```
- Click to create new shop
- Opens shop creation form

---

## 🎓 Complete Example

### Starting Fresh

**1. Login**
```
Go to http://localhost:3000
Login with your account
```

**2. See Default Shop**
```
🏪 My Shops (1)        [+ Add Shop]
[Main Shop ✓]
```

**3. Add First New Shop**
```
Click: [+ Add Shop]
Enter: "Downtown Store"
Click: [Create]
```

**4. See Two Shops**
```
🏪 My Shops (2)        [+ Add Shop]
[Main Shop ✓]  [Downtown Store]
```

**5. Add Stocks to Main Shop**
```
Go to: My Stocks tab
Click: Add Stock
Add: "Shirts" (50 units)
```

**6. Switch to Downtown Store**
```
Click: [Downtown Store]
```

**7. Add Stocks to Downtown Store**
```
Go to: My Stocks tab
Click: Add Stock
Add: "Shoes" (30 units)
```

**8. Switch Back to Main Shop**
```
Click: [Main Shop ✓]
See: Only "Shirts" (50 units)
```

**9. Switch to Downtown Store**
```
Click: [Downtown Store]
See: Only "Shoes" (30 units)
```

---

## ✨ Summary

**To view shops:**
1. Look at Shop Selector (top of dashboard)
2. See all your shops as buttons
3. Click shop name to view its data
4. Dashboard updates automatically
5. See only that shop's stocks, sales, expenses

**To create shop:**
1. Click "Add Shop" button
2. Enter shop name and location
3. Click "Create"
4. New shop appears in selector

**To switch shops:**
1. Click different shop name
2. Dashboard updates
3. See that shop's data

**That's it!** 🎉

---

## 🚀 You're Ready!

Now you know how to:
- ✅ View your shops
- ✅ Create new shops
- ✅ Switch between shops
- ✅ See shop-specific data
- ✅ Manage multiple shops

**Enjoy your multi-shop system!** 🏪
