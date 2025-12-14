#!/bin/bash

# CRA to Vite Migration - Automated Commands
# This script performs all the necessary file operations for migration

cd /home/dreamer/business-dashboard/frontend

echo "🚀 Starting CRA to Vite Migration..."
echo ""

# Step 1: Rename App.js to App.jsx
echo "📝 Step 1: Renaming component files to .jsx..."
mv src/App.js src/App.jsx 2>/dev/null || echo "✓ App.jsx already exists"

# Step 2: Rename pages
echo "📝 Step 2: Renaming page files..."
for file in src/pages/*.js; do
  if [ -f "$file" ]; then
    newfile="${file%.js}.jsx"
    mv "$file" "$newfile" 2>/dev/null && echo "  ✓ Renamed $(basename $file) → $(basename $newfile)"
  fi
done

# Step 3: Rename components
echo "📝 Step 3: Renaming component files..."
for file in src/components/*.js; do
  if [ -f "$file" ]; then
    newfile="${file%.js}.jsx"
    mv "$file" "$newfile" 2>/dev/null && echo "  ✓ Renamed $(basename $file) → $(basename $newfile)"
  fi
done

# Step 4: Remove CRA-specific files (optional)
echo "📝 Step 4: Removing CRA-specific files..."
rm -f src/reportWebVitals.js && echo "  ✓ Removed reportWebVitals.js"
rm -f src/setupTests.js && echo "  ✓ Removed setupTests.js"
rm -f src/App.test.js && echo "  ✓ Removed App.test.js"
rm -f src/index.js && echo "  ✓ Removed index.js (replaced with main.jsx)"

# Step 5: Update .gitignore
echo "📝 Step 5: Updating .gitignore..."
if ! grep -q "dist/" .gitignore; then
  echo "" >> .gitignore
  echo "# Vite" >> .gitignore
  echo "dist/" >> .gitignore
  echo ".env.local" >> .gitignore
  echo ".env.*.local" >> .gitignore
  echo "  ✓ Updated .gitignore"
fi

# Step 6: Install dependencies
echo ""
echo "📦 Step 6: Installing dependencies..."
echo "  Running: npm install"
npm install

echo ""
echo "✅ Migration Complete!"
echo ""
echo "📋 Summary of changes:"
echo "  ✓ package.json updated (removed react-scripts, added vite)"
echo "  ✓ vite.config.js created"
echo "  ✓ index.html created in root"
echo "  ✓ src/main.jsx created (new entry point)"
echo "  ✓ src/App.jsx created (renamed from App.js)"
echo "  ✓ All component files renamed to .jsx"
echo "  ✓ All page files renamed to .jsx"
echo "  ✓ CRA-specific files removed"
echo "  ✓ .env files created"
echo "  ✓ Dependencies installed"
echo ""
echo "🚀 Next steps:"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:3000"
echo "  3. Test all features"
echo ""
