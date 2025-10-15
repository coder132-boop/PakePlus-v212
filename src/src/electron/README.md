# Desktop App Icons

This folder contains the application icons for ChoreCore desktop app.

## Required Icons

To build the desktop app, you need to provide the following icon files:

### 1. icon.png
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: Linux AppImage, source for other formats

### 2. icon.ico
- **Size**: Multiple sizes embedded (16, 32, 48, 256)
- **Format**: ICO
- **Usage**: Windows installer and taskbar

### 3. icon.icns
- **Size**: Multiple sizes embedded
- **Format**: ICNS
- **Usage**: macOS DMG and dock

## How to Create Icons

### Option 1: Online Tools

1. Create a 1024x1024 PNG image with your logo
2. Use [iConvert Icons](https://iconverticons.com/online/) to convert to all formats

### Option 2: Command Line Tools

#### Generate .ico (Windows/Linux)
```bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt install imagemagick  # Linux

# Convert PNG to ICO
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### Generate .icns (macOS)
```bash
# Create iconset folder
mkdir ChoreCore.iconset

# Generate all required sizes
sips -z 16 16     icon.png --out ChoreCore.iconset/icon_16x16.png
sips -z 32 32     icon.png --out ChoreCore.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out ChoreCore.iconset/icon_32x32.png
sips -z 64 64     icon.png --out ChoreCore.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out ChoreCore.iconset/icon_128x128.png
sips -z 256 256   icon.png --out ChoreCore.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out ChoreCore.iconset/icon_256x256.png
sips -z 512 512   icon.png --out ChoreCore.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out ChoreCore.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out ChoreCore.iconset/icon_512x512@2x.png

# Create icns file
iconutil -c icns ChoreCore.iconset
mv ChoreCore.icns icon.icns

# Clean up
rm -rf ChoreCore.iconset
```

### Option 3: Use electron-icon-builder

```bash
npm install -g electron-icon-builder

# Place your 1024x1024 icon.png in this folder, then:
electron-icon-builder --input=./icon.png --output=./
```

## Temporary Placeholder

The current `icon.png` is a placeholder. Replace it with your actual ChoreCore logo before building for distribution.

## Design Recommendations

For best results, your icon should:

- Be recognizable at small sizes (16x16)
- Have good contrast
- Avoid fine details
- Use bold, simple shapes
- Match your brand colors (teal/cyan for ChoreCore)
- Work on both light and dark backgrounds

## ChoreCore Icon Suggestion

Consider a stylized icon featuring:
- A house silhouette
- A checkmark or clean symbol
- Teal/cyan gradient (#00C2A8 to #00FFD1)
- Circular or rounded square shape

You can use the ChoreCoreLogo component as inspiration!
