import path from "path";
import { BrowserWindow, Menu, Tray, app, nativeImage, Event } from "electron";

import { setupIPC } from "./backend/api/saves-api";

export class Application {
  private mainWindow: BrowserWindow | null = null;
  private isAppQuitting = false;

  constructor() {}

  init() {
    app.commandLine.appendSwitch("lang", "en-US");
    this.registerProtocolClient();

    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      app.quit();
      return;
    } else {
      app.on("second-instance", (_, commandLine) => {
        // Someone tried to run a second instance, we should focus our window.
        if (!this.mainWindow) {
          return;
        }

        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore();
        }
        this.mainWindow.show();

        const url = commandLine.pop();
        if (!url?.startsWith("cloud-saves://")) {
          return;
        }

        const path = url.replace("cloud-saves://", "/").replace("/?", "?");

        this.mainWindow.webContents.send("deepLink", {
          url: path,
        });
      });
    }

    // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    if (require("electron-squirrel-startup")) {
      this.isAppQuitting = true;
      app.quit();
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", () => {
      this.mainWindow = this.createWindow();
      this.createTray();

      setupIPC();

      app.on("activate", () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.mainWindow = this.createWindow();
          setupIPC();
        }
      });
    });

    // isAppQuitting flag is worth setting at app' before-quit callback, too. This way the application will be closed properly if requested by the OS or user some other way, e.g. via Macos Dock taskbar' quit command.
    app.on("before-quit", () => {
      this.isAppQuitting = true;
    });

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  }

  private registerProtocolClient() {
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient("cloud-saves", process.execPath, [
          path.resolve(process.argv[1]),
        ]);
      }
    } else {
      app.setAsDefaultProtocolClient("cloud-saves");
    }
  }

  private createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      show: false,
      minWidth: 600,
      minHeight: 400,
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
      if (!this.isAppQuitting) {
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
  }

  private createTray() {
    const iconPath = path.join(__dirname, "./assets/electron-icon_16x16.png");
    const icon = nativeImage.createFromPath(iconPath);
    const tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Cloud Saves",
        icon: iconPath,
        enabled: false,
      },
      { type: "separator" },
      { label: "Open", type: "normal", click: () => this.mainWindow?.show() },
      {
        label: "Quit",
        type: "normal",
        click: () => {
          this.isAppQuitting = true;
          app.quit();
        },
      },
    ]);

    tray.setContextMenu(contextMenu);
    tray.setToolTip("Cloud Saves");
    tray.setTitle("Cloud Saves");
    tray.addListener("double-click", () => {
      this.mainWindow?.show();
    });

    return tray;
  }
}
