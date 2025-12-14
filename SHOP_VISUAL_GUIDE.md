# 🎨 Shop System - Visual Guide

## 📍 Dashboard Layout

```
╔═══════════════════════════════════════════════════════════════╗
║                   ProShop Dashboard                           ║
║                                        🌙 Dark Mode | Logout  ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  🏪 My Shops (3)                              [+ Add Shop]    ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ [Main Shop ✓]  [Downtown Store]  [Mall Shop]           │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ← SHOP SELECTOR (Always visible at top)                     ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  📊 Dashboard | 📦 My Stocks | 💰 Expenses | 📄 Reports     ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Dashboard Content (Changes based on active shop)            ║
║                                                               ║
║  📈 Total Stocks: 50                                         ║
║  💵 Today's Income: 15,000                                   ║
║  💸 Total Expenses: 5,000                                    ║
║  📊 Net Profit: 10,000                                       ║
║                                                               ║
║  [Stock Cards]                                               ║
║  [Charts]                                                    ║
║  [Tables]                                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🔄 Shop Switching Flow

```
                    SHOP SELECTOR
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   [Main Shop ✓]  [Downtown Store]  [Mall Shop]
        ↓                ↓                ↓
   50 Stocks       30 Stocks       20 Stocks
   100 Sales       50 Sales        30 Sales
   5,000 Exp       3,000 Exp       2,000 Exp
```

**Click any shop to view its data!**

---

## 📊 Data Isolation Example

### Main Shop (Active)
```
┌─────────────────────────────────┐
│ Main Shop ✓                     │
├─────────────────────────────────┤
│ Stocks:                         │
│  • Shirts (50)                  │
│  • Pants (30)                   │
│                                 │
│ Sales Today: 100                │
│ Expenses: 5,000                 │
│ Income: 15,000                  │
└─────────────────────────────────┘
```

### Downtown Store (Inactive)
```
┌─────────────────────────────────┐
│ Downtown Store                  │
├─────────────────────────────────┤
│ Stocks:                         │
│  • Shoes (30)                   │
│  • Belts (20)                   │
│                                 │
│ Sales Today: 50                 │
│ Expenses: 3,000                 │
│ Income: 8,000                   │
└─────────────────────────────────┘
```

**Each shop has completely separate data!**

---

## ➕ Create New Shop Flow

```
Click [+ Add Shop]
        ↓
┌─────────────────────────────┐
│ Create New Shop             │
├─────────────────────────────┤
│ Shop name: [Downtown Store] │
│ Location:  [Downtown Area]  │
├─────────────────────────────┤
│ [Cancel]  [Create]          │
└─────────────────────────────┘
        ↓
Shop Created!
        ↓
[Main Shop ✓] [Downtown Store]
        ↓
New shop appears in selector!
```

---

## 🎯 Active vs Inactive Shops

### Active Shop (Viewing)
```
┌──────────────────┐
│ Main Shop ✓      │  ← Has checkmark
│ (Blue/Highlighted)│  ← Highlighted background
│ (Bold text)      │  ← Bold text
└──────────────────┘
```

### Inactive Shop (Not Viewing)
```
┌──────────────────┐
│ Downtown Store   │  ← No checkmark
│ (Light background)│  ← Light background
│ (Regular text)   │  ← Regular text
└──────────────────┘
```

**Click inactive shop to make it active!**

---

## 📱 Responsive Design

### Desktop View
```
🏪 My Shops (3)              [+ Add Shop]
[Main Shop ✓] [Downtown Store] [Mall Shop]
```

### Tablet View
```
🏪 My Shops (3)    [+ Add Shop]
[Main Shop ✓]
[Downtown Store]
[Mall Shop]
```

### Mobile View
```
🏪 My Shops (3)
[+ Add Shop]
┌──────────────┐
│ Main Shop ✓  │
├──────────────┤
│Downtown Store│
├──────────────┤
│  Mall Shop   │
└──────────────┘
```

---

## 🔄 Complete User Journey

```
START
  ↓
Login
  ↓
See "Main Shop" (auto-created)
  ↓
Click [+ Add Shop]
  ↓
Create "Downtown Store"
  ↓
Now have 2 shops
  ↓
Click [Downtown Store]
  ↓
See Downtown Store's data
  ↓
Add stocks to Downtown Store
  ↓
Click [Main Shop ✓]
  ↓
See Main Shop's data
  ↓
Add stocks to Main Shop
  ↓
Switch between shops
  ↓
Each shop shows only its data
  ↓
SUCCESS! ✅
```

---

## 📊 Shop Metrics Update

### When You Switch Shops

```
BEFORE (Main Shop Active)
┌─────────────────────────┐
│ Total Stocks: 50        │
│ Today's Income: 15,000  │
│ Expenses: 5,000         │
│ Net Profit: 10,000      │
└─────────────────────────┘

Click: [Downtown Store]
        ↓

AFTER (Downtown Store Active)
┌─────────────────────────┐
│ Total Stocks: 30        │
│ Today's Income: 8,000   │
│ Expenses: 3,000         │
│ Net Profit: 5,000       │
└─────────────────────────┘
```

**All metrics update automatically!**

---

## 🎨 Color Indicators

### Active Shop
```
Background: Blue/Purple gradient
Text: White
Icon: ✓ Checkmark
```

### Inactive Shop
```
Background: Light gray
Text: Dark gray
Icon: None
```

### Hover State
```
Background: Slightly darker
Cursor: Pointer
Effect: Subtle shadow
```

---

## 📋 Shop Information Display

### Shop Selector Shows
```
🏪 My Shops (3)
├─ Shop count: 3
├─ Icon: 🏪 (store)
├─ Label: "My Shops"
└─ Button: [+ Add Shop]

[Main Shop ✓]
├─ Name: Main Shop
├─ Status: Active (✓)
├─ Action: Click to view

[Downtown Store]
├─ Name: Downtown Store
├─ Status: Inactive
├─ Action: Click to view

[Mall Shop]
├─ Name: Mall Shop
├─ Status: Inactive
├─ Action: Click to view
```

---

## 🔐 Data Isolation Visualization

```
User Account
    │
    ├── Main Shop
    │   ├── Stocks
    │   │   ├── Shirts (50)
    │   │   └── Pants (30)
    │   ├── Sales
    │   │   └── 100 today
    │   └── Expenses
    │       └── 5,000
    │
    ├── Downtown Store
    │   ├── Stocks
    │   │   ├── Shoes (30)
    │   │   └── Belts (20)
    │   ├── Sales
    │   │   └── 50 today
    │   └── Expenses
    │       └── 3,000
    │
    └── Mall Shop
        ├── Stocks
        │   ├── Hats (20)
        │   └── Scarves (15)
        ├── Sales
        │   └── 30 today
        └── Expenses
            └── 2,000

Each shop's data is completely separate!
```

---

## ✨ Summary Diagram

```
┌─────────────────────────────────────────┐
│      SHOP SELECTOR (Top of Dashboard)   │
├─────────────────────────────────────────┤
│                                         │
│  🏪 My Shops (3)    [+ Add Shop]        │
│  [Main Shop ✓] [Downtown] [Mall]        │
│                                         │
│  Click any shop to view its data        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      DASHBOARD (Updates Based on        │
│      Active Shop)                       │
│                                         │
│  • Stocks                               │
│  • Sales                                │
│  • Expenses                             │
│  • Charts                               │
│  • Metrics                              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Reference

| Action | Location | Result |
|--------|----------|--------|
| View shop | Click shop name | Dashboard updates |
| Create shop | Click [+ Add Shop] | New shop appears |
| Switch shop | Click different shop | Data changes |
| See active shop | Look for ✓ checkmark | Shows current shop |
| Count shops | See (3) number | Shows total shops |

---

## 🚀 You're All Set!

Now you understand:
- ✅ Where Shop Selector is
- ✅ How to view shops
- ✅ How to create shops
- ✅ How to switch shops
- ✅ How data is isolated

**Start using your multi-shop system!** 🏪✨
