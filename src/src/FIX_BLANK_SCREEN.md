# 🔧 ChoreCore - Fix Blank Screen

**Your PakePlus app shows a blank screen. Here's why and how to fix it!**

---

## 🎯 Why Blank Screen?

**PakePlus doesn't bundle your app** - it just creates a native window that loads a URL.

When you ran:
```bash
pake http://localhost:4173 --config pakeplus.json
```

It created an app that **tries to connect to localhost:4173**, but:
- ❌ The preview server isn't running
- ❌ So the app can't load anything
- ❌ Result: Blank screen

---

## ✅ TWO SOLUTIONS

### Solution 1: Use with Local Preview (Testing)

**Use this for testing/development.**

#### Step 1: Start Preview Server
```bash
# In terminal 1 - KEEP THIS RUNNING
npm run preview
```

You'll see:
```
  ➜  Local:   http://localhost:4173/
```

#### Step 2: Open Your PakePlus App

Now open the ChoreCore app you already created. It should work!

**Important:** The preview server must stay running while you use the app.

---

### Solution 2: Use Deployed URL (Production)

**Use this for real distribution to users.**

#### Step 1: Deploy to Web First

```bash
# Build your app
npm run build

# Deploy /dist folder to:
# - Vercel (recommended)
# - Netlify
# - Your own hosting
```

Example with Vercel:
```bash
npm install -g vercel
vercel --prod
```

You'll get a URL like: `https://chorecore-xyz.vercel.app`

#### Step 2: Create PakePlus App with Deployed URL

```bash
pake https://chorecore-xyz.vercel.app --name ChoreCore --config pakeplus.json
```

#### Step 3: Distribute

The app now works standalone - no server needed!

**Benefits:**
- ✅ Users don't need anything running locally
- ✅ Always get latest version (from web)
- ✅ Smaller app size
- ✅ Easier updates (just update website)

---

## 🔍 Check What's Wrong (Dev Tools)

Open dev tools in the PakePlus app to see errors:

**Mac:**
- Right-click in app → Inspect Element
- Or use keyboard shortcut

**Windows/Linux:**
- Right-click in app → Inspect
- Or press F12

Look at:
- **Console tab** - JavaScript errors
- **Network tab** - Failed requests

Common errors:
```
Failed to fetch
ERR_CONNECTION_REFUSED
```

These mean the server isn't running or URL is wrong.

---

## 🚀 Recommended Workflow

### For Testing/Development:

```bash
# Terminal 1 (keep running)
npm run preview

# Terminal 2 (one-time)
pake http://localhost:4173 --name ChoreCore-Dev

# Use the app while preview server runs
```

### For Production/Distribution:

```bash
# 1. Deploy to web
npm run build
vercel --prod  # or your hosting

# 2. Create app with deployed URL
pake https://your-site.com --name ChoreCore --config pakeplus.json

# 3. Distribute the app
# Users can use it without any server!
```

---

## 🎯 Quick Fix Right Now

**To use your existing app immediately:**

```bash
# Start the preview server
npm run preview

# Leave it running, then open your ChoreCore app
# It should work now!
```

**To create a standalone app:**

```bash
# Deploy first
npm run build
vercel --prod

# Then create app with that URL
pake https://your-deployed-url.com --name ChoreCore
```

---

## 💡 Understanding PakePlus

PakePlus is a **web wrapper**, not a bundler:

| What It Does | What It Doesn't Do |
|--------------|-------------------|
| ✅ Creates native window | ❌ Bundle your code |
| ✅ Loads URL in app | ❌ Include Node.js |
| ✅ System integration | ❌ Work offline (without web) |
| ✅ Small file size | ❌ Package dependencies |

**Think of it as:** A dedicated browser window for your website.

**Best practice:** Package your deployed production URL, not localhost.

---

## 🔧 Testing Checklist

Before distributing your app:

- [ ] Web version deployed and accessible
- [ ] Visit the deployed URL in browser - works?
- [ ] Create PakePlus app with deployed URL
- [ ] Test the PakePlus app - loads correctly?
- [ ] Test on target platforms (Win/Mac/Linux)
- [ ] Verify all features work in desktop app
- [ ] Ready to distribute!

---

## 📊 Comparison

### Localhost Packaging (Testing Only)
```bash
pake http://localhost:4173 --name ChoreCore
```
✅ Good for: Testing  
❌ Requires: Preview server running  
❌ For distribution: No

### Production URL Packaging (Recommended)
```bash
pake https://chorecore.com --name ChoreCore
```
✅ Good for: Distribution  
✅ Requires: Nothing (standalone)  
✅ For distribution: Yes!

---

## 🆘 Still Blank Screen?

### 1. Verify Server is Running

```bash
# Check if preview is running
curl http://localhost:4173

# Should return HTML
# If "Connection refused" → server not running
```

### 2. Verify Build Works

```bash
npm run build
npm run preview

# Visit in browser: http://localhost:4173
# Should see ChoreCore
```

### 3. Check PakePlus Config

Your `pakeplus.json` should have:
```json
{
  "url": "http://localhost:4173"
}
```

But for production, create app with command:
```bash
pake https://your-site.com --config pakeplus.json
```

### 4. Rebuild PakePlus App

```bash
# Delete old app
rm -rf output/

# Rebuild with correct URL
pake http://localhost:4173 --name ChoreCore

# Or with deployed URL
pake https://your-site.com --name ChoreCore
```

---

## ✅ Success Checklist

After fixing:

- [ ] Preview server running (`npm run preview`)
- [ ] Can visit http://localhost:4173 in browser
- [ ] ChoreCore app opens and loads
- [ ] Can navigate through app
- [ ] All features work

OR for production:

- [ ] Web version deployed
- [ ] Deployed URL works in browser
- [ ] Created PakePlus app with deployed URL
- [ ] App works without any server running
- [ ] Ready to share with users!

---

## 🎯 Recommended Deployment

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
npm run build
vercel --prod

# You'll get: https://chorecore-xyz.vercel.app
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run build
netlify deploy --prod --dir=dist

# You'll get: https://chorecore-xyz.netlify.app
```

### Then Package

```bash
pake https://your-deployed-url.com --name ChoreCore --config pakeplus.json
```

---

## 💡 Pro Tips

1. **Always deploy first** - Then package the deployed URL
2. **Test in browser first** - If web doesn't work, app won't work
3. **Keep preview running for local testing** - It's not bundled
4. **Production = deployed URL** - Never use localhost for distribution
5. **Update web, not app** - Users automatically get updates

---

## 🎉 Summary

**The fix:**

For testing:
```bash
npm run preview  # Keep running
# Then open your app
```

For production:
```bash
vercel --prod  # Deploy first
pake https://your-site.com --name ChoreCore  # Then package
```

**Remember:** PakePlus wraps your website, it doesn't bundle it!

---

**Your app should work now! 🚀**
