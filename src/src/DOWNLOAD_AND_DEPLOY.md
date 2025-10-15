# 📦 Download & Deploy ChoreCore

## Quick Download & Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works!)

---

## 🚀 Option 1: Download & Run Locally

### Step 1: Download the Files
You can download all files from this project. The key files you need are:

**Required Files:**
```
├── package.json           # Dependencies
├── vite.config.ts        # Build configuration
├── tsconfig.json         # TypeScript config
├── index.html            # Entry HTML
├── main.tsx              # App entry point
├── App.tsx               # Main app component
├── components/           # All React components
├── contexts/             # React context providers
├── styles/               # CSS files
├── utils/                # Utility functions
└── supabase/functions/   # Backend server code
```

### Step 2: Install Dependencies
```bash
# Navigate to project directory
cd chorecore

# Install all dependencies
npm install

# This will install everything from package.json
```

### Step 3: Set Up Supabase

1. **Create a Supabase project** at https://supabase.com
2. **Get your project credentials:**
   - Go to Settings → API
   - Copy "Project URL"
   - Copy "anon public" key
   - Copy "service_role" key (keep secret!)

3. **Update `/utils/supabase/info.tsx`:**
```typescript
export const projectId = 'your-project-id'; // From your URL
export const publicAnonKey = 'your-anon-key';
```

4. **Set up environment variables:**
Create a `.env` file in the root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. **Run the SQL setup:**
   - Go to your Supabase dashboard
   - Click "SQL Editor"
   - Click "New Query"
   - Paste the contents from `/DATABASE_SETUP.md`
   - Click "Run"

### Step 4: Deploy Supabase Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the server function
supabase functions deploy server --no-verify-jwt

# Set environment variables for the function
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 5: Run Locally

```bash
# Development mode
npm run dev

# Or for mobile testing (accessible on your network)
npm run dev:mobile
```

The app will be available at:
- **Desktop:** http://localhost:5173
- **Mobile (same network):** http://YOUR_IP:5173

---

## 🌐 Option 2: Deploy to Production

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
npm run deploy:vercel
```

4. **Set environment variables in Vercel:**
   - Go to your project in Vercel dashboard
   - Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_SUPABASE_SERVICE_ROLE_KEY`

5. **Redeploy** to apply environment variables

### Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Deploy:**
```bash
npm run deploy:netlify
```

4. **Set environment variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add the same variables as Vercel

### Deploy to Other Platforms

The app is a standard Vite/React app and can be deployed anywhere:

**Build the app:**
```bash
npm run build
```

This creates a `dist/` folder with static files.

**Upload `dist/` to:**
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- Any static hosting service

---

## 📋 Complete File Checklist

### Core Application Files
- [x] `/package.json` - Dependencies and scripts
- [x] `/vite.config.ts` - Build configuration
- [x] `/tsconfig.json` - TypeScript config
- [x] `/index.html` - Entry HTML file
- [x] `/main.tsx` - React entry point
- [x] `/App.tsx` - Main app component

### Component Files
- [x] `/components/AboutPage.tsx`
- [x] `/components/AssignChores.tsx`
- [x] `/components/AuthPage.tsx`
- [x] `/components/ChoreCalendar.tsx`
- [x] `/components/ChoreCoreLogo.tsx`
- [x] `/components/ChoreList.tsx`
- [x] `/components/DatabaseSetupGuide.tsx`
- [x] `/components/EasterEggs.tsx`
- [x] `/components/HouseDashboard.tsx`
- [x] `/components/LandingPage.tsx`
- [x] `/components/Navigation.tsx`
- [x] `/components/PointsPage.tsx`
- [x] `/components/SettingsPage.tsx`
- [x] `/components/ui/` - All UI components (50+ files)

### Context Files
- [x] `/contexts/TaskContext.tsx` - State management
- [x] `/contexts/ThemeContext.tsx` - Theme management

### Utility Files
- [x] `/utils/supabase/client.ts` - Supabase client
- [x] `/utils/supabase/info.tsx` - Project config
- [x] `/utils/databaseChecker.ts` - Database utilities

### Style Files
- [x] `/styles/globals.css` - Global styles and themes

### Backend Files
- [x] `/supabase/functions/server/index.tsx` - API server
- [x] `/supabase/functions/server/kv_store.tsx` - KV store utilities

### Configuration Files
- [x] `/vercel.json` - Vercel config
- [x] `/netlify.toml` - Netlify config
- [x] `/render.yaml` - Render config
- [x] `/.gitignore` - Git ignore rules
- [x] `/eslint.config.js` - Linting config

---

## 🔐 Security Notes

### Important: Keep These Secret
- **Service Role Key** - NEVER commit to git or expose to frontend
- Store in environment variables only
- Only use in backend (Supabase Edge Functions)

### Safe to Share
- **Anon Key** - Can be public (used in frontend)
- **Project URL** - Can be public

### .gitignore
Make sure you have a `.gitignore` file:
```
node_modules/
dist/
.env
.env.local
.env.production
.vercel
.netlify
```

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Environment variables not working
- Make sure `.env` file is in the root directory
- Restart dev server after changing `.env`
- In production, set variables in hosting platform dashboard

### Supabase connection errors
- Check that database tables are created (run SQL setup)
- Verify Supabase credentials are correct
- Check that Edge Function is deployed
- Look at browser console for specific errors

---

## 📦 Package Size

After build:
- **Gzipped:** ~150-200 KB
- **Total build:** ~500-700 KB
- **Fast loading** on all connections

---

## 🎯 Post-Deployment Checklist

After deploying:

1. **Test authentication:**
   - [ ] Can create a new account
   - [ ] Can sign in
   - [ ] Can sign out
   - [ ] Session persists after refresh

2. **Test database:**
   - [ ] Can create recurring tasks
   - [ ] Can assign chores
   - [ ] Can complete chores
   - [ ] Can approve chores
   - [ ] Points update correctly

3. **Test themes:**
   - [ ] Static themes work
   - [ ] Animated themes work
   - [ ] Theme persists after refresh

4. **Test responsive design:**
   - [ ] Works on mobile
   - [ ] Works on tablet
   - [ ] Works on desktop
   - [ ] Touch interactions work

5. **Test performance:**
   - [ ] Pages load quickly
   - [ ] No console errors
   - [ ] Animations are smooth
   - [ ] No memory leaks

---

## 🔄 Updating After Download

To update the app after making changes:

```bash
# Pull latest changes (if using git)
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# Redeploy
npm run deploy:vercel  # or deploy:netlify
```

---

## 💡 Tips

### Use Git for Version Control
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### Enable TypeScript strict mode
Already configured in `tsconfig.json` for type safety

### Monitor Performance
- Use Chrome DevTools Lighthouse
- Check bundle size with `npm run build`
- Monitor Supabase usage in dashboard

### Backup Database
- Export data regularly from Supabase dashboard
- Keep SQL schema in version control
- Test restore process

---

## 🆘 Getting Help

### Check Documentation
- `/DATABASE_SETUP.md` - Database setup
- `/START_HERE_NOW.md` - Quick start guide
- `/TEST_NEW_FEATURES.md` - Testing guide
- `/FIXES_COMPLETE.md` - Technical details

### Common Issues
- **503 errors:** Edge function not deployed
- **401 errors:** Wrong API keys
- **Database errors:** Tables not created
- **Build errors:** Missing dependencies

### Debug Mode
Add to your `.env.local`:
```env
VITE_DEBUG=true
```

Then check browser console for detailed logs.

---

## 🎉 Success!

Once deployed, your ChoreCore app will be:
- ✅ Fully functional with authentication
- ✅ Connected to Supabase backend
- ✅ Responsive on all devices
- ✅ Fast and optimized
- ✅ Secure and reliable

**Enjoy your ChoreCore deployment!** 🏠✨
