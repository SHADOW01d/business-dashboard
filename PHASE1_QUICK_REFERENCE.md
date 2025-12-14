# 🚀 Phase 1 Quick Reference - Multi-App Architecture

## 📊 7 Apps Overview

### 1️⃣ **users/** - Authentication & User Management
**Models:**
- `UserProfile` - Phone, address, profile info
- `UserSettings` - Theme, language, notifications, security

**API Endpoints:**
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/current_user/` - Get current user
- `GET /api/auth/settings/` - Get user settings
- `PATCH /api/auth/settings/` - Update settings

---

### 2️⃣ **inventory/** - Stock Management
**Models:**
- `Stock` - Product inventory (name, price, quantity, category)
- `StockHistory` - Track stock changes (sold, added, adjusted)

**API Endpoints:**
- `GET /api/inventory/stocks/` - List all stocks
- `POST /api/inventory/stocks/` - Create stock
- `GET /api/inventory/stocks/{id}/` - Get stock details
- `PUT /api/inventory/stocks/{id}/` - Update stock
- `DELETE /api/inventory/stocks/{id}/` - Delete stock
- `GET /api/inventory/stocks/history/` - Get stock history

---

### 3️⃣ **shops/** - Multi-Shop Management
**Models:**
- `Shop` - Shop info (name, location, is_active)

**API Endpoints:**
- `GET /api/shops/` - List all user's shops
- `POST /api/shops/` - Create new shop
- `GET /api/shops/{id}/` - Get shop details
- `PUT /api/shops/{id}/` - Update shop
- `DELETE /api/shops/{id}/` - Delete shop
- `POST /api/shops/{id}/set_active/` - Set active shop
- `GET /api/shops/active_shop/` - Get active shop

---

### 4️⃣ **sales/** - Sales Transactions
**Models:**
- `Sale` - Sales records (stock, quantity, price, total)

**API Endpoints:**
- `GET /api/sales/` - List all sales
- `POST /api/sales/` - Record new sale
- `GET /api/sales/{id}/` - Get sale details
- `DELETE /api/sales/{id}/` - Delete sale
- `GET /api/sales/daily_summary/` - Today's sales summary
- `GET /api/sales/report_data/` - Report data (daily/weekly)

---

### 5️⃣ **expenses/** - Expense Tracking
**Models:**
- `Expense` - Expense records (category, description, amount)

**API Endpoints:**
- `GET /api/expenses/` - List all expenses
- `POST /api/expenses/` - Create expense
- `GET /api/expenses/{id}/` - Get expense details
- `DELETE /api/expenses/{id}/` - Delete expense
- `GET /api/expenses/daily_summary/` - Today's expenses
- `GET /api/expenses/by_category/` - Expenses by category

---

### 6️⃣ **security/** - 2FA & Security
**Models:**
- `TwoFactorAuth` - 2FA settings (method, phone, backup codes)
- `VerificationCode` - Temporary verification codes (6-digit)

**API Endpoints:**
- `GET /api/security/2fa/status/` - Get 2FA status
- `POST /api/security/2fa/enable/` - Enable 2FA
- `POST /api/security/2fa/disable/` - Disable 2FA
- `POST /api/security/2fa/send_code/` - Send verification code
- `POST /api/security/2fa/verify_code/` - Verify code
- `POST /api/security/2fa/backup_codes/` - Generate backup codes

---

### 7️⃣ **analytics/** - Reports & Analytics
**No Models** - Data aggregation from other apps

**API Endpoints:**
- `GET /api/analytics/report_data/` - Get report data
- `GET /api/analytics/profit_margin/` - Profit margin analysis
- `GET /api/analytics/top_products/` - Top selling products
- `GET /api/analytics/expense_breakdown/` - Expense breakdown

---

## 🔗 Database Relationships

```
User (1)
├── UserProfile (1)
├── UserSettings (1)
├── Shop (N) ← user_id
│   ├── Stock (N) ← shop_id
│   │   └── StockHistory (N) ← stock_id
│   ├── Sale (N) ← shop_id
│   └── Expense (N) ← shop_id
├── Stock (N) ← user_id
├── Sale (N) ← user_id
├── Expense (N) ← user_id
├── TwoFactorAuth (1)
└── VerificationCode (N) ← user_id
```

---

## 📈 Performance Optimizations

### Database Indexes Added:
```python
# inventory/Stock
- Index on (shop, user)
- Index on (created_at)
- Index on (shop, created_at)

# inventory/StockHistory
- Index on (stock, created_at)

# shops/Shop
- Index on (user, is_active)

# expenses/Expense
- Index on (shop, created_at)
- Index on (user, created_at)
- Index on (category, created_at)

# sales/Sale
- Index on (shop, created_at)
- Index on (user, created_at)
- Index on (stock, created_at)

# security/VerificationCode
- Index on (user, code)
- Index on (expires_at)
```

### Expected Performance Gains:
- **Shop switching:** 2-3 seconds → 200-300ms (10x faster!)
- **Stock queries:** Faster with indexes
- **Sales queries:** Optimized with indexes
- **Expense queries:** Faster filtering

---

## 🎯 API URL Structure

```
/api/auth/          → users app
/api/inventory/     → inventory app
/api/sales/         → sales app
/api/expenses/      → expenses app
/api/shops/         → shops app
/api/security/      → security app
/api/analytics/     → analytics app
```

---

## 📝 Model Fields Reference

### Stock
```python
- shop (FK to Shop)
- user (FK to User)
- name (CharField)
- category (CharField)
- price (DecimalField)
- quantity_in_stock (IntegerField)
- quantity_sold (IntegerField)
- min_stock_level (IntegerField)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

### Sale
```python
- shop (FK to Shop)
- stock (FK to Stock)
- user (FK to User)
- quantity (IntegerField)
- price_per_unit (DecimalField)
- total_amount (DecimalField)
- created_at (DateTimeField)
```

### Expense
```python
- shop (FK to Shop)
- user (FK to User)
- category (CharField) - 8 choices
- description (TextField)
- amount (DecimalField)
- created_at (DateTimeField)
```

### Shop
```python
- user (FK to User)
- name (CharField)
- location (CharField)
- description (TextField)
- is_active (BooleanField)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

---

## 🚀 Commands to Run

```bash
# 1. Create migrations
python3 manage.py makemigrations

# 2. Apply migrations
python3 manage.py migrate

# 3. Create superuser
python3 manage.py createsuperuser

# 4. Run server
python3 manage.py runserver

# 5. Run tests
python3 manage.py test

# 6. Collect static files
python3 manage.py collectstatic
```

---

## ✨ Key Benefits

✅ **Better Organization** - Each app has one responsibility
✅ **Faster Queries** - Database indexes on all important fields
✅ **Scalable** - Ready for enterprise features
✅ **Maintainable** - Easy to find and update code
✅ **Reusable** - Apps can be used in other projects
✅ **Professional** - Production-ready architecture
✅ **Team-Friendly** - Different teams can work on different apps

---

## 📊 File Structure

```
business-dashboard/
├── users/
│   ├── models.py (UserProfile, UserSettings)
│   ├── serializers.py (User, Profile, Settings)
│   ├── views.py (Auth, Settings ViewSets)
│   ├── urls.py (Auth routes)
│   └── admin.py (Admin config)
│
├── inventory/
│   ├── models.py (Stock, StockHistory)
│   ├── serializers.py (Stock, History)
│   ├── views.py (Stock ViewSet)
│   ├── urls.py (Stock routes)
│   └── admin.py (Admin config)
│
├── shops/
│   ├── models.py (Shop)
│   ├── serializers.py (Shop)
│   ├── views.py (Shop ViewSet)
│   ├── urls.py (Shop routes)
│   └── admin.py (Admin config)
│
├── sales/
│   ├── models.py (Sale)
│   ├── serializers.py (Sale)
│   ├── views.py (Sale ViewSet)
│   ├── urls.py (Sale routes)
│   └── admin.py (Admin config)
│
├── expenses/
│   ├── models.py (Expense)
│   ├── serializers.py (Expense)
│   ├── views.py (Expense ViewSet)
│   ├── urls.py (Expense routes)
│   └── admin.py (Admin config)
│
├── security/
│   ├── models.py (TwoFactorAuth, VerificationCode)
│   ├── serializers.py (2FA, Code)
│   ├── views.py (2FA ViewSet)
│   ├── urls.py (2FA routes)
│   └── admin.py (Admin config)
│
├── analytics/
│   ├── models.py (empty)
│   ├── serializers.py (Report serializers)
│   ├── views.py (Analytics ViewSet)
│   ├── urls.py (Analytics routes)
│   └── admin.py (Admin config)
│
└── config/
    ├── settings.py (updated with all apps)
    ├── urls.py (updated with all routes)
    └── wsgi.py
```

---

## 🎓 Next Phase

**Phase 2: Create Views & URLs**
- Create ViewSets for each app
- Create URL routing
- Create admin interfaces
- Test all endpoints

**Phase 3: Performance Optimization**
- Add caching
- Optimize queries
- Monitor performance

**Phase 4: Frontend Bootstrap**
- Install Bootstrap
- Update React components
- Responsive design

---

**Phase 1 Complete! Ready for Phase 2!** 🚀
