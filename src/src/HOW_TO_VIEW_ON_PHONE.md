# 📱 How to View ChoreCore on Your Phone

## Important: This is NOT a Figma File!

ChoreCore is a **web application** (like Gmail, Facebook, etc.), not a Figma design file.

**Figma Mobile App** = View Figma designs only  
**ChoreCore** = Web app, open in **mobile browser**

---

## ✅ The Right Way: Use Your Phone's Browser

### Method 1: Local Testing (Same WiFi)

```
┌─────────────────────────────────────┐
│  On Your Computer:                  │
│                                     │
│  1. Open Terminal                   │
│  2. Run: npm run dev:mobile         │
│  3. Look for:                       │
│     ➜  Network: http://192.168...   │
│  4. Copy that URL                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  On Your Phone:                     │
│                                     │
│  1. Make sure on SAME WiFi          │
│  2. Open Safari/Chrome              │
│  3. Type the Network URL            │
│  4. ChoreCore loads!                │
└─────────────────────────────────────┘
```

**Example:**
```bash
# On computer terminal:
npm run dev:mobile

# You see:
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/  ← USE THIS!

# On phone browser:
http://192.168.1.100:5173/
```

### Method 2: Deploy Online (Access Anywhere!)

```
┌─────────────────────────────────────┐
│  One-Time Setup:                    │
│                                     │
│  npm install -g vercel              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Deploy:                            │
│                                     │
│  vercel                             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Get URL:                           │
│                                     │
│  https://chorecore-xxx.vercel.app   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Open on ANY Device:                │
│                                     │
│  - Your phone                       │
│  - Friend's phone                   │
│  - Tablet                           │
│  - Any browser anywhere!            │
└─────────────────────────────────────┘
```

---

## ❌ Common Misconceptions

### "Can I view this in Figma mobile app?"
**No.** Figma mobile app is only for viewing Figma design files (.fig files).

ChoreCore is a **built web application**, not a Figma file.

### "Do I need to export from Figma?"
**No.** ChoreCore is already a complete web app. There's nothing to export.

### "Where do I click in Figma to preview?"
**You don't use Figma.** Use your phone's web browser instead.

---

## 🎯 Quick Reference

| Want to... | Do this... |
|------------|------------|
| Test on my phone (same WiFi) | `npm run dev:mobile` → Use Network URL in phone browser |
| Share with friends | Deploy to Vercel → Share URL |
| Test mobile features | Open in Safari/Chrome on phone |
| Debug on mobile | Use Chrome Remote Debugging |
| View Figma design | Use Figma mobile app (NOT for this!) |

---

## 🔍 Visual Comparison

### Figma Mobile App (NOT for ChoreCore)
```
Figma Mobile App
  ↓
View Figma Designs (.fig files)
  ↓
Prototypes, Mockups, Design Files
  ✗ Can't view web applications
  ✗ Can't run JavaScript/React
  ✗ Only for Figma files
```

### ChoreCore (Web Application)
```
Mobile Web Browser (Safari/Chrome)
  ↓
View Web Applications
  ↓
ChoreCore Live App
  ✓ Full functionality
  ✓ Real database
  ✓ Works anywhere
```

---

## 📱 Step-by-Step with Screenshots

### Step 1: Start Dev Server
```bash
# In your computer terminal:
npm run dev:mobile
```

**You'll see:**
```
  VITE v6.0.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

### Step 2: Open Phone Browser

**On iPhone:**
1. Open **Safari**
2. Tap address bar
3. Type: `192.168.1.100:5173`
4. Tap Go

**On Android:**
1. Open **Chrome**
2. Tap address bar
3. Type: `192.168.1.100:5173`
4. Tap Enter

### Step 3: Use ChoreCore!

The app loads on your phone just like any website:
- Create account
- Join house
- Complete chores
- Track points
- Everything works!

---

## 🚀 Advanced: Production Deployment

### Vercel (Recommended)

**Pros:**
- ✅ Free for personal projects
- ✅ Automatic HTTPS
- ✅ Fast global CDN
- ✅ Easy to deploy
- ✅ One command deployment

**Steps:**
```bash
# Install once
npm install -g vercel

# Deploy
vercel

# Get URL like:
https://chorecore.vercel.app

# Now accessible from ANYWHERE!
```

### Netlify

**Pros:**
- ✅ Free tier
- ✅ Great for static sites
- ✅ Form handling

**Steps:**
```bash
# Install
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Other Options

- **GitHub Pages** - Free, good for static sites
- **Render** - Free tier available
- **Railway** - Easy deployment
- **Cloudflare Pages** - Fast CDN

---

## 🔧 Troubleshooting

### "Can't access from phone"

**Check:**
1. Both devices on same WiFi network
2. Computer firewall allows port 5173
3. Using Network URL (not localhost)
4. Dev server running with `--host` flag

### "Network URL not showing"

Make sure you run:
```bash
npm run dev:mobile
```

NOT just:
```bash
npm run dev
```

The `--host` flag makes it accessible on network.

### "Works on computer but not phone"

**Common causes:**
- Different WiFi networks
- VPN on computer
- Firewall blocking
- Typo in URL

**Solution:**
- Disable VPN temporarily
- Check firewall settings
- Make sure both on same network
- Double-check the IP address

### "Want HTTPS for testing"

Use **ngrok** (free tunneling):
```bash
# Install
npm install -g ngrok

# In one terminal:
npm run dev

# In another terminal:
ngrok http 5173

# Get HTTPS URL like:
https://abc123.ngrok.io
```

---

## 📚 Additional Resources

- **[MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md)** - Complete testing guide
- **[MOBILE_QUICK_START.md](./MOBILE_QUICK_START.md)** - Quick reference
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[README.md](./README.md)** - Full documentation

---

## 💡 Pro Tips

### Create a QR Code

1. Deploy to Vercel
2. Get your URL: `https://chorecore.vercel.app`
3. Go to https://www.qr-code-generator.com/
4. Paste your URL
5. Generate QR code
6. Scan with phone camera
7. Instant access!

### Add to Home Screen

**On iPhone:**
1. Open ChoreCore in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Now it's like a native app!

**On Android:**
1. Open ChoreCore in Chrome
2. Tap Menu (⋮)
3. Tap "Add to Home Screen"
4. App icon on home screen!

### Test on Multiple Devices

```bash
# Deploy once
vercel

# Share URL with:
- Your iPhone
- Your Android tablet
- Friend's phone
- Different browsers
- All work the same!
```

---

## ✅ Summary

**TL;DR:**

1. **Figma Mobile App ≠ Web Browser**
   - Figma app = View Figma designs
   - ChoreCore = Use web browser

2. **Local Testing:**
   ```bash
   npm run dev:mobile
   # Use Network URL on phone
   ```

3. **Online Access:**
   ```bash
   vercel
   # Get URL, open on any device
   ```

4. **It's a Web App!**
   - Open in Safari/Chrome
   - Works like any website
   - No Figma needed!

---

**Still confused?** Think of ChoreCore like:
- ✅ Gmail (open in browser)
- ✅ Facebook (open in browser)
- ✅ Any website (open in browser)

**NOT like:**
- ❌ Figma design file
- ❌ Figma prototype
- ❌ Something you view in Figma app

Open it in your **phone's web browser**, not Figma! 🌐
