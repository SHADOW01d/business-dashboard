# ProShop - Quick Reference Card

## 🚀 Start the Application

### Linux/Mac
```bash
cd /home/dreamer/business-dashboard
chmod +x start.sh
./start.sh
```

### Windows
```bash
cd C:\path\to\business-dashboard
start.bat
```

### Manual (Any OS)
```bash
# Terminal 1 - Backend
cd /home/dreamer/business-dashboard
python3 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2 - Frontend
cd /home/dreamer/business-dashboard/frontend
npm install
npm start
```

## 📍 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin |

## 🔑 First Time Setup

1. **Register Account**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in details and create account

2. **Add Product**
   - Go to "My Stocks"
   - Click "Add Stock"
   - Enter name, category, price
   - Click "Add Stock"

3. **Record Sale**
   - Click "Record Sale" on product
   - Select quantity
   - Click "Confirm Sale"

4. **View Dashboard**
   - Click "Dashboard"
   - See analytics and metrics

## 🎨 Toggle Theme

Click the **Sun/Moon icon** in the sidebar to switch between dark and light modes.

## 📊 Dashboard Sections

| Section | Purpose |
|---------|---------|
| Dashboard | View analytics and metrics |
| My Stocks | Manage products and inventory |
| Sales | View sales history |
| Settings | Account settings (coming soon) |

## 🔌 API Quick Reference

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass123","password_confirm":"pass123","email":"user@example.com"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username":"user","password":"pass123"}'
```

### Add Stock
```bash
curl -X POST http://localhost:8000/api/stocks/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Product","category":"Category","price":"1000"}'
```

### Record Sale
```bash
curl -X POST http://localhost:8000/api/sales/ \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"stock":1,"quantity":5,"price_per_unit":"1000","total_amount":"5000"}'
```

### Get Stocks
```bash
curl http://localhost:8000/api/stocks/ -b cookies.txt
```

### Get Sales
```bash
curl http://localhost:8000/api/sales/ -b cookies.txt
```

## 🗂️ Project Structure

```
business-dashboard/
├── frontend/          # React app
├── sales/             # Django app
├── config/            # Django config
├── manage.py          # Django CLI
├── requirements.txt   # Python packages
├── start.sh          # Linux/Mac startup
├── start.bat         # Windows startup
└── README.md         # Documentation
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | `python manage.py runserver 8001` |
| Port 3000 in use | `PORT=3001 npm start` |
| Database error | `python manage.py migrate` |
| Module not found | `pip install -r requirements.txt` |
| CORS error | Check `config/settings.py` |
| Can't connect | Ensure both servers are running |

## 📚 Documentation Files

- `README.md` - Full documentation
- `QUICKSTART.md` - Get started quickly
- `SETUP.md` - Detailed setup guide
- `TESTING.md` - Testing procedures
- `PROJECT_SUMMARY.md` - Project overview

## 🔐 Admin Access

1. Create superuser:
```bash
python manage.py createsuperuser
```

2. Login at http://localhost:8000/admin

3. Manage stocks and sales directly

## 💡 Tips & Tricks

- Use **+1, +5, +10** buttons for quick quantity entry
- Adjust price on sales for discounts or special pricing
- Toggle dark mode for comfortable viewing
- Check dashboard for real-time metrics
- Use admin panel for bulk operations

## 🚀 Next Steps

1. Add your products
2. Record your first sale
3. Check the dashboard
4. Explore all features
5. Customize as needed

## 📞 Need Help?

- Check `README.md` for full documentation
- See `TESTING.md` for testing procedures
- Review `SETUP.md` for configuration
- Check browser console for errors
- Verify both servers are running

---

**ProShop - Manage Your Business, Grow Your Sales! 🎉**
