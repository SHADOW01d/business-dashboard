# ProShop - Business Dashboard & Inventory Management System

A modern, full-stack web application for managing business inventory, tracking sales, and analyzing business metrics in real-time.

![ProShop Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Django](https://img.shields.io/badge/Django-5.2-darkgreen)
![React](https://img.shields.io/badge/React-19.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Features

### Core Functionality
- **👤 User Authentication**: Secure registration and login system
- **📦 Stock Management**: Add, edit, and manage product inventory
- **💰 Sales Recording**: Track sales with real-time price adjustments
- **📊 Analytics Dashboard**: View income trends, sales metrics, and inventory overview
- **🌓 Dark/Light Mode**: Toggle between themes for comfortable viewing
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **RESTful API**: Complete REST API with Django REST Framework
- **Real-time Updates**: Instant data synchronization
- **Session Authentication**: Secure user sessions
- **CORS Support**: Cross-origin requests enabled
- **Admin Panel**: Django admin interface for data management

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Fastest Setup (One Command)

**Linux/Mac:**
```bash
cd /home/dreamer/business-dashboard
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
cd C:\path\to\business-dashboard
start.bat
```

### Manual Setup

**Backend:**
```bash
cd /home/dreamer/business-dashboard
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend (new terminal):**
```bash
cd /home/dreamer/business-dashboard/frontend
npm install
npm start
```

Access the app at: **http://localhost:3000**

## 📖 Usage Guide

### 1. Create Account
- Navigate to http://localhost:3000
- Click "Sign Up"
- Fill in your details and create account

### 2. Add Products
- Go to "My Stocks"
- Click "Add Stock"
- Enter product name, category, and price
- Click "Add Stock"

### 3. Record Sales
- Click "Record Sale" on any product
- Select quantity (+1, +5, +10 buttons)
- Optionally adjust price
- Click "Confirm Sale"

### 4. View Analytics
- Dashboard shows today's income, items sold, and trends
- Sales section displays all recorded transactions
- Track inventory and revenue in real-time

### 5. Toggle Theme
- Click Sun/Moon icon in sidebar to switch between dark and light modes

## 🏗️ Project Structure

```
business-dashboard/
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.js           # Login & Registration
│   │   │   └── Dashboard.js          # Main Dashboard
│   │   ├── components/
│   │   │   ├── StockForm.js          # Add Stock Component
│   │   │   └── SalesForm.js          # Record Sale Component
│   │   ├── App.js                    # Root Component
│   │   └── index.js                  # Entry Point
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── sales/                             # Django App
│   ├── models.py                     # Stock & Sale Models
│   ├── views.py                      # API ViewSets
│   ├── serializers.py                # DRF Serializers
│   ├── urls.py                       # API Routes
│   ├── admin.py                      # Admin Configuration
│   └── migrations/
│
├── config/                            # Django Configuration
│   ├── settings.py                   # Django Settings
│   ├── urls.py                       # URL Configuration
│   ├── wsgi.py                       # WSGI Config
│   └── asgi.py                       # ASGI Config
│
├── manage.py                          # Django Management
├── requirements.txt                   # Python Dependencies
├── SETUP.md                          # Detailed Setup Guide
├── QUICKSTART.md                     # Quick Start Guide
└── README.md                         # This File
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| GET | `/api/auth/current_user/` | Get current user info |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/` | List all user stocks |
| POST | `/api/stocks/` | Create new stock |
| GET | `/api/stocks/{id}/` | Get stock details |
| PUT | `/api/stocks/{id}/` | Update stock |
| DELETE | `/api/stocks/{id}/` | Delete stock |
| GET | `/api/stocks/summary/` | Get stock summary |

### Sales
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sales/` | List all user sales |
| POST | `/api/sales/` | Record new sale |
| GET | `/api/sales/{id}/` | Get sale details |
| GET | `/api/sales/daily_summary/` | Get today's sales summary |

## 💾 Database Models

### Stock Model
```python
{
  "id": int,
  "user": int,              # Foreign Key to User
  "name": str,              # Product name
  "category": str,          # Product category
  "price": decimal,         # Unit price
  "quantity_sold": int,     # Total items sold
  "created_at": datetime,   # Creation timestamp
  "updated_at": datetime    # Last update timestamp
}
```

### Sale Model
```python
{
  "id": int,
  "user": int,              # Foreign Key to User
  "stock": int,             # Foreign Key to Stock
  "quantity": int,          # Items sold
  "price_per_unit": decimal,# Price per unit
  "total_amount": decimal,  # Total sale amount
  "created_at": datetime    # Sale timestamp
}
```

## 🛠️ Technology Stack

### Frontend
- **React 19.2** - UI Framework
- **Recharts 3.3** - Data Visualization
- **Lucide React 0.546** - Icon Library
- **CSS-in-JS** - Inline styling

### Backend
- **Django 5.2** - Web Framework
- **Django REST Framework 3.14** - REST API
- **Django CORS Headers 4.3** - CORS Support
- **SQLite** - Database (Development)

### Tools & Services
- **npm** - Package Manager
- **pip** - Python Package Manager
- **Git** - Version Control

## 🔐 Security Features

- ✅ Password hashing with Django's authentication
- ✅ CSRF protection
- ✅ Session-based authentication
- ✅ CORS validation
- ✅ Input validation and sanitization
- ✅ User isolation (users only see their own data)

## 📊 Dashboard Analytics

The dashboard provides real-time insights:
- **Today's Income**: Total sales amount for the current day
- **Items Sold**: Total quantity of items sold
- **Average Price**: Average price across all products
- **Active Products**: Number of products in inventory
- **Income & Profit Trends**: 7-day trend visualization
- **Stock Overview**: Summary of inventory status

## 🎨 Theme System

### Dark Mode (Default)
- Deep blue and purple gradients
- Easy on the eyes for extended use
- Professional appearance

### Light Mode
- Soft pastels and light backgrounds
- Bright and clean interface
- Accessible for daytime use

Toggle between themes with the Sun/Moon button in the sidebar.

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Ensure Django is running
python manage.py runserver

# Check CORS settings in config/settings.py
# Verify django-cors-headers is installed
pip install django-cors-headers
```

### Database Errors
```bash
# Reset database
rm db.sqlite3
python manage.py migrate
```

### Port Already in Use
```bash
# Django on different port
python manage.py runserver 8001

# React on different port
PORT=3001 npm start
```

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
cd frontend && npm install
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in minutes
- **[SETUP.md](SETUP.md)** - Detailed setup and configuration
- **[API Documentation](#-api-endpoints)** - API reference above

## 🚀 Deployment

### Production Checklist
- [ ] Set `DEBUG = False` in `config/settings.py`
- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Set proper `ALLOWED_HOSTS`
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up proper logging
- [ ] Configure static files serving
- [ ] Set up database backups

### Deployment Platforms
- Heroku
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- PythonAnywhere
- Vercel (Frontend only)
- Netlify (Frontend only)

## 🔮 Future Enhancements

- [ ] Export reports to PDF/Excel
- [ ] Inventory alerts and notifications
- [ ] Multi-user team management
- [ ] Advanced analytics and forecasting
- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Barcode scanning
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced search and filtering

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues, questions, or suggestions:
1. Check the documentation files
2. Review the code comments
3. Check existing issues
4. Create a new issue with detailed information

## 👨‍💻 Author

Created with ❤️ for business owners and entrepreneurs

---

## 📞 Quick Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **API Documentation**: See [API Endpoints](#-api-endpoints) section

---

**ProShop - Manage Your Business, Grow Your Sales! 🚀**

Last Updated: November 2024
