# Multi-Shop System - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Run Migrations (1 minute)
```bash
cd /home/dreamer/business-dashboard
python manage.py makemigrations
python manage.py migrate
```

### Step 2: Restart Backend (30 seconds)
```bash
# Stop current server (Ctrl+C)
python manage.py runserver
```

### Step 3: Restart Frontend (30 seconds)
```bash
# In new terminal:
cd frontend
npm start
```

### Step 4: Test It (3 minutes)
1. Open http://localhost:3000
2. Login to your account
3. See **Shop Selector** at top of dashboard
4. Click **"Add Shop"** button
5. Enter shop name (e.g., "Downtown Store")
6. Click **"Create"**
7. Create 2-3 more shops
8. Click different shops to switch
9. Add stocks to each shop
10. Verify data isolation works ✅

---

## 🎯 Key Features

### Shop Selector Widget
```
┌─────────────────────────────────────┐
│ 🏪 My Shops (3)        [+ Add Shop] │
├─────────────────────────────────────┤
│ [Downtown ✓] [Mall] [Airport]       │
│                                     │
│ Create Shop Form (when Add clicked) │
│ Shop name: _________________        │
│ Location:  _________________        │
│ [Cancel] [Create]                   │
└─────────────────────────────────────┘
```

### What Happens When You Switch Shops
1. Click shop name
2. Backend sets `is_active = True` for that shop
3. Backend sets `is_active = False` for others
4. Frontend refreshes all data
5. Dashboard shows only that shop's data

---

## 📊 Data Isolation Example

```
Ahmed's Account
├── Downtown Store (Active)
│   ├── Stocks: 50 items
│   ├── Sales: 100 today
│   └── Expenses: 5,000
├── Mall Store
│   ├── Stocks: 30 items
│   ├── Sales: 50 today
│   └── Expenses: 3,000
└── Airport Store
    ├── Stocks: 20 items
    ├── Sales: 30 today
    └── Expenses: 2,000

Each shop's data is completely separate!
```

---

## 🔧 API Endpoints

### Create Shop
```bash
POST /api/shops/
{
  "name": "Downtown Store",
  "location": "Downtown"
}
```

### List Shops
```bash
GET /api/shops/
```

### Switch Shop
```bash
POST /api/shops/{id}/set_active/
```

### Get Active Shop
```bash
GET /api/shops/active_shop/
```

---

## ✅ Verification Checklist

- [ ] Migrations created successfully
- [ ] Migrations applied to database
- [ ] Django server restarted
- [ ] React server restarted
- [ ] Can see Shop Selector on dashboard
- [ ] Can create new shop
- [ ] Can switch between shops
- [ ] Data changes when switching shops
- [ ] Each shop has separate stocks
- [ ] Each shop has separate sales
- [ ] Each shop has separate expenses

---

## 🐛 Troubleshooting

### Issue: "No shops found" on dashboard
**Solution**: Create your first shop by clicking "Add Shop"

### Issue: Migrations fail
**Solution**: 
```bash
python manage.py migrate --fake-initial
python manage.py migrate
```

### Issue: Shop selector not showing
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart React server
3. Refresh page

### Issue: Data not updating when switching shops
**Solution**:
1. Check browser console (F12) for errors
2. Check Django console for API errors
3. Restart both servers

---

## 📱 UI Elements

### Shop Selector Location
- **Position**: Top of dashboard (below header)
- **Visible**: Only on Dashboard tab
- **Always Available**: Once logged in

### Shop Button States
- **Active**: Blue gradient background with checkmark ✓
- **Inactive**: Light background, hover effect
- **Hover**: Slightly darker background

### Add Shop Button
- **Location**: Right side of "My Shops" header
- **Icon**: Plus (+) icon
- **Color**: Blue

---

## 🎓 Common Tasks

### Create a New Shop
1. Click "Add Shop" button
2. Enter shop name
3. (Optional) Enter location
4. Click "Create"
5. New shop appears in list

### Switch to Different Shop
1. Click shop name in selector
2. Wait for data to refresh
3. Dashboard updates automatically

### View Shop Details
- Click shop name to activate
- See all stocks for that shop
- See all sales for that shop
- See all expenses for that shop

### Create Stocks in a Shop
1. Make sure shop is active (has checkmark)
2. Go to "My Stocks" tab
3. Click "Add Stock"
4. Stock is created for active shop

### Record Sales in a Shop
1. Make sure shop is active
2. Go to "My Stocks" tab
3. Click "📤 Sale" on a stock
4. Sale is recorded for active shop

---

## 📊 Database Structure

### Shop Table
```
id | user_id | name | location | is_active | created_at | updated_at
```

### Stock Table (Updated)
```
id | shop_id | user_id | name | category | price | quantity_in_stock | ...
```

### Sale Table (Updated)
```
id | shop_id | user_id | stock_id | quantity | price_per_unit | total_amount | ...
```

### Expense Table (Updated)
```
id | shop_id | user_id | category | description | amount | created_at
```

---

## 🚀 Next Features

After multi-shop is working:

1. **Shop Settings** - Edit shop name, location
2. **Shop Analytics** - Reports per shop
3. **Shop Comparison** - Compare shops side-by-side
4. **Team Members** - Add staff to shops
5. **Shop Transfer** - Move stocks between shops

---

## 💡 Tips

✅ **Create multiple shops** to test data isolation
✅ **Add different stocks** to each shop
✅ **Record sales** in each shop
✅ **Switch shops** frequently to verify isolation
✅ **Check admin panel** to see shop data structure

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| Can't see Shop Selector | Refresh page, restart React |
| Can't create shop | Check browser console for errors |
| Shop doesn't switch | Check Django console for errors |
| Data not updating | Restart both servers |
| Migrations fail | Run `makemigrations` then `migrate` |

---

**Ready to use Multi-Shop System! 🎉**

For detailed setup, see `MULTI_SHOP_SETUP.md`
