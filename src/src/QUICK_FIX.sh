#!/bin/bash

# ChoreCore - Quick Build Fix Script
# Run this if your build is failing

echo "🔧 ChoreCore Build Fix Script"
echo "=============================="
echo ""

# Step 1: Clean everything
echo "📦 Step 1: Cleaning old builds..."
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm -f package-lock.json
echo "✅ Cleaned!"
echo ""

# Step 2: Reinstall dependencies
echo "📥 Step 2: Installing fresh dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Step 3: Try building
echo "🔨 Step 3: Building project..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅ BUILD SUCCESSFUL! ✅ ✅ ✅"
    echo ""
    echo "Next steps:"
    echo "  1. Test dev server: npm run dev"
    echo "  2. Test preview: npm run preview"
    echo "  3. Build desktop app: pake http://localhost:4173 --config pakeplus.json"
    echo ""
else
    echo ""
    echo "❌ Build failed. Try these:"
    echo "  1. Check Node version: node --version (need 18+)"
    echo "  2. Check error message above"
    echo "  3. Read /FIX_BUILD.md for detailed solutions"
    echo ""
fi
