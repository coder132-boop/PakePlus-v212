/**
 * Preload script for ChoreCore Desktop
 * This runs in the renderer process before web content begins loading
 * Provides a secure bridge between main and renderer processes
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electron', {
  // App info
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
  
  // Future API methods can be added here
  // Example: notifications, file system access, etc.
});

// Log that preload script loaded successfully
console.log('ChoreCore Desktop Preload Script Loaded');
console.log('Context Isolation:', process.contextIsolated);
