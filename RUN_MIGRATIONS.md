# 🗄️ Database Migrations Required

## ⚠️ Current Issue

The backend is running but the **Expense table is missing** from the database.

Error: `no such table: sales_expense`

---

## ✅ Solution: Run Migrations

### Step 1: Stop the Backend
Press `Ctrl+C` in the terminal where backend is running

### Step 2: Create Migrations
```bash
python manage.py makemigrations
```

You should see:
```
Migrations for 'sales':
  sales/migrations/0002_expense.py
    - Create model Expense
```

### Step 3: Apply Migrations
```bash
python manage.py migrate
```

You should see:
```
Running migrations:
  Applying sales.0002_expense... OK
```

### Step 4: Restart Backend
```bash
python manage.py runserver 0.0.0.0:8000
```

---

## 🎯 What These Commands Do

- **makemigrations** - Creates migration files based on your models
- **migrate** - Applies those migrations to the database

---

## ✨ After Migrations

Your database will have:
- ✅ `sales_stock` table
- ✅ `sales_sale` table
- ✅ `sales_expense` table (NEW!)
- ✅ `auth_user` table

And your app will work perfectly! 🚀
