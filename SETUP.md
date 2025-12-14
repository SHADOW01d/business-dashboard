# ProShop - Business Dashboard Setup Guide

A modern business inventory and sales management system with user authentication, real-time stock tracking, and sales recording.

## Features

✅ **User Registration & Authentication** - Secure user signup and login
✅ **Stock Management** - Add, edit, and manage your product inventory
✅ **Real-time Sales Recording** - Track sales with automatic price adjustments
✅ **Dark/Light Mode** - Toggle between dark and light themes
✅ **Dashboard Analytics** - View income trends, sales metrics, and inventory overview
✅ **Responsive Design** - Works on desktop and mobile devices

## Project Structure

```
business-dashboard/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthPage.js      # Login/Registration
│   │   │   └── Dashboard.js     # Main dashboard
│   │   ├── components/
│   │   │   ├── StockForm.js     # Add stock form
│   │   │   └── SalesForm.js     # Record sales form
│   │   └── App.js               # Main app component
│   └── package.json
├── sales/                    # Django app
│   ├── models.py            # Stock and Sale models
│   ├── views.py             # API views
│   ├── serializers.py       # DRF serializers
│   └── urls.py              # API routes
├── config/                   # Django settings
│   ├── settings.py
│   └── urls.py
├── manage.py                 # Django management
└── requirements.txt          # Python dependencies
```

## Backend Setup (Django)

### 1. Create Virtual Environment
```bash
cd /home/dreamer/business-dashboard
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 5. Start Django Server
```bash
python manage.py runserver
```

The backend will run on `http://localhost:8000`

## Frontend Setup (React)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start React Development Server
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/current_user/` - Get current user info

### Stocks
- `GET /api/stocks/` - List all user stocks
- `POST /api/stocks/` - Create new stock
- `GET /api/stocks/{id}/` - Get stock details
- `PUT /api/stocks/{id}/` - Update stock
- `DELETE /api/stocks/{id}/` - Delete stock
- `GET /api/stocks/summary/` - Get stock summary

### Sales
- `GET /api/sales/` - List all user sales
- `POST /api/sales/` - Record new sale
- `GET /api/sales/{id}/` - Get sale details
- `GET /api/sales/daily_summary/` - Get today's sales summary

## Usage

### 1. Register/Login
- Open `http://localhost:3000`
- Click "Sign Up" to create a new account
- Or login with existing credentials

### 2. Add Stocks
- Go to "My Stocks" section
- Click "Add Stock" button
- Fill in product name, category, and price
- Click "Add Stock"

### 3. Record Sales
- In "My Stocks", click "Record Sale" on any product
- Select quantity using +1, +5, +10 buttons
- Optionally adjust the total price
- Click "Confirm Sale"

### 4. View Analytics
- Dashboard shows today's income, items sold, and trends
- Sales section displays all recorded sales with timestamps

### 5. Toggle Theme
- Use the Sun/Moon icon in the sidebar to switch between dark and light modes

## Database Models

### Stock Model
```python
- id: Auto-generated ID
- user: Foreign key to User
- name: Product name
- category: Product category
- price: Unit price (Decimal)
- quantity_sold: Total items sold (Integer)
- created_at: Creation timestamp
- updated_at: Last update timestamp
```

### Sale Model
```python
- id: Auto-generated ID
- user: Foreign key to User
- stock: Foreign key to Stock
- quantity: Items sold (Integer)
- price_per_unit: Price per unit (Decimal)
- total_amount: Total sale amount (Decimal)
- created_at: Sale timestamp
```

## Troubleshooting

### Backend not connecting
- Ensure Django server is running on `http://localhost:8000`
- Check CORS settings in `config/settings.py`
- Verify `django-cors-headers` is installed

### Database errors
- Run `python manage.py migrate` to apply migrations
- Delete `db.sqlite3` and run migrations again if issues persist

### Frontend not loading
- Ensure React server is running on `http://localhost:3000`
- Clear browser cache and reload
- Check browser console for errors

## Security Notes

⚠️ **Development Only** - This setup is for development. For production:
- Change `DEBUG = False` in settings.py
- Use environment variables for sensitive data
- Set proper `ALLOWED_HOSTS`
- Use HTTPS
- Set strong `SECRET_KEY`

## Future Enhancements

- [ ] Export reports to PDF/Excel
- [ ] Inventory alerts and notifications
- [ ] Multi-user team management
- [ ] Advanced analytics and forecasting
- [ ] Mobile app
- [ ] Payment integration

## Support

For issues or questions, check the code comments or review the API endpoints documentation.

---

**Happy selling! 🛍️**
