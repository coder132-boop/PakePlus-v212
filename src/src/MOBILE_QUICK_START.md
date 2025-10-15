# 📱 Mobile Testing - Quick Start

## ⚡ Fastest Way to View on Mobile

### Option 1: Local Network Access (2 steps!)

1. **Run this command:**
   ```bash
   npm run dev:mobile
   ```

2. **Look for this line in terminal:**
   ```
   ➜  Network: http://192.168.1.100:5173/
   ```

3. **On your phone:**
   - Open browser (Safari, Chrome, etc.)
   - Type that Network URL
   - Make sure phone is on same WiFi as computer!

### Option 2: Deploy to Vercel (Access Anywhere!)

1. **Install Vercel:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Get URL like:**
   ```
   https://chorecore-abc123.vercel.app
   ```

4. **Open on ANY device** - works anywhere!

---

## 🔧 Troubleshooting

**Can't access on phone?**
- ✅ Both devices on same WiFi
- ✅ Using Network URL (not localhost)
- ✅ Firewall not blocking port 5173

**Need HTTPS?**
- Use Vercel deploy (always HTTPS)
- Or use ngrok for local testing

---

## 📚 Full Guide

See **[MOBILE_TESTING_GUIDE.md](./MOBILE_TESTING_GUIDE.md)** for:
- Detailed troubleshooting
- Remote debugging
- Performance testing
- Multiple deployment options

---

## 🎯 TL;DR

```bash
# Quick local mobile testing
npm run dev:mobile

# Access from phone browser on same WiFi
# Use the Network URL shown in terminal
```

OR

```bash
# Deploy to access from anywhere
npm install -g vercel
vercel
```

**Note:** Figma mobile app is for Figma designs, not web apps. ChoreCore is a web app - use your phone's browser! 🌐
