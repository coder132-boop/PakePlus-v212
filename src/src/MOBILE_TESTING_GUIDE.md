# 📱 How to Test ChoreCore on Mobile Devices

## Method 1: Access Local Dev Server from Your Phone

### Step 1: Find Your Computer's Local IP Address

**On Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" - it will look like `192.168.1.xxx`

**On Linux:**
```bash
hostname -I
```

### Step 2: Start Vite Dev Server with Network Access

Instead of just running `npm run dev`, run:

```bash
npm run dev -- --host
```

This allows Vite to be accessed from other devices on your network.

You should see output like:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.xxx:5173/
```

### Step 3: Access from Your Mobile Device

1. **Make sure your phone is on the same WiFi network** as your computer
2. **Open your mobile browser** (Safari, Chrome, etc.)
3. **Type in the Network URL** from step 2, e.g., `http://192.168.1.xxx:5173/`
4. The app should load on your phone!

## Method 2: Deploy to a Free Hosting Service

### Deploy to Vercel (Recommended - Free & Fast)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts** - it will give you a URL like `https://chorecore-xxx.vercel.app`

4. **Access from anywhere:**
   - Open that URL on your phone
   - Share it with friends/family to test
   - Works on any device!

### Deploy to Netlify (Also Free)

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Get your URL** and open it on your phone!

## Method 3: Use Browser DevTools Mobile Emulation

If you just want to test mobile responsiveness on your computer:

1. **Open Chrome DevTools** (F12 or Cmd+Option+I)
2. **Click the device icon** (Toggle device toolbar) or press `Cmd+Shift+M`
3. **Select a device** from the dropdown (iPhone, Pixel, etc.)
4. **Test the app** as if you're on mobile!

## Method 4: Create a QR Code for Easy Mobile Access

### Using Chrome:

1. While running `npm run dev -- --host`
2. Note your Network URL: `http://192.168.1.xxx:5173/`
3. Go to a QR code generator like https://www.qr-code-generator.com/
4. Paste your Network URL
5. Generate QR code
6. Scan with your phone's camera
7. Opens directly in mobile browser!

## Troubleshooting

### "Can't access the site" on mobile

✅ **Check:**
- Both devices on same WiFi network
- Computer firewall isn't blocking port 5173
- You're using the Network URL (not localhost)
- Dev server is running with `--host` flag

### Firewall blocking access

**Mac:**
```bash
# Allow port 5173 through firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/node
```

**Windows:**
1. Search "Windows Defender Firewall"
2. Click "Allow an app through firewall"
3. Allow Node.js

**Linux:**
```bash
# Allow port 5173
sudo ufw allow 5173
```

### SSL/HTTPS issues

Some features (like camera, location) require HTTPS. For local testing:

1. Use a tunneling service like **ngrok**:
   ```bash
   npm install -g ngrok
   ngrok http 5173
   ```
2. Get an HTTPS URL that works on mobile!

## Mobile-Specific Testing Checklist

ChoreCore is already optimized for mobile, but test these features:

- [ ] Navigation menu (burger menu on mobile)
- [ ] Touch targets (buttons are big enough)
- [ ] Swipe gestures on chore list
- [ ] Email verification code input
- [ ] Scrolling on long pages
- [ ] Landscape and portrait modes
- [ ] Different screen sizes (iPhone SE, iPhone Pro Max, Android)
- [ ] Touch interactions vs mouse hover
- [ ] Virtual keyboard doesn't overlap inputs
- [ ] Glass morphism effects render properly

## Mobile Performance Tips

### Test Performance:

1. Open Chrome DevTools
2. Lighthouse tab
3. Run mobile performance audit
4. Check for issues

### Common Mobile Issues to Watch:

- **Images too large** - Use WebP format, compress images
- **Too many animations** - Can cause lag on older phones
- **Large bundle size** - Use code splitting
- **Unoptimized fonts** - Subset fonts, use font-display: swap

## Viewing in Figma Mobile App (Not Applicable)

⚠️ **Important:** Figma mobile app is for viewing **Figma design files**, not web applications.

ChoreCore is a **web app** that runs in a browser, not a Figma prototype.

To view Figma designs:
- Export designs from Figma Desktop
- Share Figma prototype link
- View in Figma mobile app

To view ChoreCore web app:
- Deploy to Vercel/Netlify
- Access URL in mobile browser
- Or use local network access as shown above

## Quick Commands Reference

```bash
# Start dev server with network access
npm run dev -- --host

# Find your IP address (Mac/Linux)
ifconfig | grep "inet "

# Find your IP address (Windows)
ipconfig

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod

# Build for production
npm run build

# Preview production build
npm run preview -- --host
```

## Example: Complete Mobile Testing Workflow

```bash
# 1. Start dev server with network access
npm run dev -- --host

# You'll see:
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: http://192.168.1.100:5173/

# 2. On your phone (same WiFi):
#    Open browser → Go to http://192.168.1.100:5173/

# 3. Test all features on mobile!

# 4. When ready to deploy:
npm run build
vercel

# 5. Get production URL like:
#    https://chorecore.vercel.app

# 6. Share with friends/family for testing!
```

## Mobile Browser Recommendations

**iOS:**
- Safari (default, best compatibility)
- Chrome (for DevTools remote debugging)

**Android:**
- Chrome (best for debugging)
- Firefox
- Samsung Internet

**Testing Tips:**
- Test on both iOS and Android
- Test on different screen sizes
- Test on older devices if possible
- Use Chrome Remote Debugging for mobile debugging

## Remote Debugging

### Debug iOS Safari:

1. Enable Web Inspector on iPhone: Settings → Safari → Advanced → Web Inspector
2. Connect iPhone to Mac
3. Open Safari on Mac → Develop → [Your iPhone] → [Your Page]
4. Full DevTools for mobile!

### Debug Android Chrome:

1. Enable USB Debugging on Android
2. Connect to computer
3. Open Chrome on computer → `chrome://inspect`
4. Select your device
5. Full DevTools for mobile!

---

**TL;DR:** 
1. Run `npm run dev -- --host`
2. Get Network URL from terminal
3. Open that URL on your phone's browser (same WiFi)
4. Or deploy to Vercel and access from anywhere!
