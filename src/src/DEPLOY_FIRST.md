# 🌐 ChoreCore - Deploy First, Then Package

**The RIGHT way to create your desktop app:**

1. Deploy to web
2. Package the deployed URL
3. Distribute

---

## ⚡ Quick Deploy Guide

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login (opens browser)
vercel login

# 3. Build your app
npm run build

# 4. Deploy
vercel --prod
```

You'll get a URL like: `https://chorecore-abc123.vercel.app`

**Test it:** Visit the URL in your browser - should work perfectly!

---

### Option 2: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build your app
npm run build

# 4. Deploy
netlify deploy --prod --dir=dist
```

You'll get a URL like: `https://chorecore-abc123.netlify.app`

---

### Option 3: Your Own Server

Upload the `/dist` folder to your server.

Requirements:
- Static hosting (Apache, Nginx, etc.)
- HTTPS enabled
- Single-page app routing configured

---

## 📦 Package Your Deployed App

Once deployed and tested:

```bash
# Create desktop app with your deployed URL
pake https://chorecore-abc123.vercel.app \
  --name ChoreCore \
  --config pakeplus.json

# Or shorter
pake https://your-chorecore-site.com --name ChoreCore
```

Done! Your app is in the `/output` folder.

---

## ✅ Verify Before Packaging

**Test your deployed site:**

1. Visit URL in browser
2. Test all features
3. Check authentication works
4. Try on different devices
5. Verify Supabase connection

**If web works, desktop app will work!**

---

## 🎯 Why Deploy First?

### ❌ Packaging Localhost
```bash
pake http://localhost:4173  # DON'T DO THIS for production
```

**Problems:**
- Only works with server running
- Can't distribute to users
- Users would need your code
- Defeats purpose of desktop app

### ✅ Packaging Deployed URL
```bash
pake https://chorecore.com  # DO THIS
```

**Benefits:**
- ✅ Works standalone
- ✅ No server needed
- ✅ Distribute anywhere
- ✅ Users always get updates
- ✅ Smaller download
- ✅ Easier maintenance

---

## 🔄 Update Workflow

When you update your app:

### Old Way (Electron - BAD)
1. Update code
2. Rebuild desktop app
3. Re-distribute to all users
4. Users download 80MB again
5. Painful!

### PakePlus Way (GOOD)
1. Update code
2. Deploy to web (`vercel --prod`)
3. Done! Users automatically get update
4. No re-packaging needed
5. Users don't download anything

**Desktop app still points to your URL - gets updates automatically!**

---

## 📊 Deployment Comparison

| Service | Speed | Free Tier | Custom Domain | SSL |
|---------|-------|-----------|---------------|-----|
| **Vercel** | ⚡⚡⚡ Fast | ✅ Generous | ✅ Yes | ✅ Auto |
| **Netlify** | ⚡⚡⚡ Fast | ✅ Good | ✅ Yes | ✅ Auto |
| **GitHub Pages** | ⚡⚡ Medium | ✅ Free | ⚠️ Limited | ✅ Auto |
| **Own Server** | ⚡ Varies | 💰 Paid | ✅ Yes | ⚠️ Manual |

**Recommendation:** Vercel for easiest setup.

---

## 🚀 Complete Workflow

### 1. Build & Test Locally

```bash
npm run build
npm run preview
# Visit http://localhost:4173
# Test everything works
```

### 2. Deploy to Web

```bash
vercel --prod
# Note your URL: https://chorecore-xyz.vercel.app
```

### 3. Test Deployed Version

```bash
# Visit in browser
# Test authentication
# Try all features
# Verify it's working perfectly
```

### 4. Package Desktop App

```bash
pake https://chorecore-xyz.vercel.app \
  --name ChoreCore \
  --config pakeplus.json
```

### 5. Test Desktop App

```bash
# Open from /output folder
# Verify it loads
# Test all features
# Check it works standalone
```

### 6. Distribute

Share the installer with users!

---

## 🎯 Platform-Specific Builds

### After Deploying

Create builds for all platforms:

```bash
# Your deployed URL
DEPLOYED_URL="https://chorecore-xyz.vercel.app"

# Linux .deb
pake $DEPLOYED_URL --name ChoreCore --target deb

# Linux AppImage
pake $DEPLOYED_URL --name ChoreCore --target appimage

# Windows installer
pake $DEPLOYED_URL --name ChoreCore --target nsis

# macOS disk image
pake $DEPLOYED_URL --name ChoreCore --target dmg
```

All will be in `/output` folder.

---

## 💡 Pro Tips

### Vercel Tips

1. **Custom domain:** Add your own domain in Vercel dashboard
2. **Environment variables:** Add in Vercel dashboard (Supabase keys, etc.)
3. **Auto-deploys:** Connect GitHub for automatic deployments
4. **Analytics:** Enable Vercel Analytics

### PakePlus Tips

1. **Test URL first:** Always verify in browser before packaging
2. **Use HTTPS:** Required for many features (auth, etc.)
3. **Check CORS:** Ensure Supabase allows your domain
4. **Test auth flow:** Verify sign in/out works
5. **Multiple builds:** Create for all platforms at once

---

## 🆘 Common Issues

### "App loads but auth fails"

**Fix:** Add your deployed domain to Supabase allowed URLs:
1. Go to Supabase dashboard
2. Settings → Auth → Redirect URLs
3. Add: `https://your-chorecore-site.com/*`
4. Save

### "App shows old version"

**Fix:** Clear cache:
```bash
# Rebuild PakePlus app
rm -rf output/
pake https://your-site.com --name ChoreCore
```

### "Features don't work in desktop"

**Fix:** Check browser console:
1. Right-click in app → Inspect
2. Check Console tab for errors
3. Fix errors in web version
4. Redeploy
5. Desktop app updates automatically!

---

## ✅ Pre-Deploy Checklist

Before deploying:

- [ ] App builds successfully (`npm run build`)
- [ ] Preview works locally (`npm run preview`)
- [ ] All features tested
- [ ] Authentication works
- [ ] Supabase connection works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Ready to deploy!

---

## 📦 Post-Deploy Checklist

After deploying:

- [ ] Deployed URL loads in browser
- [ ] Test all features on deployed version
- [ ] Authentication works
- [ ] Database operations work
- [ ] Added domain to Supabase redirect URLs
- [ ] No errors in browser console
- [ ] Ready to package!

---

## 🎉 Complete Commands

```bash
# 1. Build
npm run build

# 2. Deploy (choose one)
vercel --prod                      # Vercel
netlify deploy --prod --dir=dist   # Netlify

# 3. Get your URL (from output)
# Example: https://chorecore-abc123.vercel.app

# 4. Test in browser first!

# 5. Package desktop app
pake https://your-deployed-url.com --name ChoreCore --config pakeplus.json

# 6. Find app in /output folder

# 7. Test desktop app

# 8. Distribute to users!
```

---

## 🚀 You're Ready!

**Remember:**
1. ✅ Deploy first
2. ✅ Test deployed version
3. ✅ Package deployed URL
4. ✅ Distribute

**Don't package localhost for production!**

---

**Made with ❤️ for cleaner homes**  
*ChoreCore - Smart Habits, Clean Homes* 🏠✨
