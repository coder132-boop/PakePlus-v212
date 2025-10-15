const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let tray;

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'ChoreCore - The Core of Clean',
    backgroundColor: '#f0fdfa', // Teal-50 from Tailwind
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    // Development: load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready to avoid flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Minimize to tray instead of closing
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Cleanup
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Create system tray icon
 */
function createTray() {
  const iconPath = path.join(__dirname, 'icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show ChoreCore',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('ChoreCore - The Core of Clean');
  tray.setContextMenu(contextMenu);

  // Single click to show window (Windows/Linux)
  tray.on('click', () => {
    mainWindow.show();
  });
}

/**
 * App lifecycle events
 */

// When Electron has finished initialization
app.whenReady().then(() => {
  createWindow();
  createTray();

  // On macOS, re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow.show();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Before quitting, clean up
app.on('before-quit', () => {
  app.isQuitting = true;
});

// Security: prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Allow navigation to localhost in dev mode
    if (isDev && parsedUrl.hostname === 'localhost') {
      return;
    }
    
    // Block all other navigation
    event.preventDefault();
  });

  // Prevent opening new windows
  contents.setWindowOpenHandler(({ url }) => {
    // Allow opening external links in default browser
    const { shell } = require('electron');
    shell.openExternal(url);
    return { action: 'deny' };
  });
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Log app info
console.log('ChoreCore Desktop Starting...');
console.log('Platform:', process.platform);
console.log('Electron:', process.versions.electron);
console.log('Chrome:', process.versions.chrome);
console.log('Node:', process.versions.node);
