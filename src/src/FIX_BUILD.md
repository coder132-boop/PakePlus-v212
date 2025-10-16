# 🔧 ChoreCore - Build Fix Guide

If your build is failing, follow these steps to fix it.

## ⚡ Quick Fix (Most Common Issues)

### Step 1: Clean Everything

```bash
# Remove old builds and dependencies
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm package-lock.json

# Reinstall fresh
npm install
```

### Step 2: Test the Build

```bash
npm run build
```

If this works, you're done! ✅

---

## 🐛 If Build Still Fails

### Check for Specific Errors

Run the build and read the error message carefully:

```bash
npm run build
```

Common errors and fixes:

---

### Error: "Cannot find module"

**Fix: Clear cache and reinstall**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Error: "motion/react" or animation library issues

**Fix: Ensure motion is installed**
```bash
npm install motion@latest
npm run build
```

---

### Error: TypeScript errors

**Fix: Check TypeScript**
```bash
# See the specific errors
npx tsc --noEmit

# Fix any reported errors in the files
```

---

### Error: "@supabase/supabase-js" issues

**Fix: Reinstall Supabase**
```bash
npm install @supabase/supabase-js@latest
npm run build
```

---

### Error: "tailwindcss" or CSS issues

**Fix: Reinstall Tailwind**
```bash
npm install @tailwindcss/vite@latest tailwindcss@latest
npm run build
```

---

### Error: Vite config issues

**Fix: Your vite.config.ts should look like this:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'motion/react',
      'lucide-react',
      'sonner',
    ],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['lucide-react', 'motion'],
        },
      },
    },
  },
});
```

---

## 🔍 Detailed Diagnostics

### Check Node Version

```bash
node --version
# Should be 18 or higher
```

If lower than 18:
```bash
# Install Node 18+ from nodejs.org
# Or use nvm:
nvm install 18
nvm use 18
```

### Check NPM Version

```bash
npm --version
# Should be 9 or higher
```

If lower:
```bash
npm install -g npm@latest
```

### Verify Package.json

Your package.json should have these key dependencies:

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.47.10",
    "motion": "^11.16.0",
    "lucide-react": "^0.487.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "@tailwindcss/vite": "^4.0.0-beta.7",
    "tailwindcss": "^4.0.0-beta.7",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}
```

---

## 🚨 Nuclear Option (Complete Reset)

If nothing else works:

```bash
# 1. Backup your Supabase credentials
cp utils/supabase/info.tsx ~/info-backup.tsx

# 2. Delete everything except source files
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm package-lock.json

# 3. Reinstall from scratch
npm install

# 4. Restore credentials
cp ~/info-backup.tsx utils/supabase/info.tsx

# 5. Try build
npm run build
```

---

## ✅ Verification Checklist

After fixing, verify everything works:

```bash
# 1. Build succeeds
npm run build
# Should complete without errors

# 2. Dev server works
npm run dev
# Visit http://localhost:5173 - should load

# 3. Preview works
npm run preview
# Visit http://localhost:4173 - should load

# 4. No console errors
# Open browser dev tools (F12)
# Check console - should have no red errors
```

---

## 📝 Common File Issues

### Missing Files

Ensure these critical files exist:

- ✅ `/App.tsx` - Main component
- ✅ `/main.tsx` - Entry point
- ✅ `/index.html` - HTML template
- ✅ `/vite.config.ts` - Vite config
- ✅ `/tsconfig.json` - TypeScript config
- ✅ `/package.json` - Dependencies
- ✅ `/styles/globals.css` - Global styles

### Corrupted Files

If a specific file seems corrupted:

```bash
# Check file encoding
file components/SomeComponent.tsx
# Should say: UTF-8 Unicode text

# If not UTF-8, reconvert
iconv -f ISO-8859-1 -t UTF-8 file.tsx > file-fixed.tsx
mv file-fixed.tsx file.tsx
```

---

## 🎯 Step-by-Step Build Test

Test each step individually:

```bash
# 1. TypeScript compilation
npx tsc --noEmit
# Should complete with no errors

# 2. Vite build (without optimization)
npx vite build --minify false
# Should create /dist folder

# 3. Full production build
npm run build
# Should complete successfully

# 4. Test the build
npm run preview
# Should serve at http://localhost:4173
```

---

## 💡 Prevention Tips

To avoid build issues:

1. **Don't edit node_modules** - Always use npm install
2. **Keep dependencies updated** - Run `npm update` periodically
3. **Use correct Node version** - Stay on Node 18+
4. **Commit package-lock.json** - Ensures consistent builds
5. **Test before committing** - Run `npm run build` before git commit

---

## 🆘 Still Having Issues?

### Collect Error Information

```bash
# Get detailed error log
npm run build 2>&1 | tee build-error.log

# Check the log file
cat build-error.log
```

### Share Error for Help

When asking for help, provide:

1. **Error message** (exact text)
2. **Node version** (`node --version`)
3. **NPM version** (`npm --version`)
4. **OS** (Windows/Mac/Linux)
5. **What you tried** (list all fixes attempted)

---

## 🔧 Quick Command Reference

```bash
# Clean install
rm -rf node_modules package-lock.json && npm install

# Build with verbose logging
npm run build -- --debug

# Clear all caches
rm -rf node_modules dist .vite ~/.npm

# Force reinstall everything
npm ci

# Check for outdated packages
npm outdated

# Update all dependencies
npm update
```

---

## ✨ Success!

Once your build works:

```bash
# Build for production
npm run build

# Test it
npm run preview

# For PakePlus desktop app
pake http://localhost:4173 --name ChoreCore --config pakeplus.json
```

---

**Build should work now! If you're still stuck, check the error message and search for it specifically.** 🚀
