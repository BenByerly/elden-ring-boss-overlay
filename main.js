const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let overlay, visible = false;
const stateFile = path.join(app.getPath('userData'), 'boss_state.json');

function createOverlay() {
  overlay = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: false,
    skipTaskbar: false, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  overlay.loadFile('index.html');
  //overlay.webContents.openDevTools();
  overlay.hide();
}

app.whenReady().then(() => {
  createOverlay();

  globalShortcut.register('`', () => {
    visible = !visible;
    visible ? overlay.show() : overlay.hide();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());

// Save/load state
ipcMain.handle('load-state', () => {
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
  } catch {
    return {};
  }
});

ipcMain.on('save-state', (_, state) => {
  fs.writeFileSync(stateFile, JSON.stringify(state));
});

// Window control IPC handlers
ipcMain.on('minimize-window', () => {
  if (overlay) overlay.minimize();
});

ipcMain.on('maximize-window', () => {
  if (overlay) {
    overlay.isMaximized() ? overlay.unmaximize() : overlay.maximize();
  }
});

ipcMain.on('close-window', () => {
  if (overlay) overlay.close();
});
