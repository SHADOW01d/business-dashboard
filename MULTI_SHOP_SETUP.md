# Multi-Shop System Setup Guide

## 🎯 What Was Implemented

A complete **Multi-Shop Account System** allowing one user to manage multiple shops with separate inventory, sales, and expenses for each shop.

---

## 📊 Architecture

### Database Models

#### Shop Model
```python
class Shop(models.Model):
    user = ForeignKey(User)           # Owner of the shop
    name = CharField(max_length=255)  # Shop name (e.g., "Downtown Store")
    location = CharField()            # Location (e.g., "Downtown")
    description = TextField()         # Shop description
    is_active = BooleanField()       # Currently active shop
    created_at = DateTimeField()     # Creation timestamp
    updated_at = DateTimeField()     # Last update timestamp
```

#### Updated Models
- **Stock**: Added `shop` ForeignKey (each stock belongs to a shop)
- **Sale**: Added `shop` ForeignKey (each sale belongs to a shop)
- **Expense**: Added `shop` ForeignKey (each expense belongs to a shop)

---

## 🔧 Backend Implementation

### 1. API Endpoints

#### Shop Management (`/api/shops/`)
```
GET    /api/shops/                    # List all user's shops
POST   /api/shops/                    # Create new shop
GET    /api/shops/{id}/               # Get shop details
PUT    /api/shops/{id}/               # Update shop
DELETE /api/shops/{id}/               # Delete shop
POST   /api/shops/{id}/set_active/    # Set as active shop
GET    /api/shops/active_shop/        # Get currently active shop
```

#### Data Filtering
```
GET /api/stocks/?shop={shop_id}       # Get stocks for specific shop
GET /api/sales/?shop={shop_id}        # Get sales for specific shop
GET /api/expenses/?shop={shop_id}     # Get expenses for specific shop
```

### 2. ShopViewSet Features

```python
class ShopViewSet(viewsets.ModelViewSet):
    # Only show shops owned by current user
    def get_queryset(self):
        return Shop.objects.filter(user=self.request.user)
    
    # Auto-set user when creating shop
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    # Set shop as active (deactivate others)
    @action(detail=True, methods=['post'])
    def set_active(self, request, pk=None):
        # Deactivate all other shops
        # Activate this shop
        # Return updated shop data
    
    # Get currently active shop
    @action(detail=False, methods=['get'])
    def active_shop(self, request):
        # Return the active shop or 404
```

### 3. Files Modified

| File | Changes |
|------|---------|
| `sales/models.py` | Added Shop model, updated Stock/Sale/Expense with shop FK |
| `sales/serializers.py` | Added ShopSerializer |
| `sales/views.py` | Added ShopViewSet |
| `sales/urls.py` | Registered ShopViewSet in router |
| `sales/admin.py` | Added ShopAdmin, updated other admins with shop field |

---

## 🎨 Frontend Implementation

### 1. ShopSelector Component

**Location**: `frontend/src/components/ShopSelector.js`

**Features**:
- Display all user's shops
- Create new shop form
- Switch between shops
- Active shop indicator (checkmark)
- Shop count display
- Dark/Light mode support

**Usage**:
```javascript
<ShopSelector isDarkMode={isDarkMode} onShopChange={handleShopChange} />
```

### 2. Dashboard Integration

**Location**: `frontend/src/pages/Dashboard.js`

**Changes**:
- Imported ShopSelector component
- Added `activeShop` state
- Added `handleShopChange` function
- Placed ShopSelector at top of dashboard (below header)
- Refreshes data when shop changes

**Code**:
```javascript
const [activeShop, setActiveShop] = useState(null);

const handleShopChange = (shop) => {
  setActiveShop(shop);
  fetchData(); // Refresh all data for new shop
};

// In render:
<ShopSelector isDarkMode={isDarkMode} onShopChange={handleShopChange} />
```

---

## 🚀 Setup Instructions

### Step 1: Create Migrations

```bash
cd /home/dreamer/business-dashboard

# Create migration files
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate
```

**Expected Output**:
```
Migrations for 'sales':
  sales/migrations/0001_initial.py
    - Create model Shop
    - Add field shop to stock
    - Add field shop to sale
    - Add field shop to expense
```

### Step 2: Create Initial Shop for Existing Users (Optional)

```bash
python manage.py shell

# In Python shell:
>>> from django.contrib.auth.models import User
>>> from sales.models import Shop
>>> for user in User.objects.all():
...     Shop.objects.get_or_create(user=user, name="Main Shop")
>>> exit()
```

### Step 3: Restart Backend

```bash
# Stop current Django server (Ctrl+C)
# Then restart:
python manage.py runserver
```

### Step 4: Restart Frontend

```bash
cd frontend
npm start
```

---

## 📱 User Workflow

### Creating a New Shop

1. **Go to Dashboard**
2. **See Shop Selector** at top (below header)
3. **Click "Add Shop"** button
4. **Enter shop name** (required)
5. **Enter location** (optional)
6. **Click "Create"**
7. **New shop appears** in shop list

### Switching Between Shops

1. **Click on shop name** in Shop Selector
2. **Shop becomes active** (highlighted with checkmark)
3. **All data refreshes** automatically
4. **Dashboard shows** data for selected shop

### Example Usage

```
User: Ahmed
├── Shop 1: "Downtown Store" (Active) ✓
│   ├── Stocks: 50 items
│   ├── Sales: 100 today
│   └── Expenses: 5,000
├── Shop 2: "Mall Store"
│   ├── Stocks: 30 items
│   ├── Sales: 50 today
│   └── Expenses: 3,000
└── Shop 3: "Airport Store"
    ├── Stocks: 20 items
    ├── Sales: 30 today
    └── Expenses: 2,000

Click any shop to switch instantly!
```

---

## 🔄 Data Flow

### Creating a Shop

```
User clicks "Add Shop"
    ↓
Enters shop name & location
    ↓
Frontend: POST /api/shops/
    ↓
Backend: Creates Shop(user=current_user, name=..., location=...)
    ↓
Frontend: Refreshes shop list
    ↓
New shop appears in selector
```

### Switching Shops

```
User clicks shop name
    ↓
Frontend: POST /api/shops/{id}/set_active/
    ↓
Backend:
  - Shop.objects.filter(user=user).update(is_active=False)
  - shop.is_active = True
  - shop.save()
    ↓
Frontend: Calls fetchData()
    ↓
GET /api/stocks/ (filtered by active shop)
GET /api/sales/ (filtered by active shop)
GET /api/expenses/ (filtered by active shop)
    ↓
Dashboard updates with shop's data
```

### Data Isolation

```
When user views dashboard:
1. Get active shop ID from Shop.objects.filter(is_active=True)
2. Fetch stocks WHERE shop_id = active_shop
3. Fetch sales WHERE shop_id = active_shop
4. Fetch expenses WHERE shop_id = active_shop
5. Display only that shop's data
```

---

## 🎨 UI Components

### ShopSelector Component

**Props**:
- `isDarkMode` (boolean) - Dark/Light mode
- `onShopChange` (function) - Callback when shop changes

**Features**:
- Shop count display
- Add Shop button
- Create form (name + location)
- Shop buttons with active indicator
- Hover effects
- Loading state
- Empty state message

**Styling**:
- Responsive grid layout
- Dark/Light theme support
- Smooth transitions
- Professional design

---

## 🔐 Security & Permissions

### Data Isolation
- Each user only sees their own shops
- Each shop's data is isolated
- ViewSet filters by `user=request.user`

### Permissions
- `IsAuthenticated` required on all shop endpoints
- Users can only modify their own shops
- `get_object_or_404` ensures ownership check

### CSRF Protection
- X-CSRFToken header in all POST/PUT/DELETE requests
- Django CSRF middleware enabled

---

## 📊 Admin Interface

### Shop Admin
- View all shops
- Filter by: is_active, created_at, user
- Search by: name, location
- Edit shop details
- Manage shop status

### Stock Admin (Updated)
- Added shop column to list display
- Filter by shop
- Search includes shop name

### Sale Admin (Updated)
- Added shop column to list display
- Filter by shop
- Search includes shop name

### Expense Admin (Updated)
- Added shop column to list display
- Filter by shop
- Search includes shop name

---

## 🧪 Testing

### Test Creating a Shop

1. **Login to dashboard**
2. **Click "Add Shop"**
3. **Enter "Test Shop"**
4. **Click "Create"**
5. **Verify shop appears** in selector

### Test Switching Shops

1. **Create 2-3 shops**
2. **Add stocks to each shop**
3. **Click different shops**
4. **Verify stocks change** for each shop
5. **Verify data isolation** works

### Test Data Isolation

1. **Create Shop A and Shop B**
2. **Add 10 stocks to Shop A**
3. **Add 5 stocks to Shop B**
4. **Switch to Shop A** → Should see 10 stocks
5. **Switch to Shop B** → Should see 5 stocks
6. **Switch back to Shop A** → Should see 10 stocks again

---

## 📝 API Examples

### Create a Shop

```bash
curl -X POST http://localhost:8000/api/shops/ \
  -H "Content-Type: application/json" \
  -H "X-CSRFToken: <token>" \
  -d '{
    "name": "Downtown Store",
    "location": "Downtown"
  }'
```

**Response**:
```json
{
  "id": 1,
  "name": "Downtown Store",
  "location": "Downtown",
  "description": "",
  "is_active": true,
  "created_at": "2025-11-17T20:39:00Z",
  "updated_at": "2025-11-17T20:39:00Z"
}
```

### List All Shops

```bash
curl http://localhost:8000/api/shops/ \
  -H "Cookie: sessionid=<sessionid>"
```

**Response**:
```json
[
  {
    "id": 1,
    "name": "Downtown Store",
    "location": "Downtown",
    "description": "",
    "is_active": true,
    "created_at": "2025-11-17T20:39:00Z",
    "updated_at": "2025-11-17T20:39:00Z"
  },
  {
    "id": 2,
    "name": "Mall Store",
    "location": "Mall",
    "description": "",
    "is_active": false,
    "created_at": "2025-11-17T20:40:00Z",
    "updated_at": "2025-11-17T20:40:00Z"
  }
]
```

### Set Shop as Active

```bash
curl -X POST http://localhost:8000/api/shops/1/set_active/ \
  -H "X-CSRFToken: <token>" \
  -H "Cookie: sessionid=<sessionid>"
```

**Response**:
```json
{
  "status": "Shop activated",
  "shop": {
    "id": 1,
    "name": "Downtown Store",
    "location": "Downtown",
    "description": "",
    "is_active": true,
    "created_at": "2025-11-17T20:39:00Z",
    "updated_at": "2025-11-17T20:39:00Z"
  }
}
```

---

## 🎯 Next Steps

### Phase 2: Advanced Features
1. **Shop Settings** - Edit shop details
2. **Shop Analytics** - Per-shop reports
3. **Shop Comparison** - Compare shops side-by-side
4. **Shop Transfer** - Move stocks between shops
5. **Shop Deletion** - Archive/delete shops

### Phase 3: Enterprise Features
1. **Multi-user Shops** - Team members per shop
2. **Role-Based Access** - Manager, Staff roles
3. **Shop Permissions** - Control who can do what
4. **Audit Trail** - Track all shop changes
5. **Shop Backup** - Backup individual shops

---

## ✨ Summary

### What You Get

✅ **Multiple shops per user** - One account, many shops
✅ **Easy switching** - Click to change shops instantly
✅ **Data isolation** - Each shop's data separate
✅ **Professional UI** - Modern shop selector
✅ **Full API support** - Complete REST endpoints
✅ **Admin interface** - Manage shops in Django admin
✅ **Scalable design** - Ready for enterprise features

### Files Created/Modified

**Backend**:
- ✅ `sales/models.py` - Added Shop model
- ✅ `sales/serializers.py` - Added ShopSerializer
- ✅ `sales/views.py` - Added ShopViewSet
- ✅ `sales/urls.py` - Registered routes
- ✅ `sales/admin.py` - Added admin interfaces

**Frontend**:
- ✅ `frontend/src/components/ShopSelector.js` - New component
- ✅ `frontend/src/pages/Dashboard.js` - Integrated ShopSelector

---

## 🚀 Quick Start

```bash
# 1. Create migrations
python manage.py makemigrations

# 2. Apply migrations
python manage.py migrate

# 3. Restart Django
python manage.py runserver

# 4. Restart React (in another terminal)
cd frontend && npm start

# 5. Go to http://localhost:3000
# 6. Login and see Shop Selector at top of dashboard
# 7. Click "Add Shop" to create your first shop
# 8. Create multiple shops and switch between them!
```

---

## 📞 Support

For issues or questions:
1. Check Django console for backend errors
2. Check browser console (F12) for frontend errors
3. Check Network tab for API errors
4. Review Django admin at http://localhost:8000/admin

---

**Multi-Shop System Ready! 🎉**
