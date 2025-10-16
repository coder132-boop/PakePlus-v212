# ChoreCore - PakePlus Setup Guide

**Quick guide to package ChoreCore as a lightweight desktop app using PakePlus.**

---

## 🎯 Why PakePlus?

PakePlus is perfect for ChoreCore because:
- ✅ **Tiny size**: 5-10MB vs 80MB+ with Electron
- ✅ **Fast builds**: Seconds instead of minutes
- ✅ **Simple**: One config file, no complex setup
- ✅ **Native**: Uses system browser engine
- ✅ **Cross-platform**: Windows, macOS, Linux

---

## 📦 Installation

### Install PakePlus

**Option 1: Pre-built Binary** (Recommended)
```bash
# macOS/Linux
curl -fsSL https://github.com/tw93/Pake/releases/latest/download/install.sh | bash

# Or download from: https://github.com/tw93/Pake/releases
```

**Option 2: Using Cargo** (if you have Rust installed)
```bash
cargo install pake-cli
```

**Option 3: Using NPM** (wrapper)
```bash
npm install -g pakeplus-cli
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Build Your Web App

```bash
npm install
npm run build
```

### Step 2: Preview Locally

```bash
npm run preview
```

Note the URL (usually `http://localhost:4173`)

### Step 3: Create Desktop App

```bash
pake http://localhost:4173 --name ChoreCore --config pakeplus.json
```

**Done!** Your app is in the `/output` folder!

---

## 🎨 Add Icons (Recommended)

### Create Icons

1. **Main Icon** (`public/icon.png`)
   - Create 512x512 PNG of ChoreCore logo
   - Teal/cyan gradient (#00C2A8 to #00FFD1)
   - Transparent background

2. **Tray Icon** (`public/tray-icon.png`)
   - 32x32 PNG
   - Simple, monochrome version
   - Transparent background

### Quick Icon Creation

**Using Online Tools:**
- [Canva](https://canva.com) - Create logo
- [TinyPNG](https://tinypng.com) - Optimize
- [iConvert Icons](https://iconverticons.com) - Resize

**Using Command Line:**
```bash
# Resize main icon to 512x512
convert logo.png -resize 512x512 public/icon.png

# Create tray icon from main icon
convert public/icon.png -resize 32x32 public/tray-icon.png
```

---

## ⚙️ Configuration

Your `pakeplus.json` is pre-configured:

```json
{
  "name": "ChoreCore",
  "icon": "public/icon.png",
  "width": 1200,
  "height": 800,
  "resizable": true,
  "fullscreen": false,
  "showSystemTray": true,
  "targets": ["deb", "appimage", "nsis", "dmg"]
}
```

**Customize if needed:**
- Change window size: `width`, `height`
- Disable system tray: `"showSystemTray": false`
- Change build targets: add/remove from `targets` array

---

## 🔨 Building for Different Platforms

### Linux

**Debian/Ubuntu (.deb)**
```bash
pake http://localhost:4173 --name ChoreCore --target deb
```

**AppImage (universal)**
```bash
pake http://localhost:4173 --name ChoreCore --target appimage
```

### Windows

**NSIS Installer (.exe)**
```bash
pake http://localhost:4173 --name ChoreCore --target nsis
```

### macOS

**DMG Disk Image**
```bash
pake http://localhost:4173 --name ChoreCore --target dmg
```

### All Platforms

```bash
pake http://localhost:4173 --name ChoreCore --config pakeplus.json
# Builds for all targets in config
```

---

## 🌐 Production Build (Deployed URL)

For production, package your already-deployed website:

```bash
# Deploy to web first
npm run build
# Upload /dist to Vercel, Netlify, etc.

# Then package deployed URL
pake https://your-chorecore-app.com --name ChoreCore --config pakeplus.json
```

**Benefits of using deployed URL:**
- ✅ Users always get latest version
- ✅ No need to rebuild desktop app for updates
- ✅ Smaller app size (no bundled files)
- ✅ Easier maintenance

---

## 📝 NPM Scripts

Use these convenient commands:

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview build locally

# PakePlus
npm run pake:dev         # Build and preview (ready for packaging)
npm run pake:build       # Build and show packaging command
```

---

## 🎯 Recommended Workflow

### For Testing
1. `npm run dev` - Develop
2. `npm run build` - Build
3. `npm run preview` - Test build
4. `pake http://localhost:4173 --name ChoreCore` - Quick test

### For Distribution
1. Deploy to web (Vercel/Netlify)
2. Test deployed site works
3. `pake https://your-site.com --name ChoreCore --config pakeplus.json`
4. Test generated app
5. Distribute to users

---

## 📊 File Sizes

**PakePlus vs Electron:**

| Platform | PakePlus | Electron |
|----------|----------|----------|
| Windows | ~8 MB | ~80 MB |
| macOS | ~6 MB | ~100 MB |
| Linux | ~5 MB | ~90 MB |

**ChoreCore will be ~5-10MB!** 🎉

---

## 🔧 Troubleshooting

### "Command not found: pake"

```bash
# Reinstall PakePlus
curl -fsSL https://github.com/tw93/Pake/releases/latest/download/install.sh | bash

# Or add to PATH
export PATH="$HOME/.pake/bin:$PATH"
```

### "Cannot connect to URL"

- Ensure `npm run preview` is running
- Check the preview URL matches your pake command
- Try with explicit port: `pake http://localhost:4173`

### "Icon not found"

- Verify `public/icon.png` exists
- Use absolute path: `pake ... --icon /full/path/to/icon.png`
- Or remove icon flag to use default

### "Build fails"

```bash
# Clear cache
rm -rf output/
rm -rf dist/

# Rebuild
npm run build
npm run preview
pake http://localhost:4173 --name ChoreCore
```

---

## 🎨 Customization Options

### Window Options
```bash
pake <url> \
  --name ChoreCore \
  --width 1400 \
  --height 900 \
  --fullscreen \
  --always-on-top
```

### Icons & Branding
```bash
pake <url> \
  --name ChoreCore \
  --icon public/icon.png \
  --identifier com.chorecore.app
```

### Build Options
```bash
pake <url> \
  --name ChoreCore \
  --target nsis \
  --multi-arch \
  --no-pkg
```

See all options: `pake --help`

---

## 📦 Distribution

### Where to Find Your App

After building, check:
```
output/
├── ChoreCore-1.0.0-x86_64.AppImage    # Linux AppImage
├── ChoreCore_1.0.0_amd64.deb          # Debian/Ubuntu
├── ChoreCore-Setup-1.0.0.exe          # Windows installer
└── ChoreCore-1.0.0.dmg                # macOS disk image
```

### Distribute to Users

**Option 1: Direct Download**
- Host files on your website
- Users download and install

**Option 2: GitHub Releases**
- Upload to GitHub Releases
- Users download from GitHub

**Option 3: App Stores** (Advanced)
- Microsoft Store (Windows)
- Snap Store (Linux)
- Mac App Store (macOS)

---

## 🆚 PakePlus vs Electron

**When to use PakePlus (ChoreCore!):**
- ✅ Web app with no native features needed
- ✅ Want small download size
- ✅ Simple packaging
- ✅ Quick iteration

**When to use Electron:**
- ❌ Need filesystem access
- ❌ Need native modules
- ❌ Complex system integration

**For ChoreCore, PakePlus is perfect!** We're a web app that just needs a native window.

---

## 📚 Resources

- [PakePlus GitHub](https://github.com/tw93/Pake)
- [PakePlus Documentation](https://github.com/tw93/Pake/blob/master/README.md)
- [Example Apps](https://github.com/tw93/Pake/blob/master/README.md#popular-packages)

---

## ✅ Quick Reference

```bash
# Install PakePlus
curl -fsSL https://github.com/tw93/Pake/releases/latest/download/install.sh | bash

# Build web app
npm run build && npm run preview

# Create desktop app (local)
pake http://localhost:4173 --name ChoreCore --config pakeplus.json

# Create desktop app (production)
pake https://your-chorecore-app.com --name ChoreCore --config pakeplus.json

# Platform-specific
pake <url> --name ChoreCore --target deb        # Linux .deb
pake <url> --name ChoreCore --target appimage   # Linux AppImage
pake <url> --name ChoreCore --target nsis       # Windows
pake <url> --name ChoreCore --target dmg        # macOS
```

---

## 🎉 That's It!

ChoreCore is now a lightweight desktop app!

**Next steps:**
1. Create proper icons for branding
2. Test on all platforms
3. Distribute to users
4. Enjoy the tiny file size! 🚀

---

**Made with ❤️ for cleaner homes**  
*ChoreCore - Smart Habits, Clean Homes* 🏠✨
