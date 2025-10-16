# ChoreCore - Cleanup & Restructure Script

Run these commands to restructure your project for PakePlus.

## 🚀 Quick Cleanup (Copy & Paste)

### Step 1: Create New Folders

```bash
mkdir -p src
mkdir -p public
mkdir -p _archive
```

### Step 2: Move Source Files to src/

```bash
# Move main files
mv App.tsx src/ 2>/dev/null || true
mv main.tsx src/ 2>/dev/null || true

# Move directories
mv components src/ 2>/dev/null || true
mv contexts src/ 2>/dev/null || true
mv utils src/ 2>/dev/null || true
mv styles src/ 2>/dev/null || true
```

### Step 3: Archive Old Documentation

```bash
# Archive all old markdown files
mv ADMIN_ACCESS.md _archive/ 2>/dev/null || true
mv ALL_FIXED.md _archive/ 2>/dev/null || true
mv ANSWER_TO_YOUR_QUESTION.md _archive/ 2>/dev/null || true
mv ARCHITECTURE.md _archive/ 2>/dev/null || true
mv AUTHENTICATION_FIXED.md _archive/ 2>/dev/null || true
mv AUTHENTICATION_STATUS.md _archive/ 2>/dev/null || true
mv AUTH_SYSTEM.md _archive/ 2>/dev/null || true
mv Attributions.md _archive/ 2>/dev/null || true
mv BROWSER_CONSOLE_COMMANDS.md _archive/ 2>/dev/null || true
mv BUG_FIX_TYPING_MOBILE.md _archive/ 2>/dev/null || true
mv BUILD_ERROR_FIXED.txt _archive/ 2>/dev/null || true
mv CHECKLIST.md _archive/ 2>/dev/null || true
mv COMPLETED_SUMMARY.md _archive/ 2>/dev/null || true
mv CORRECTED_HOMEPAGE.md _archive/ 2>/dev/null || true
mv DATABASE_SETUP.md _archive/ 2>/dev/null || true
mv DEPLOYMENT.md _archive/ 2>/dev/null || true
mv DEPLOYMENT_CHECKLIST.md _archive/ 2>/dev/null || true
mv DOWNLOAD_AND_DEPLOY.md _archive/ 2>/dev/null || true
mv EASTER_EGGS.md _archive/ 2>/dev/null || true
mv EASTER_EGGS_CHEAT_SHEET.md _archive/ 2>/dev/null || true
mv EASTER_EGGS_MOBILE_DESKTOP.md _archive/ 2>/dev/null || true
mv EASTER_EGGS_QUICK_REFERENCE.md _archive/ 2>/dev/null || true
mv EASTER_EGGS_SUMMARY.md _archive/ 2>/dev/null || true
mv EMAIL_CONFIGURATION.md _archive/ 2>/dev/null || true
mv ERRORS_FIXED.md _archive/ 2>/dev/null || true
mv ERRORS_FIXED_NOW.txt _archive/ 2>/dev/null || true
mv FIXES_COMPLETE.md _archive/ 2>/dev/null || true
mv FIX_DATABASE_NOW.md _archive/ 2>/dev/null || true
mv GOOGLE_OAUTH_SETUP.md _archive/ 2>/dev/null || true
mv HOW_TO_STAY_LOGGED_IN.txt _archive/ 2>/dev/null || true
mv HOW_TO_VIEW_ON_PHONE.md _archive/ 2>/dev/null || true
mv I_AM_CONFUSED.md _archive/ 2>/dev/null || true
mv LATEST_ERRORS_FIXED.md _archive/ 2>/dev/null || true
mv MOBILE_OPTIMIZATION.md _archive/ 2>/dev/null || true
mv MOBILE_QUICK_START.md _archive/ 2>/dev/null || true
mv MOBILE_TESTING_GUIDE.md _archive/ 2>/dev/null || true
mv NEW_AUTH_QUICK_REFERENCE.md _archive/ 2>/dev/null || true
mv QUICK_FIX_SUMMARY.txt _archive/ 2>/dev/null || true
mv QUICK_FIX_VERIFICATION.md _archive/ 2>/dev/null || true
mv QUICK_REFERENCE.md _archive/ 2>/dev/null || true
mv QUICK_START.md _archive/ 2>/dev/null || true
mv README_FIRST.md _archive/ 2>/dev/null || true
mv REBRAND_COMPLETE.md _archive/ 2>/dev/null || true
mv RUN_THIS.txt _archive/ 2>/dev/null || true
mv RUN_THIS_IN_CONSOLE.txt _archive/ 2>/dev/null || true
mv RUN_THIS_NOW.txt _archive/ 2>/dev/null || true
mv SESSION_PERSISTENCE_FIXED.md _archive/ 2>/dev/null || true
mv SETUP_SUMMARY.md _archive/ 2>/dev/null || true
mv SIMPLE_AUTH_GUIDE.md _archive/ 2>/dev/null || true
mv SIMPLE_START_GUIDE.md _archive/ 2>/dev/null || true
mv START_HERE.md _archive/ 2>/dev/null || true
mv START_HERE_NOW.md _archive/ 2>/dev/null || true
mv SUPABASE_EMAIL_SETUP.md _archive/ 2>/dev/null || true
mv TEST_NEW_FEATURES.md _archive/ 2>/dev/null || true
mv THEMES_GUIDE.md _archive/ 2>/dev/null || true
mv URL_ROUTES.md _archive/ 2>/dev/null || true
mv VERIFICATION_FIXED.md _archive/ 2>/dev/null || true
mv VERIFICATION_TROUBLESHOOTING.md _archive/ 2>/dev/null || true
mv VIEW_ON_MOBILE.txt _archive/ 2>/dev/null || true
mv VISUAL_EMAIL_SETUP_GUIDE.md _archive/ 2>/dev/null || true
mv WHERE_TO_RUN_COMMANDS.md _archive/ 2>/dev/null || true

# Keep these in root (don't archive)
# - README.md (main readme)
# - SETUP_INSTRUCTIONS.md (setup guide)
# - AUDIT_REPORT.md (audit findings)
# - CHANGES_SUMMARY.md (change log)
# - FILE_MANIFEST.md (file listing)
# - START_HERE_FIRST.md (quick start)
```

### Step 4: Create Public Assets Folder Structure

```bash
# Create placeholder for icons
touch public/.gitkeep
echo "Add your app icons here:" > public/README.txt
echo "- icon.png (512x512+) for app icon" >> public/README.txt
echo "- tray-icon.png (32x32) for system tray" >> public/README.txt
```

### Step 5: Verify Structure

```bash
echo "✅ New structure created!"
echo ""
echo "📁 Your new folders:"
ls -la src/ 2>/dev/null && echo "  ✓ src/"
ls -la public/ 2>/dev/null && echo "  ✓ public/"
ls -la _archive/ 2>/dev/null && echo "  ✓ _archive/"
echo ""
echo "📄 Files in root:"
ls -1 *.md 2>/dev/null | wc -l | xargs echo "  Markdown files:"
echo ""
echo "Next steps:"
echo "1. Update imports in files (use @ alias)"
echo "2. Add icons to public/ folder"
echo "3. Run: npm install"
echo "4. Run: npm run dev"
```

## 🔄 Alternative: One-Line Cleanup

If you want to do everything at once:

```bash
mkdir -p src public _archive && \
mv App.tsx main.tsx src/ 2>/dev/null; \
mv components contexts utils styles src/ 2>/dev/null; \
mv ADMIN_ACCESS.md ALL_FIXED.md ANSWER_TO_YOUR_QUESTION.md ARCHITECTURE.md AUTHENTICATION_FIXED.md AUTHENTICATION_STATUS.md AUTH_SYSTEM.md Attributions.md BROWSER_CONSOLE_COMMANDS.md BUG_FIX_TYPING_MOBILE.md BUILD_ERROR_FIXED.txt CHECKLIST.md COMPLETED_SUMMARY.md CORRECTED_HOMEPAGE.md DATABASE_SETUP.md DEPLOYMENT.md DEPLOYMENT_CHECKLIST.md DOWNLOAD_AND_DEPLOY.md EASTER_EGGS.md EASTER_EGGS_CHEAT_SHEET.md EASTER_EGGS_MOBILE_DESKTOP.md EASTER_EGGS_QUICK_REFERENCE.md EASTER_EGGS_SUMMARY.md EMAIL_CONFIGURATION.md ERRORS_FIXED.md ERRORS_FIXED_NOW.txt FIXES_COMPLETE.md FIX_DATABASE_NOW.md GOOGLE_OAUTH_SETUP.md HOW_TO_STAY_LOGGED_IN.txt HOW_TO_VIEW_ON_PHONE.md I_AM_CONFUSED.md LATEST_ERRORS_FIXED.md MOBILE_OPTIMIZATION.md MOBILE_QUICK_START.md MOBILE_TESTING_GUIDE.md NEW_AUTH_QUICK_REFERENCE.md QUICK_FIX_SUMMARY.txt QUICK_FIX_VERIFICATION.md QUICK_REFERENCE.md QUICK_START.md README_FIRST.md REBRAND_COMPLETE.md RUN_THIS.txt RUN_THIS_IN_CONSOLE.txt RUN_THIS_NOW.txt SESSION_PERSISTENCE_FIXED.md SETUP_SUMMARY.md SIMPLE_AUTH_GUIDE.md SIMPLE_START_GUIDE.md START_HERE.md START_HERE_NOW.md SUPABASE_EMAIL_SETUP.md TEST_NEW_FEATURES.md THEMES_GUIDE.md URL_ROUTES.md VERIFICATION_FIXED.md VERIFICATION_TROUBLESHOOTING.md VIEW_ON_MOBILE.txt VISUAL_EMAIL_SETUP_GUIDE.md WHERE_TO_RUN_COMMANDS.md _archive/ 2>/dev/null; \
echo "✅ Cleanup complete!"
```

## 📝 Manual Cleanup (If Needed)

If automated scripts don't work, manually:

1. Create folders: `src`, `public`, `_archive`
2. Move `App.tsx` and `main.tsx` to `src/`
3. Move `components`, `contexts`, `utils`, `styles` to `src/`
4. Move all old `.md` files to `_archive/`
5. Keep only these in root:
   - README.md
   - SETUP_INSTRUCTIONS.md
   - package.json
   - vite.config.ts
   - tsconfig.json
   - pakeplus.json

## ✅ Verification Checklist

After cleanup:

- [ ] `src/` folder exists with App.tsx, main.tsx
- [ ] `src/components/` folder exists
- [ ] `src/contexts/` folder exists
- [ ] `src/utils/` folder exists
- [ ] `src/styles/` folder exists
- [ ] `public/` folder exists
- [ ] `_archive/` folder has old docs
- [ ] Root has fewer than 10 .md files
- [ ] `pakeplus.json` exists

## 🚀 After Cleanup

Run these commands:

```bash
# Install dependencies
npm install

# Test that it still works
npm run dev

# Visit http://localhost:5173 and verify app loads
```

## 🐛 If Something Breaks

**"Cannot find module"**
- Update import paths to use `@/` alias
- Example: `import { Component } from '@/components/Component'`

**"App won't start"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**"Vite config error"**
- Ensure vite.config.ts has the `@` alias configured:
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

**Ready to restructure? Run the commands above!** 🎉
