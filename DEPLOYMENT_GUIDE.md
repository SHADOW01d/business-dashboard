# Deployment Guide - ProShop Dashboard v2.1.0

## 🚀 Quick Deployment

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Python 3.8+, Node.js 16+
- Git access to repository

### Deployment Steps

#### Step 1: Pull Latest Code
```bash
cd /home/dreamer/business-dashboard
git pull origin main
```

#### Step 2: Install Dependencies
```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

#### Step 3: Run Migrations (if any)
```bash
python manage.py migrate
```

#### Step 4: Restart Servers
```bash
# Terminal 1: Backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm start
```

#### Step 5: Clear Browser Cache
- Open DevTools (F12)
- Go to Application tab
- Click "Clear Site Data"
- Or press Ctrl+Shift+Delete

#### Step 6: Verify Deployment
```bash
# Run tests
python manage.py test tests/

# Expected: 12 tests passing ✅
```

---

## 📋 Pre-Deployment Checklist

- [ ] All code changes reviewed
- [ ] Tests passing locally
- [ ] No console errors
- [ ] No network errors
- [ ] Database backed up
- [ ] Deployment plan documented
- [ ] Rollback plan ready
- [ ] Team notified

---

## 🔄 Rollback Plan

If issues occur after deployment:

### Option 1: Revert Code
```bash
git revert HEAD
git push origin main
```

### Option 2: Restore Database
```bash
# If database backup exists
python manage.py dbshell < backup.sql
```

### Option 3: Clear Cache
```bash
# Clear Django cache
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()
```

---

## 🧪 Post-Deployment Testing

### 1. Verify Auth Flow
```bash
# Test login/logout
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"dreamer","password":"your_password"}' \
  -c cookies.txt

# Test current user
curl -X GET http://localhost:8000/api/auth/current_user/ \
  -b cookies.txt

# Test logout
curl -X POST http://localhost:8000/api/auth/logout/ \
  -b cookies.txt
```

### 2. Verify Stock Alerts
```bash
curl -X GET http://localhost:8000/api/sales/low_stock_alerts/ \
  -b cookies.txt
```

### 3. Verify Settings
```bash
curl -X GET http://localhost:8000/api/auth/settings/my_settings/ \
  -b cookies.txt
```

### 4. Manual UI Testing
- [ ] Login page appears on first load
- [ ] Login works with valid credentials
- [ ] Dashboard loads after login
- [ ] Navbar buttons visible and clickable
- [ ] Dark/Light mode toggle works
- [ ] Stock alerts load without error
- [ ] Settings page loads
- [ ] Logout works
- [ ] Can login again after logout

---

## 📊 Monitoring

### Key Metrics to Monitor
- Server response time (should be < 500ms)
- Error rate (should be 0%)
- User login success rate (should be 100%)
- API endpoint availability (should be 100%)

### Logs to Check
```bash
# Django logs
tail -f backend.log

# Frontend console
# Open DevTools (F12) → Console tab
```

### Common Issues

#### Issue: "CSRF token error"
```bash
# Solution: Restart Django server
python manage.py runserver
```

#### Issue: "Dashboard loads without login"
```bash
# Solution: Clear browser cookies
# DevTools → Application → Cookies → Delete all
```

#### Issue: "Stock alerts not loading"
```bash
# Solution: Check if endpoint is registered
python manage.py shell
>>> from django.urls import get_resolver
>>> resolver = get_resolver()
>>> print(resolver.url_patterns)
# Should see /api/sales/low_stock_alerts/
```

---

## 🔐 Security Checklist

- [ ] CSRF protection enabled
- [ ] Session cookies secure
- [ ] HTTPS enforced (production)
- [ ] No sensitive data in logs
- [ ] Authentication required for protected endpoints
- [ ] Input validation in place
- [ ] SQL injection prevention active
- [ ] XSS prevention active

---

## 📈 Performance Checklist

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] Static files cached
- [ ] Images optimized

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ All tests pass
- ✅ No console errors
- ✅ No network errors (401, 403, 404)
- ✅ Auth flow works correctly
- ✅ Navbar buttons visible and clickable
- ✅ Stock alerts load without error
- ✅ Settings page loads
- ✅ Complete workflow succeeds
- ✅ Performance is acceptable
- ✅ No security issues

---

## 📞 Support

If issues occur:
1. Check logs (Django console)
2. Check browser console (DevTools F12)
3. Check network tab (DevTools Network)
4. Run tests to identify issues
5. Contact development team

---

## 📅 Deployment Schedule

- **Development:** November 19, 2025
- **Testing:** November 19, 2025
- **Staging:** November 20, 2025
- **Production:** November 21, 2025

---

## 👥 Deployment Team

- Backend Developer: [Name]
- Frontend Developer: [Name]
- QA Tester: [Name]
- DevOps: [Name]

---

## 📝 Deployment Notes

- No database migrations required
- No environment variable changes needed
- No new dependencies added
- Backward compatible with v2.0.0
- No breaking changes

---

