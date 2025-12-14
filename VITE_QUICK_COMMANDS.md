# Vite Migration - Quick Commands Reference

## 🚀 Start Development

```bash
cd /home/dreamer/business-dashboard/frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 123 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**Open in browser:** http://localhost:3000

---

## 🏗️ Build for Production

```bash
npm run build
```

**Output:** Creates `dist/` folder with optimized files

---

## 👁️ Preview Production Build

```bash
npm run preview
```

**Opens:** http://localhost:3000 with production build

---

## 🧪 Run Tests

```bash
npm test
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🧹 Clean Install

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔍 Check Vite Version

```bash
npm list vite
```

---

## 📊 Check All Dependencies

```bash
npm list --depth=0
```

---

## 🔐 Check for Vulnerabilities

```bash
npm audit
```

---

## 🛠️ Fix Vulnerabilities

```bash
npm audit fix
```

---

## 📝 Update Dependencies

```bash
npm update
```

---

## 🗑️ Remove Unused Dependencies

```bash
npm prune
```

---

## 🔄 Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then run:
npm run dev
```

---

## 📂 Project Structure

```
/home/dreamer/business-dashboard/
├── frontend/
│   ├── index.html              # Root HTML
│   ├── vite.config.js          # Vite config
│   ├── package.json            # Dependencies
│   ├── .env.development        # Dev environment
│   ├── .env.production         # Prod environment
│   ├── src/
│   │   ├── main.jsx            # Entry point
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   ├── public/                 # Static assets
│   └── dist/                   # Build output
└── ...
```

---

## 🌐 Access Points

| Service | URL | Port |
|---------|-----|------|
| **Frontend (Dev)** | http://localhost:3000 | 3000 |
| **Frontend (Preview)** | http://localhost:3000 | 3000 |
| **Backend (Django)** | http://localhost:8000 | 8000 |
| **Django Admin** | http://localhost:8000/admin | 8000 |

---

## 🔧 Environment Variables

### Development (.env.development)
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=ProShop Dashboard
```

### Production (.env.production)
```
VITE_API_URL=https://yourdomain.com
VITE_APP_NAME=ProShop Dashboard
```

### Access in Code
```javascript
import.meta.env.VITE_API_URL
import.meta.env.VITE_APP_NAME
```

---

## 📋 Common Tasks

### Start Everything
```bash
# Terminal 1: Backend
cd /home/dreamer/business-dashboard
python manage.py runserver

# Terminal 2: Frontend
cd /home/dreamer/business-dashboard/frontend
npm run dev
```

### Build & Deploy
```bash
cd /home/dreamer/business-dashboard/frontend
npm run build
# Copy dist/ folder to server
```

### Clear Cache
```bash
# Browser cache
# DevTools → Application → Clear site data

# npm cache
npm cache clean --force
```

### Update All Dependencies
```bash
npm update
npm audit fix
```

---

## 🐛 Debugging

### Check Console
```
F12 → Console tab
Look for errors and warnings
```

### Check Network
```
F12 → Network tab
Check API calls to /api/*
Status should be 200 (success)
```

### Check HMR
```
Edit a component file
Save the file
Browser should update instantly
```

### Check Build
```
npm run build
Check dist/ folder exists
Check file sizes are reasonable
```

---

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build
```

### Create Production Build Archive
```bash
cd dist
tar -czf ../proshop-dashboard.tar.gz .
cd ..
```

### Deploy to Server
```bash
# Copy dist folder to server
scp -r dist/ user@server:/var/www/proshop/

# Or use rsync
rsync -avz dist/ user@server:/var/www/proshop/
```

---

## 🔄 Git Commands

### Commit Migration
```bash
git add .
git commit -m "Migrate from CRA to Vite"
```

### Create Backup Branch
```bash
git branch backup-cra
git checkout main
```

### Rollback if Needed
```bash
git reset --hard HEAD~1
npm install
npm start
```

---

## 📊 Performance Checks

### Check Bundle Size
```bash
npm run build
# Check dist/ folder size
du -sh dist/
```

### Check Build Time
```bash
time npm run build
```

### Check Dev Server Speed
```bash
time npm run dev
# Should start in < 1 second
```

---

## 🔐 Security Checks

### Check Dependencies
```bash
npm audit
```

### Check for Outdated Packages
```bash
npm outdated
```

### Check for Vulnerabilities
```bash
npm audit --audit-level=moderate
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `VITE_MIGRATION_GUIDE.md` | Detailed step-by-step guide |
| `VITE_MIGRATION_TESTING.md` | Comprehensive testing checklist |
| `VITE_QUICK_START.md` | 5-minute quick start |
| `VITE_MIGRATION_SUMMARY.md` | Complete summary |
| `VITE_BEFORE_AFTER.md` | Before/after comparison |
| `VITE_QUICK_COMMANDS.md` | This file |

---

## 💡 Tips

### Faster Development
```bash
# Use npm run dev for instant HMR
npm run dev

# Edit files and see changes instantly
# No page refresh needed!
```

### Better Performance
```bash
# Vite automatically optimizes imports
# Code splitting happens automatically
# Lazy loading works out of the box
```

### Debugging
```bash
# Use browser DevTools as usual
# Source maps available in development
# Console logging works normally
```

---

## 🆘 Quick Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### Clear npm Cache
```bash
npm cache clean --force
npm install
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Node Version
```bash
node --version
# Should be 14.0.0 or higher
```

### Check npm Version
```bash
npm --version
# Should be 6.0.0 or higher
```

---

## 📞 Getting Help

### Check Vite Docs
```
https://vitejs.dev/
```

### Check React Plugin Docs
```
https://github.com/vitejs/vite-plugin-react
```

### Check Config Reference
```
https://vitejs.dev/config/
```

---

## ✨ Success Indicators

You'll know everything is working when:

✅ Dev server starts in < 1 second
✅ Page loads at http://localhost:3000
✅ No console errors (F12)
✅ HMR updates instantly
✅ API calls work (Network tab)
✅ Dark/Light mode works
✅ All features work
✅ Build completes in < 30 seconds

---

## 🎯 Next Steps

1. **Run dev server**: `npm run dev`
2. **Test features**: Verify everything works
3. **Build for production**: `npm run build`
4. **Deploy**: Copy dist/ to server
5. **Monitor**: Watch for any issues

---

## 📝 Cheat Sheet

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Install dependencies
npm install

# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check versions
npm list vite
npm list react

# Clear cache
npm cache clean --force

# Reinstall everything
rm -rf node_modules package-lock.json && npm install
```

---

## 🚀 You're All Set!

Your ProShop Business Dashboard is now running on Vite!

**Next Action:** Run `npm run dev` and enjoy the speed! ⚡

