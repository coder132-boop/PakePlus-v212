# Desktop App Guide

This guide explains how to package ChoreCore as a standalone desktop application using Electron.

## Why Desktop?

A desktop app provides:

- Native OS integration
- Offline capability (future enhancement)
- Standalone executable (no browser needed)
- System tray integration
- Auto-updates
- Better performance

## Quick Setup with Electron

### 1. Install Electron Dependencies

```bash
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

### 2. Electron Configuration

The project includes pre-configured Electron files:

- `/electron/main.js` - Main Electron process
- `/electron/preload.js` - Preload script for security
- `/electron-builder.json` - Build configuration

### 3. Build Desktop App

```bash
# Build for current platform
npm run electron:build

# Build for specific platforms
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
npm run electron:build:all    # All platforms
```

### 4. Development

To run in desktop mode during development:

```bash
npm run electron:dev
```

This starts both Vite dev server and Electron window.

## Distribution

After building, you'll find installers in the `/dist-electron` folder:

- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` or `.deb` package

### File Sizes

Expect the following approximate sizes:

- Windows: ~80MB
- macOS: ~100MB  
- Linux: ~90MB

The size includes Chromium runtime and Node.js.

## Platform-Specific Notes

### Windows

- Code-signed builds require a certificate (optional)
- Installer supports silent installation
- Auto-update works out of the box

### macOS

- Requires Apple Developer account for code signing
- Notarization needed for distribution outside App Store
- Universal build supports both Intel and Apple Silicon

### Linux

- AppImage is most portable format
- .deb for Debian/Ubuntu
- .rpm for Fedora/Red Hat
- Snap and Flatpak also supported

## Advanced Configuration

### Custom Icons

Replace the following files:

- `/electron/icon.png` - App icon (1024x1024)
- `/electron/icon.ico` - Windows icon
- `/electron/icon.icns` - macOS icon

### Auto-Updates

Electron Builder supports auto-updates via:

- GitHub Releases (free)
- Custom update server
- S3 bucket

Configure in `electron-builder.json`:

```json
{
  "publish": {
    "provider": "github",
    "owner": "your-username",
    "repo": "chorecore"
  }
}
```

### Custom Title Bar

ChoreCore uses a frameless window with custom title bar for better UX. Customize in `/electron/main.js`.

### System Tray

The app minimizes to system tray when closed. Users can:

- Click tray icon to restore window
- Right-click for quick actions
- Auto-start with OS (optional)

## Troubleshooting

### Build Fails

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Electron cache: `rm -rf ~/.electron`
3. Update Electron: `npm update electron electron-builder`

### App Won't Start

1. Check console for errors: `npm run electron:dev`
2. Verify Vite build: `npm run build`
3. Clear app data in OS

### White Screen on Launch

1. Ensure `dist/index.html` exists
2. Check file:// protocol in main.js
3. Verify baseUrl in vite.config.ts

## Security Considerations

ChoreCore desktop app follows Electron security best practices:

1. ✅ Context isolation enabled
2. ✅ Node integration disabled in renderer
3. ✅ Preload script for controlled API access
4. ✅ CSP headers configured
5. ✅ Remote code execution blocked
6. ✅ Secure webPreferences

## Production Checklist

Before distributing:

- [ ] Update version in package.json
- [ ] Update app icons
- [ ] Configure code signing
- [ ] Test on target platforms
- [ ] Setup auto-update mechanism
- [ ] Create release notes
- [ ] Test installer/uninstaller
- [ ] Verify app signature

## Alternative: Tauri

For smaller bundle sizes (~15MB), consider [Tauri](https://tauri.app) instead of Electron:

```bash
npm install --save-dev @tauri-apps/cli @tauri-apps/api
npm run tauri init
npm run tauri build
```

Tauri uses the OS's native WebView instead of bundling Chromium.

---

**Need help?** Check the [Electron documentation](https://electronjs.org/docs) or [Electron Builder docs](https://electron.build).
