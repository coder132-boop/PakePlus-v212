# ChoreCore Setup Instructions

Complete setup guide to get ChoreCore running locally and prepare for desktop app deployment.

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Electron for desktop app support.

### 2. Configure Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project credentials
4. Update `/utils/supabase/info.tsx`:

```typescript
export const projectId = 'your-project-id'; // From project URL
export const publicAnonKey = 'your-anon-key'; // From Settings > API
```

### 3. Initialize Database

```bash
# Start the dev server
npm run dev
```

Then:
1. Visit `http://localhost:5173/?admin-setup`
2. Copy the SQL script shown
3. Go to your Supabase project → SQL Editor
4. Paste and run the script
5. Return to the app and click "Verify Setup"

### 4. Create Admin Account

1. Visit `http://localhost:5173/login`
2. Click "Sign Up"
3. Enter your details
4. First user becomes the admin automatically!

### 5. Start Using ChoreCore

You're ready! Explore:
- Dashboard → View house stats
- Assign (admin only) → Create recurring tasks
- Calendar → See scheduled chores
- Chores → Complete and manage tasks
- Points → View leaderboard

---

## 🖥️ Desktop App Setup

### Prerequisites

Ensure you've completed the Quick Start above, then:

### 1. Add Application Icons

**Important**: The desktop app needs proper icons to build.

#### Quick Option (Placeholder)
The app includes placeholder icons and will build, but you should replace them with your actual logo.

#### Proper Setup
1. Create a 1024x1024 PNG logo
2. Generate platform-specific icons:
   - `icon.png` (1024x1024) - for Linux
   - `icon.ico` (multi-size) - for Windows
   - `icon.icns` (multi-size) - for macOS
3. Place them in `/electron/` folder

See `/electron/README.md` for detailed icon generation instructions.

### 2. Test Desktop App (Development)

```bash
npm run electron:dev
```

This opens ChoreCore in an Electron window. Test all features!

### 3. Build Desktop App (Production)

#### Current Platform
```bash
npm run electron:build
```

#### Specific Platform
```bash
npm run electron:build:win    # Windows (.exe installer)
npm run electron:build:mac    # macOS (.dmg disk image)
npm run electron:build:linux  # Linux (.AppImage, .deb)
```

#### All Platforms (requires platform-specific tools)
```bash
npm run electron:build:all
```

**Note**: Building for macOS requires a Mac. Building for Windows can be done on Windows or with Wine on Mac/Linux.

### 4. Find Your Installers

After building, installers will be in:
```
/dist-electron/
├── ChoreCore-Setup-1.0.0-x64.exe        # Windows
├── ChoreCore-1.0.0-universal.dmg        # macOS
└── ChoreCore-1.0.0-x86_64.AppImage      # Linux
```

### 5. Test the Installer

1. Double-click the installer
2. Follow installation steps
3. Launch ChoreCore
4. Test all features work correctly

---

## 🌐 Web Deployment

### Build for Web

```bash
npm run build
```

This creates a production build in `/dist` folder.

### Deploy to Hosting Platform

#### Vercel (Recommended)
```bash
npm install -g vercel
npm run deploy:vercel
```

#### Netlify
```bash
npm install -g netlify-cli
npm run deploy:netlify
```

#### Manual (Any Static Host)
1. Run `npm run build`
2. Upload contents of `/dist` folder to your host
3. Configure host to serve `index.html` for all routes (SPA mode)

**Popular hosts**: Vercel, Netlify, Cloudflare Pages, GitHub Pages, AWS S3, Google Cloud Storage

---

## 📱 Mobile Testing

### Test on Your Phone

```bash
# Start dev server with network access
npm run dev:mobile
```

1. Note the IP address shown (e.g., `http://192.168.1.5:5173`)
2. Open this URL on your phone's browser
3. Test touch interactions and responsive design

### Production Mobile

Once deployed to web, your app works on all mobile browsers automatically!

---

## 🔧 Configuration Options

### Environment Variables (Production)

For production deployments, consider using environment variables:

Create `.env.local` (never commit this):
```bash
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then update `/utils/supabase/info.tsx`:
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'fallback';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'fallback';
```

### Google OAuth (Optional)

To enable Google Sign-In:

1. Follow the guide in `/docs/AUTHENTICATION.md`
2. Set up Google Cloud Console
3. Configure Supabase Auth provider
4. Test login flow

---

## 🧪 Testing

### Manual Testing

Follow the comprehensive checklist in `/docs/TESTING_GUIDE.md`.

Key areas to test:
- ✅ Sign up and login
- ✅ Create recurring tasks
- ✅ Assign and complete chores
- ✅ Approve chores and award points
- ✅ View leaderboard
- ✅ Change themes
- ✅ Mobile responsiveness

### Automated Testing (Future)

Consider adding:
- Jest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

---

## 📊 Production Checklist

Before releasing to users:

### Code Quality
- [ ] Run `npm run lint` with no errors
- [ ] Remove console.log statements
- [ ] Update version in package.json
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

### Security
- [ ] Verify Supabase RLS policies
- [ ] Check for exposed credentials
- [ ] Enable HTTPS only
- [ ] Configure CSP headers
- [ ] Test authentication flow

### Performance
- [ ] Build size is reasonable (<1MB gzipped)
- [ ] Lighthouse score >90
- [ ] Images optimized
- [ ] No memory leaks

### Documentation
- [ ] README is up to date
- [ ] CHANGELOG updated
- [ ] User guide available
- [ ] API documentation (if applicable)

### Deployment
- [ ] Environment variables configured
- [ ] Database backup strategy
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics configured (optional)
- [ ] Domain configured
- [ ] SSL certificate active

---

## 🐛 Troubleshooting

### Build Errors

**"Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
npm run build
# Fix any TypeScript errors shown
```

### Electron Issues

**"Electron failed to install"**
```bash
npm install electron --force
```

**"Application won't start"**
```bash
# Clear Electron cache
rm -rf ~/.electron
npm install
```

### Supabase Issues

**"Failed to connect to Supabase"**
- Verify project ID and anon key are correct
- Check Supabase project is active
- Verify network connection

**"Database setup failed"**
- Ensure SQL script ran successfully
- Check for SQL syntax errors
- Verify RLS policies are enabled

### Desktop App Issues

**"White screen on launch"**
- Ensure `npm run build` completed successfully
- Check `/dist/index.html` exists
- Verify file:// protocol in main.js

**"Icons not showing"**
- Ensure icon files exist in `/electron` folder
- Icons must be proper format (.ico for Windows, .icns for macOS)
- Rebuild app after adding icons

---

## 📚 Next Steps

After setup:

1. **Customize Branding**
   - Add your logo
   - Customize colors
   - Update app name/description

2. **Configure Features**
   - Set up email templates in Supabase
   - Configure Google OAuth (optional)
   - Customize themes

3. **Prepare for Launch**
   - Complete testing checklist
   - Create user documentation
   - Set up support channels
   - Plan marketing strategy

4. **Monitor & Iterate**
   - Set up error tracking
   - Monitor user feedback
   - Plan feature roadmap
   - Regular updates

---

## 🎯 Quick Reference Commands

```bash
# Development
npm run dev              # Web dev server
npm run dev:mobile       # Web dev with network access
npm run electron:dev     # Desktop dev mode

# Building
npm run build            # Web production build
npm run electron:build   # Desktop production build

# Testing
npm run preview          # Preview web build
npm run lint             # Check code quality

# Deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:netlify   # Deploy to Netlify
```

---

## 💡 Tips

1. **Start Simple**: Deploy web version first, desktop app later
2. **Test Early**: Test on real devices, not just dev tools
3. **Backup Often**: Export database backups regularly
4. **Monitor Usage**: Track what features users actually use
5. **Iterate Fast**: Release updates based on user feedback

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review `/docs` folder for detailed guides
3. Check Supabase documentation
4. Check Electron documentation
5. Search GitHub issues for similar problems

---

## ✨ You're All Set!

ChoreCore is ready to help households stay organized. Have fun building your chore management empire! 🏠🎉

**Made with ❤️ for cleaner homes**
