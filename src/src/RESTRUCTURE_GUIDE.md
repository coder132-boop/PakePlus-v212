# ChoreCore - PakePlus Restructuring Guide

This guide explains the optimized folder structure for PakePlus packaging.

## 🎯 What is PakePlus?

PakePlus is a lightweight tool that turns web applications into native desktop apps. Unlike Electron:
- **Smaller**: ~5-10MB instead of ~80MB
- **Faster**: Uses system browser engine
- **Simpler**: One config file instead of multiple scripts
- **Cross-platform**: Builds for Windows, macOS, and Linux

## 📁 New Folder Structure

### Recommended Structure

```
chorecore/
├── 📄 package.json              # Dependencies
├── 📄 pakeplus.json             # PakePlus configuration
├── 📄 vite.config.ts            # Build config
├── 📄 tsconfig.json             # TypeScript config
├── 📄 index.html                # HTML entry
├── 📄 .gitignore                # Git ignore
├── 📄 README.md                 # Project readme
│
├── 📁 src/                      # Source code (NEW)
│   ├── App.tsx                  # Main component
│   ├── main.tsx                 # Entry point
│   │
│   ├── 📁 components/           # React components
│   │   ├── AboutPage.tsx
│   │   ├── AssignChores.tsx
│   │   ├── ... (all components)
│   │   ├── 📁 ui/               # shadcn components
│   │   └── 📁 figma/            # Figma utilities
│   │
│   ├── 📁 contexts/             # React contexts
│   │   ├── TaskContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── 📁 utils/                # Utilities
│   │   ├── databaseChecker.ts
│   │   └── 📁 supabase/
│   │       ├── client.ts
│   │       └── info.tsx
│   │
│   └── 📁 styles/               # CSS
│       └── globals.css
│
├── 📁 public/                   # Static assets
│   ├── icon.png                 # App icon (512x512+)
│   ├── tray-icon.png            # System tray icon
│   └── favicon.ico              # Browser favicon
│
├── 📁 docs/                     # Documentation
│   ├── README.md
│   ├── AUTHENTICATION.md
│   ├── DESKTOP_APP.md
│   └── TESTING_GUIDE.md
│
├── 📁 supabase/                 # Backend (unchanged)
│   └── functions/
│       └── server/
│
└── 📁 _archive/                 # Old documentation
    └── (60+ old .md files)
```

## 🔄 Migration Steps

### Step 1: Create New Folders

```bash
mkdir -p src
mkdir -p public
mkdir -p _archive
```

### Step 2: Move Source Files

```bash
# Move main files to src/
mv App.tsx src/
mv main.tsx src/

# Move folders to src/
mv components src/
mv contexts src/
mv utils src/
mv styles src/
```

### Step 3: Archive Old Documentation

```bash
# Move all old markdown files to archive
mv ADMIN_ACCESS.md _archive/
mv ALL_FIXED.md _archive/
mv ANSWER_TO_YOUR_QUESTION.md _archive/
# ... (repeat for all 60+ old .md files)

# Keep only essential docs in root
# - README.md
# - SETUP_INSTRUCTIONS.md
# - pakeplus.json
```

### Step 4: Update Import Paths

Since we moved files to `/src`, update imports:

**Before:**
```typescript
import { Component } from './components/Component';
import { useContext } from './contexts/Context';
```

**After:**
```typescript
import { Component } from '@/components/Component';
import { useContext } from '@/contexts/Context';
```

The `@` alias is already configured in `vite.config.ts`.

### Step 5: Create Public Assets

Add these files to `/public`:

1. **icon.png** (512x512 or larger)
   - Used for app icon
   - PNG with transparency
   - Should be ChoreCore logo

2. **tray-icon.png** (32x32)
   - Used for system tray
   - Simple, recognizable at small size

3. **favicon.ico** (optional)
   - Browser tab icon

## 🚀 Building with PakePlus

### Install PakePlus

```bash
npm install -g pakeplus
# or
cargo install pakeplus
```

### Development Build

```bash
# Build the web app first
npm run build

# Preview locally
npm run preview

# Note the URL (e.g., http://localhost:4173)
```

### Create Desktop App

```bash
# Build for current platform
pakeplus http://localhost:4173 --name ChoreCore --config pakeplus.json

# Or build for specific platform
pakeplus http://localhost:4173 --name ChoreCore --target deb       # Linux .deb
pakeplus http://localhost:4173 --name ChoreCore --target appimage  # Linux AppImage
pakeplus http://localhost:4173 --name ChoreCore --target nsis      # Windows installer
pakeplus http://localhost:4173 --name ChoreCore --target dmg       # macOS disk image
```

### Production Build

For production, use your deployed URL:

```bash
pakeplus https://your-chorecore-app.com --name ChoreCore --config pakeplus.json
```

## 📦 NPM Scripts for PakePlus

Update `package.json` to include:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "pake:dev": "vite build && vite preview",
    "pake:build": "vite build && pakeplus http://localhost:4173 --config pakeplus.json",
    "pake:build:deb": "npm run build && pakeplus http://localhost:4173 --target deb --config pakeplus.json",
    "pake:build:appimage": "npm run build && pakeplus http://localhost:4173 --target appimage --config pakeplus.json",
    "pake:build:nsis": "npm run build && pakeplus http://localhost:4173 --target nsis --config pakeplus.json",
    "pake:build:dmg": "npm run build && pakeplus http://localhost:4173 --target dmg --config pakeplus.json"
  }
}
```

Then use:

```bash
npm run pake:build          # Build for current platform
npm run pake:build:deb      # Linux .deb
npm run pake:build:nsis     # Windows installer
npm run pake:build:dmg      # macOS disk image
```

## 🎨 Icons for PakePlus

### Required Icons

1. **App Icon** (`public/icon.png`)
   - Size: 512x512 or larger (1024x1024 recommended)
   - Format: PNG with transparency
   - Content: ChoreCore logo with teal/cyan gradient

2. **Tray Icon** (`public/tray-icon.png`)
   - Size: 32x32 pixels
   - Format: PNG with transparency
   - Content: Simple, monochrome version of logo

### Creating Icons

**Option 1: Use Online Tool**
1. Create main icon at 1024x1024
2. Use [TinyPNG](https://tinypng.com) to optimize
3. Resize for tray icon

**Option 2: Command Line**
```bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt install imagemagick  # Linux

# Create tray icon from main icon
convert public/icon.png -resize 32x32 public/tray-icon.png
```

## ⚙️ Configuration Options

### pakeplus.json Options

```json
{
  "name": "ChoreCore",                    // App name
  "productName": "ChoreCore Desktop",     // Display name
  "icon": "public/icon.png",              // App icon path
  "url": "http://localhost:5173",         // App URL
  "width": 1200,                          // Window width
  "height": 800,                          // Window height
  "resizable": true,                      // Allow resize
  "fullscreen": false,                    // Start fullscreen
  "showMenu": false,                      // Show menu bar
  "showSystemTray": true,                 // Show in system tray
  "alwaysOnTop": false,                   // Always on top
  "transparent": false,                   // Transparent window
  "skipTaskbar": false,                   // Hide from taskbar
  "multiArch": true,                      // Build for multiple architectures
  "targets": ["deb", "nsis", "dmg"]       // Build targets
}
```

## 🔧 Troubleshooting

### Build Fails

**"Cannot find icon"**
- Ensure `public/icon.png` exists
- Check path in `pakeplus.json`

**"URL not accessible"**
- Run `npm run build && npm run preview` first
- Ensure preview server is running
- Check the URL matches

**"Permission denied"**
```bash
# macOS/Linux
chmod +x build-script.sh
```

### App Won't Start

**"White screen"**
- Verify web build works: `npm run build && npm run preview`
- Check browser console for errors
- Ensure all assets are in `/public`

**"Module not found"**
- Update import paths to use `@/` alias
- Rebuild: `npm run build`

## 📊 PakePlus vs Electron

| Feature | PakePlus | Electron |
|---------|----------|----------|
| Bundle Size | 5-10 MB | 80-150 MB |
| Build Speed | Fast (seconds) | Slow (minutes) |
| Dependencies | None/Minimal | Many |
| Complexity | Simple | Complex |
| Node.js Access | Limited | Full |
| Best For | Web apps | Native features |

**Use PakePlus for ChoreCore because:**
- ✅ ChoreCore is primarily a web app
- ✅ No need for Node.js filesystem access
- ✅ Smaller download for users
- ✅ Faster builds
- ✅ Simpler maintenance

## 🎯 Recommended Workflow

1. **Develop** → `npm run dev`
2. **Test Web Build** → `npm run build && npm run preview`
3. **Test Desktop** → `npm run pake:dev`
4. **Build Desktop** → `npm run pake:build`
5. **Distribute** → Share the generated installer

## 📚 Next Steps

After restructuring:

1. ✅ Move files to new structure
2. ✅ Update imports to use `@/` alias
3. ✅ Create icons in `/public`
4. ✅ Configure `pakeplus.json`
5. ✅ Archive old documentation
6. ✅ Test web build
7. ✅ Test desktop build
8. ✅ Distribute!

---

**PakePlus makes desktop distribution simple and lightweight!** 🚀

For more info: [PakePlus Documentation](https://github.com/tw93/Pake)
