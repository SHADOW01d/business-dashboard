# 📱 Mobile Phone Setup Guide

## How to Access ProShop Dashboard from Your Phone

### Step 1: Find Your Computer's IP Address

**On Linux/Mac:**
```bash
ifconfig | grep "inet "
```
Look for an IP like `192.168.x.x` or `10.0.x.x`

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" like `192.168.x.x`

### Step 2: Update Frontend API URL

Edit `frontend/src/pages/Dashboard.js` and replace all instances of:
```javascript
http://localhost:8000
```

With your computer's IP (example):
```javascript
http://192.168.1.100:8000
```

**Quick Find & Replace:**
- Open `frontend/src/pages/Dashboard.js`
- Press `Ctrl+H` (or `Cmd+H` on Mac)
- Find: `http://localhost:8000`
- Replace All with: `http://YOUR_IP:8000`

### Step 3: Update Other Components

Do the same for these files:
- `frontend/src/components/StockForm.js`
- `frontend/src/components/SalesForm.js`
- `frontend/src/components/ExpenseForm.js`
- `frontend/src/components/ReportGenerator.js`

### Step 4: Start Backend (Allow Network Access)

```bash
python manage.py runserver 0.0.0.0:8000
```

This allows connections from any IP address on your network.

### Step 5: Start Frontend

```bash
npm start
```

### Step 6: Access from Phone

Open your phone's browser and go to:
```
http://192.168.1.100:3000
```

(Replace `192.168.1.100` with your actual computer IP)

---

## 🔧 Troubleshooting

### "Network Error" on Phone

1. **Check if both devices are on same WiFi**
   - Phone and computer must be on the same network

2. **Check firewall**
   - Make sure ports 3000 and 8000 are not blocked
   - Try disabling firewall temporarily for testing

3. **Verify IP Address**
   - Run `ifconfig` again to confirm IP
   - Test: `ping 192.168.1.100` from phone (if possible)

4. **Check Backend is Running**
   - Should see: `Starting development server at http://0.0.0.0:8000/`

5. **Check Frontend is Running**
   - Should see: `webpack compiled successfully`

### Still Getting "Network Error"?

Try this:
```bash
# Check if backend is accessible
curl http://192.168.1.100:8000/api/auth/current_user/
```

If you get a response, backend is working. Then check:
- Frontend API URL is correct
- Phone is on same WiFi
- No firewall blocking ports

---

## 📝 Example Setup

**Your Computer IP:** `192.168.1.100`

**Backend URL:** `http://192.168.1.100:8000`
**Frontend URL:** `http://192.168.1.100:3000`

**Phone Browser:** Open `http://192.168.1.100:3000`

---

## ✅ Quick Checklist

- [ ] Found computer IP address
- [ ] Updated all API URLs in frontend files
- [ ] Started backend with `0.0.0.0:8000`
- [ ] Started frontend with `npm start`
- [ ] Phone is on same WiFi as computer
- [ ] Firewall allows ports 3000 and 8000
- [ ] Opened `http://YOUR_IP:3000` on phone

---

## 🚀 Once Connected

Your phone will have full access to:
- ✅ Login/Register
- ✅ Add stocks
- ✅ Record sales
- ✅ Track expenses
- ✅ View dashboard
- ✅ Download PDF reports
- ✅ Search functionality
- ✅ Dark/Light mode

Enjoy managing your business from anywhere! 📊
