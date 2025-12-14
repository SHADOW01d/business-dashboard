# ProShop - Quick Start Guide

Get your business dashboard running in minutes!

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## One-Command Setup (Linux/Mac)

```bash
cd /home/dreamer/business-dashboard
chmod +x start.sh
./start.sh
```

## One-Command Setup (Windows)

```bash
cd C:\path\to\business-dashboard
start.bat
```

## Manual Setup

### Step 1: Backend Setup (Django)

```bash
# Navigate to project root
cd /home/dreamer/business-dashboard

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

Backend will be available at: **http://localhost:8000**

### Step 2: Frontend Setup (React)

In a **new terminal window**:

```bash
# Navigate to frontend
cd /home/dreamer/business-dashboard/frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will be available at: **http://localhost:3000**

## First Time Usage

### 1. Create an Account

1. Open http://localhost:3000 in your browser
2. Click **"Sign Up"**
3. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Username
   - Password (min 6 characters)
4. Click **"Create Account"**

### 2. Add Your First Product

1. Go to **"My Stocks"** section
2. Click **"Add Stock"** button
3. Enter:
   - **Product Name**: e.g., "T-Shirts"
   - **Category**: e.g., "Clothing"
   - **Price**: e.g., "2500"
4. Click **"Add Stock"**

### 3. Record Your First Sale

1. In **"My Stocks"**, find your product
2. Click **"Record Sale"**
3. Select quantity using **+1, +5, +10** buttons
4. (Optional) Adjust the total price if needed
5. Click **"Confirm Sale"**

### 4. View Your Dashboard

1. Go to **"Dashboard"** to see:
   - Today's income
   - Items sold
   - Average price
   - Income & profit trends
   - Stock overview

### 5. Toggle Dark/Light Mode

- Click the **Sun/Moon icon** in the sidebar to switch themes

## API Testing (Optional)

### Using cURL

```bash
# Register
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

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'

# Add Stock
curl -X POST http://localhost:8000/api/stocks/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Shirts",
    "category": "Clothing",
    "price": "2500"
  }'

# Get Stocks
curl http://localhost:8000/api/stocks/ -b cookies.txt

# Record Sale
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

## Django Admin Panel

Access the admin panel at: **http://localhost:8000/admin**

1. Create a superuser first:
```bash
python manage.py createsuperuser
```

2. Login with your superuser credentials
3. Manage stocks and sales directly

## Troubleshooting

### Port Already in Use

**Django (8000):**
```bash
python manage.py runserver 8001
```

**React (3000):**
```bash
PORT=3001 npm start
```

### Database Issues

```bash
# Reset database
rm db.sqlite3
python manage.py migrate
```

### Module Not Found

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### CORS Errors

Ensure Django server is running and check `config/settings.py` CORS settings.

## File Structure

```
business-dashboard/
├── frontend/                    # React app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.js     # Login/Register
│   │   │   └── Dashboard.js    # Main dashboard
│   │   ├── components/
│   │   │   ├── StockForm.js    # Add stock
│   │   │   └── SalesForm.js    # Record sale
│   │   └── App.js              # Root component
│   └── package.json
├── sales/                       # Django app
│   ├── models.py               # Stock, Sale models
│   ├── views.py                # API endpoints
│   ├── serializers.py          # Data serialization
│   ├── urls.py                 # API routes
│   └── admin.py                # Admin interface
├── config/                      # Django config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py                    # Django CLI
├── requirements.txt             # Python packages
├── start.sh                     # Linux/Mac startup
├── start.bat                    # Windows startup
├── SETUP.md                     # Full setup guide
└── QUICKSTART.md               # This file
```

## Key Features

✅ **User Authentication**
- Secure registration and login
- Session-based authentication
- User profile management

✅ **Stock Management**
- Add unlimited products
- Categorize items
- Track quantity sold
- Update prices

✅ **Sales Recording**
- Quick sale entry
- Adjust prices on the fly
- Real-time quantity updates
- Timestamp tracking

✅ **Analytics Dashboard**
- Today's income
- Items sold metrics
- Average price calculation
- Income & profit trends
- Stock overview

✅ **Theme Support**
- Dark mode (default)
- Light mode
- One-click toggle

## Next Steps

1. **Customize**: Modify colors and branding in component files
2. **Deploy**: Follow deployment guides for production
3. **Extend**: Add more features like reports, inventory alerts, etc.

## Support

For detailed information, see `SETUP.md`

---

**Happy selling! 🚀**
