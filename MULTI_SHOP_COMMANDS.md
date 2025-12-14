# Multi-Shop System - Command Reference

## 🚀 Quick Start Commands

### Setup (One-Time)
```bash
# Navigate to project
cd /home/dreamer/business-dashboard

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create initial shop for existing users (optional)
python manage.py shell
>>> from django.contrib.auth.models import User
>>> from sales.models import Shop
>>> for user in User.objects.all():
...     Shop.objects.get_or_create(user=user, name="Main Shop")
>>> exit()
```

### Start Servers
```bash
# Terminal 1: Start Django
python manage.py runserver

# Terminal 2: Start React
cd frontend
npm start
```

### Access Application
```
Frontend: http://localhost:3000
Admin:    http://localhost:8000/admin
API:      http://localhost:8000/api/
```

---

## 🔧 Django Management Commands

### Database Operations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Revert migrations
python manage.py migrate sales 0001

# Show migration status
python manage.py showmigrations

# Create superuser
python manage.py createsuperuser

# Reset database (WARNING: deletes all data)
python manage.py flush
```

### Django Shell
```bash
# Open Django shell
python manage.py shell

# Inside shell:
from django.contrib.auth.models import User
from sales.models import Shop, Stock, Sale, Expense

# List all shops
Shop.objects.all()

# List user's shops
user = User.objects.get(username='ahmed')
user.shops.all()

# Get active shop
active_shop = Shop.objects.filter(user=user, is_active=True).first()

# Create shop
Shop.objects.create(user=user, name="New Shop", location="Downtown")

# Exit shell
exit()
```

### Admin Interface
```bash
# Create superuser
python manage.py createsuperuser

# Access admin
# Go to: http://localhost:8000/admin
# Login with superuser credentials
```

---

## 📱 API Commands (curl)

### Shop Management

#### List All Shops
```bash
curl -X GET http://localhost:8000/api/shops/ \
  -H "Cookie: sessionid=<your_sessionid>"
```

#### Create Shop
```bash
curl -X POST http://localhost:8000/api/shops/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <csrf_token>" \
  -H "Cookie: sessionid=<sessionid>" \
  -d '{
    "name": "Downtown Store",
    "location": "Downtown",
    "description": "Main store"
  }'
```

#### Get Shop Details
```bash
curl -X GET http://localhost:8000/api/shops/1/ \
  -H "Cookie: sessionid=<sessionid>"
```

#### Update Shop
```bash
curl -X PUT http://localhost:8000/api/shops/1/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <csrf_token>" \
  -H "Cookie: sessionid=<sessionid>" \
  -d '{
    "name": "Downtown Store Updated",
    "location": "Downtown"
  }'
```

#### Delete Shop
```bash
curl -X DELETE http://localhost:8000/api/shops/1/ \
  -H "X-CSRFToken: <csrf_token>" \
  -H "Cookie: sessionid=<sessionid>"
```

#### Set Shop as Active
```bash
curl -X POST http://localhost:8000/api/shops/1/set_active/ \
  -H "X-CSRFToken: <csrf_token>" \
  -H "Cookie: sessionid=<sessionid>"
```

#### Get Active Shop
```bash
curl -X GET http://localhost:8000/api/shops/active_shop/ \
  -H "Cookie: sessionid=<sessionid>"
```

---

## 🧪 Testing Commands

### Test Shop Creation
```bash
# 1. Login first
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'

# 2. Create shop
curl -X POST http://localhost:8000/api/shops/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -H "Cookie: sessionid=<sessionid>" \
  -d '{"name": "Test Shop"}'

# 3. List shops
curl -X GET http://localhost:8000/api/shops/ \
  -H "Cookie: sessionid=<sessionid>"
```

### Test Data Isolation
```bash
# 1. Create Shop A
curl -X POST http://localhost:8000/api/shops/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -H "Cookie: sessionid=<sessionid>" \
  -d '{"name": "Shop A"}'

# 2. Create Shop B
curl -X POST http://localhost:8000/api/shops/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -H "Cookie: sessionid=<sessionid>" \
  -d '{"name": "Shop B"}'

# 3. Add stock to Shop A
curl -X POST http://localhost:8000/api/stocks/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -H "Cookie: sessionid=<sessionid>" \
  -d '{
    "shop": 1,
    "name": "Shirts",
    "category": "Clothing",
    "price": 15000,
    "quantity_in_stock": 50
  }'

# 4. Switch to Shop B
curl -X POST http://localhost:8000/api/shops/2/set_active/ \
  -H "X-CSRFToken: <token>" \
  -H "Cookie: sessionid=<sessionid>"

# 5. List stocks (should be empty for Shop B)
curl -X GET http://localhost:8000/api/stocks/ \
  -H "Cookie: sessionid=<sessionid>"
```

---

## 🐛 Debugging Commands

### Check Django Logs
```bash
# Run Django with verbose output
python manage.py runserver --verbosity 2

# Check for migration issues
python manage.py migrate --plan

# Show SQL queries
python manage.py sqlmigrate sales 0001
```

### Check Database
```bash
# Open SQLite shell
sqlite3 db.sqlite3

# Inside SQLite:
.tables
SELECT * FROM sales_shop;
SELECT * FROM sales_stock;
SELECT * FROM sales_sale;
SELECT * FROM sales_expense;
.quit
```

### Check Frontend
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start with verbose output
npm start -- --verbose
```

---

## 🔄 Common Workflows

### Complete Setup Workflow
```bash
# 1. Navigate to project
cd /home/dreamer/business-dashboard

# 2. Create migrations
python manage.py makemigrations

# 3. Apply migrations
python manage.py migrate

# 4. Start Django (Terminal 1)
python manage.py runserver

# 5. Start React (Terminal 2)
cd frontend
npm start

# 6. Open browser
# http://localhost:3000

# 7. Login and test
```

### Add New Shop Workflow
```bash
# 1. Go to http://localhost:3000
# 2. Login
# 3. See Shop Selector at top
# 4. Click "Add Shop"
# 5. Enter shop name
# 6. Click "Create"
# 7. New shop appears in selector
```

### Switch Shop Workflow
```bash
# 1. See Shop Selector
# 2. Click different shop name
# 3. Shop becomes active (checkmark)
# 4. Dashboard data refreshes
# 5. See only that shop's data
```

---

## 📊 Database Inspection

### View All Shops
```bash
python manage.py shell
>>> from sales.models import Shop
>>> Shop.objects.all()
>>> for shop in Shop.objects.all():
...     print(f"{shop.name} - Active: {shop.is_active}")
```

### View User's Shops
```bash
python manage.py shell
>>> from django.contrib.auth.models import User
>>> user = User.objects.get(username='ahmed')
>>> user.shops.all()
```

### View Shop's Stocks
```bash
python manage.py shell
>>> from sales.models import Shop
>>> shop = Shop.objects.get(id=1)
>>> shop.stocks.all()
```

### View Shop's Sales
```bash
python manage.py shell
>>> from sales.models import Shop
>>> shop = Shop.objects.get(id=1)
>>> shop.sales.all()
```

---

## 🚨 Troubleshooting Commands

### Fix Migration Issues
```bash
# Show migration status
python manage.py showmigrations

# Revert to specific migration
python manage.py migrate sales 0001

# Fake migration
python manage.py migrate --fake

# Fake initial migration
python manage.py migrate --fake-initial
```

### Clear Cache
```bash
# Clear Django cache
python manage.py clear_cache

# Clear npm cache
npm cache clean --force

# Clear browser cache
# Ctrl+Shift+Delete in browser
```

### Restart Services
```bash
# Kill Django (if stuck)
pkill -f "python manage.py runserver"

# Kill React (if stuck)
pkill -f "npm start"

# Restart both
python manage.py runserver &
cd frontend && npm start &
```

---

## 📝 Useful Aliases

Add to `.bashrc` or `.zshrc`:

```bash
# Django shortcuts
alias dj='python manage.py'
alias djm='python manage.py migrate'
alias djmm='python manage.py makemigrations'
alias djsh='python manage.py shell'
alias djrun='python manage.py runserver'

# Project shortcuts
alias cdproj='cd /home/dreamer/business-dashboard'
alias cdfront='cd /home/dreamer/business-dashboard/frontend'

# Start servers
alias startall='python manage.py runserver & cd frontend && npm start'
```

Then use:
```bash
cdproj
djmm
djm
djrun
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Create migrations | `python manage.py makemigrations` |
| Apply migrations | `python manage.py migrate` |
| Start Django | `python manage.py runserver` |
| Start React | `cd frontend && npm start` |
| Open shell | `python manage.py shell` |
| Create superuser | `python manage.py createsuperuser` |
| List shops | `curl http://localhost:8000/api/shops/` |
| Create shop | `curl -X POST http://localhost:8000/api/shops/` |
| View admin | `http://localhost:8000/admin` |
| View app | `http://localhost:3000` |

---

## ✨ Summary

**All commands needed to setup and manage Multi-Shop System!**

- ✅ Setup commands
- ✅ Django commands
- ✅ API commands
- ✅ Testing commands
- ✅ Debugging commands
- ✅ Database commands
- ✅ Troubleshooting commands

**Ready to go!** 🚀
