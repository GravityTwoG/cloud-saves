import path from "path";
import { app, BrowserWindow, nativeImage, Menu, Tray, Event } from "electron";

import { setupIPC } from "./backend/api/fs-api";

let isAppQuitting = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  isAppQuitting = true;
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    // frame: false, // remove title bar
  });
  mainWindow.removeMenu();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on("close", (event: Event) => {
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  });

  return mainWindow;
};

let tray;

const createTray = (mainWindow: BrowserWindow) => {
  const iconPath = path.join(__dirname, "./assets/electron-icon_16x16.png");
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Cloud Saves",
      icon: iconPath,
      enabled: false,
    },
    { type: "separator" },
    { label: "Open", type: "normal", click: () => mainWindow.show() },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        isAppQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Cloud Saves");
  tray.setTitle("Cloud Saves title");
  tray.addListener("double-click", () => {
    mainWindow.show();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  const mainWindow = createWindow();
  createTray(mainWindow);

  setupIPC();

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// isAppQuitting flag is worth setting at app' before-quit callback, too. This way the application will be closed properly if requested by the OS or user some other way, e.g. via Macos Dock taskbar' quit command.
app.on("before-quit", () => {
  isAppQuitting = true;
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
