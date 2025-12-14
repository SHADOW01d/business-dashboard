# CRA to Vite Migration Guide - Step by Step

## Overview
This guide walks you through migrating your Create React App (CRA) project to Vite. Vite is faster, lighter, and has better developer experience.

### Benefits of Vite
- ⚡ **Instant server start** - No bundling on startup
- 🔥 **Lightning-fast HMR** - Hot Module Replacement is instant
- 📦 **Smaller bundle** - Better tree-shaking and code splitting
- 🎯 **Native ES modules** - Uses browser's native module support
- 🚀 **Faster builds** - Optimized production builds
- 🔧 **Simpler config** - Minimal configuration needed

---

## Step 1: Backup Your Project

Before starting, create a backup:
```bash
cd /home/dreamer/business-dashboard
git add .
git commit -m "Backup before Vite migration"
```

---

## Step 2: Update package.json

Remove CRA dependencies and add Vite dependencies.

**Current CRA dependencies to remove:**
- react-scripts
- @testing-library/* (optional - can keep for testing)
- web-vitals
- reportWebVitals

**New Vite dependencies to add:**
- vite
- @vitejs/plugin-react
- @vitejs/plugin-legacy (optional - for older browser support)

---

## Step 3: Create vite.config.js

Create a new configuration file at the root of the frontend directory.

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

---

## Step 4: Create index.html in Root

Move and update `public/index.html` to `index.html` at the root of frontend directory.

**Key changes:**
- Replace `%PUBLIC_URL%` with `/`
- Add `<script type="module" src="/src/main.jsx"></script>` in body
- Remove manifest.json reference (optional)

---

## Step 5: Create main.jsx Entry Point

Create `src/main.jsx` to replace `src/index.js`.

This is the new entry point for Vite.

---

## Step 6: Update App.js

Rename `src/App.js` to `src/App.jsx` for consistency.

No code changes needed - just the file extension.

---

## Step 7: Update Other Components

Rename all component files from `.js` to `.jsx`:
- `src/pages/*.js` → `src/pages/*.jsx`
- `src/components/*.js` → `src/components/*.jsx`

---

## Step 8: Create .env Files

Create environment files for API configuration:
- `.env.development` - Development API URL
- `.env.production` - Production API URL

---

## Step 9: Update .gitignore

Add Vite-specific entries:
```
dist/
.env.local
.env.*.local
```

---

## Step 10: Remove CRA-Specific Files

Delete these files (no longer needed):
- `public/manifest.json` (optional)
- `public/robots.txt` (optional)
- `src/reportWebVitals.js`
- `src/setupTests.js`
- `src/App.test.js`
- `.env.example` (update with new format)

---

## Step 11: Install Dependencies

```bash
cd /home/dreamer/business-dashboard/frontend
npm install
```

---

## Step 12: Update npm Scripts

Your `package.json` scripts should now be:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Step 13: Test the Migration

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in browser
# Test all features work correctly
```

---

## Step 14: Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

---

## Troubleshooting

### Issue: Module not found errors
**Solution:** Ensure all imports use correct file extensions (`.jsx` for components)

### Issue: API calls failing
**Solution:** Check `vite.config.js` proxy configuration and `.env` files

### Issue: CSS not loading
**Solution:** Ensure CSS imports are at the top of files

### Issue: Images not loading
**Solution:** Use `import` for images or reference them from `public/` folder

---

## File Structure After Migration

```
frontend/
├── index.html                 # NEW: Root HTML file
├── vite.config.js             # NEW: Vite config
├── main.jsx                   # NEW: Entry point
├── package.json               # UPDATED
├── .env.development           # NEW: Dev environment
├── .env.production            # NEW: Prod environment
├── src/
│   ├── main.jsx               # NEW: Entry point
│   ├── App.jsx                # RENAMED: App.js → App.jsx
│   ├── index.css
│   ├── App.css
│   ├── config.js
│   ├── translations.js
│   ├── pages/
│   │   ├── Dashboard.jsx      # RENAMED
│   │   ├── AuthPage.jsx       # RENAMED
│   │   └── SettingsPage.jsx   # RENAMED
│   └── components/
│       ├── Navbar.jsx         # RENAMED
│       ├── Sidebar.jsx        # RENAMED
│       └── ... (all .jsx)
├── public/
│   ├── favicon.ico
│   └── ... (static assets)
└── dist/                      # NEW: Build output
```

---

## Key Differences: CRA vs Vite

| Feature | CRA | Vite |
|---------|-----|------|
| Dev Server Start | Slow (bundles first) | Instant |
| HMR Speed | Slow | Lightning fast |
| Config | Complex | Simple |
| Bundle Size | Larger | Smaller |
| Build Time | Slower | Faster |
| Entry Point | index.js | main.jsx |
| HTML | public/index.html | index.html (root) |
| Environment Vars | .env | .env.* files |

---

## Environment Variables

### CRA Style (OLD)
```
REACT_APP_API_URL=http://localhost:8000
```

### Vite Style (NEW)
```
VITE_API_URL=http://localhost:8000
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## API Proxy Configuration

Vite's proxy in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true
    }
  }
}
```

This automatically proxies all `/api/*` requests to your Django backend.

---

## Testing After Migration

### Checklist
- [ ] Dev server starts with `npm run dev`
- [ ] Page loads at http://localhost:3000
- [ ] Dark/Light mode toggle works
- [ ] Login/Register works
- [ ] API calls succeed (check Network tab)
- [ ] Stock management works
- [ ] Sales recording works
- [ ] Charts display correctly
- [ ] PDF generation works
- [ ] No console errors

---

## Rollback Plan

If something goes wrong:
```bash
git reset --hard HEAD~1
npm install
npm start
```

---

## Performance Comparison

### Before (CRA)
- Dev server startup: ~5-10 seconds
- HMR: ~2-3 seconds
- Build time: ~60-90 seconds

### After (Vite)
- Dev server startup: ~500ms
- HMR: ~100-200ms
- Build time: ~20-30 seconds

---

## Next Steps

1. Follow the step-by-step instructions below
2. Test thoroughly in development
3. Build for production
4. Deploy to your server
5. Monitor for any issues

---

## Complete Step-by-Step Execution

See the sections below for detailed implementation of each step.

