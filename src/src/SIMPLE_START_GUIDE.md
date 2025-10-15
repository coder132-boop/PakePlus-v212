# 🎯 ChoreCore - Simple Start Guide

## The Absolute Easiest Way to Get Started

### You Need 3 Things:

1. ✅ **VS Code** (text editor) - Download from https://code.visualstudio.com/
2. ✅ **Node.js** (JavaScript runtime) - Download from https://nodejs.org/
3. ✅ **ChoreCore folder** (your project files) - You already have this!

---

## Step-by-Step (Complete Beginner Friendly)

### Step 1: Open VS Code

Click the VS Code icon on your computer.

### Step 2: Open Your Project Folder

```
Click: File (top left)
  ↓
Click: Open Folder
  ↓
Find your "chorecore" folder
  ↓
Click: Open
```

**You should now see your project files on the left side.**

### Step 3: Open the Terminal

**Three ways (choose one):**

**Way 1:** Press `Ctrl` + `` ` `` (backtick key, above Tab)

**Way 2:** Click `View` menu → `Terminal`

**Way 3:** Click `Terminal` menu → `New Terminal`

**A panel should appear at the bottom of VS Code.**

### Step 4: Install Dependencies (FIRST TIME ONLY)

In the terminal at the bottom, type:

```bash
npm install
```

Press Enter.

**Wait 1-2 minutes for it to finish.**

You'll see lots of text scrolling. That's normal!

### Step 5: Start the Development Server

In the same terminal, type:

```bash
npm run dev:mobile
```

Press Enter.

**You should see something like:**

```
  VITE v6.0.5  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/  ← IMPORTANT!
```

### Step 6: Get the Network URL

**Copy the Network URL** (the one that starts with http://192.168...)

Example: `http://192.168.1.100:5173/`

### Step 7: Open on Your Phone

1. **Make sure your phone is on the SAME WiFi as your computer**
2. **Open Safari (iPhone) or Chrome (Android)**
3. **Type the Network URL** you copied
4. **Press Go/Enter**

**ChoreCore should load on your phone!** 🎉

---

## Visual Flow Diagram

```
┌─────────────────────┐
│  Install VS Code    │
│  Install Node.js    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Open VS Code       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  File → Open Folder │
│  Select "chorecore" │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Press Ctrl + `     │
│  (opens terminal)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  npm install        │
│  (first time only)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  npm run dev:mobile │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Copy Network URL   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Open on Phone      │
│  (same WiFi!)       │
└─────────────────────┘
```

---

## What Each Command Does

### `npm install`
- Downloads all the code libraries ChoreCore needs
- Only run this ONCE when you first start
- Takes 1-2 minutes

### `npm run dev:mobile`
- Starts a local web server
- Makes ChoreCore accessible on your network
- Keep this running while testing!
- Press `Ctrl + C` to stop

---

## Common Questions

### Q: Where is the terminal?

**A:** It's the panel at the bottom of VS Code. If you don't see it, press `Ctrl` + `` ` ``

### Q: What is "chorecore"?

**A:** It's the folder containing all your ChoreCore project files. It should have files like `App.tsx`, `package.json`, etc.

### Q: Why "npm"?

**A:** npm (Node Package Manager) comes with Node.js. It's how you run JavaScript projects.

### Q: What if I close the terminal?

**A:** The server stops. Just open terminal again and run `npm run dev:mobile` again.

### Q: Do I need to run npm install every time?

**A:** No! Only the first time, or if you add new packages.

### Q: What is the Network URL?

**A:** It's the address that lets your phone connect to your computer. Your computer acts as a web server!

---

## Troubleshooting

### "npm: command not found"

**Problem:** Node.js is not installed.

**Solution:** Download and install from https://nodejs.org/ (choose LTS version)

### "Cannot find module"

**Problem:** Dependencies not installed.

**Solution:** Run `npm install` first.

### "Port 5173 already in use"

**Problem:** Another server is already running.

**Solution:** 
1. Find the other terminal and press `Ctrl + C`
2. Or use a different port: `npm run dev:mobile -- --port 3000`

### Can't access from phone

**Problem:** Different WiFi networks or firewall.

**Solution:**
- Check both devices on same WiFi
- Turn off computer firewall temporarily
- Make sure you copied the full URL including the port (`:5173`)

---

## After Starting Successfully

### Keep the Terminal Open!

Once you run `npm run dev:mobile`, keep that terminal window open. The server runs continuously.

**To stop the server:** Press `Ctrl + C` in the terminal

**To start again:** Run `npm run dev:mobile`

### Making Changes

When you edit code files:
1. Save the file (`Ctrl + S`)
2. The browser automatically refreshes
3. See your changes instantly!

---

## Quick Reference

**First time setup:**
```bash
npm install
```

**Every time you want to start:**
```bash
npm run dev:mobile
```

**To stop:**
```
Press Ctrl + C
```

---

## Alternative: Just Test on Computer First

If you're having trouble with mobile, test on your computer first:

1. Run: `npm run dev` (without `:mobile`)
2. Open browser
3. Go to: `http://localhost:5173/`
4. Test ChoreCore on computer!

---

## Next Steps

Once you have it running:

1. **Create an account** - Use a real email (you'll need to verify)
2. **Configure Supabase emails** - See `START_HERE.md`
3. **Set up database** - See `DATABASE_SETUP.md`
4. **Start using ChoreCore!**

---

## Complete File Checklist

Make sure your chorecore folder has these important files:

- ✅ `package.json` - Lists all dependencies
- ✅ `App.tsx` - Main app file
- ✅ `vite.config.ts` - Build configuration
- ✅ `index.html` - Entry HTML file

If you're missing these, you might be in the wrong folder!

---

## Still Need Help?

Read these guides in order:

1. **RUN_THIS.txt** - Quick visual guide
2. **WHERE_TO_RUN_COMMANDS.md** - Detailed command guide
3. **MOBILE_QUICK_START.md** - Mobile testing
4. **README.md** - Full documentation

---

## Summary in 3 Steps

```
1. Open VS Code → Open chorecore folder
2. Press Ctrl + ` → Type: npm run dev:mobile
3. Copy Network URL → Open on phone browser
```

That's it! 🚀
