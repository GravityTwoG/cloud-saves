import path from "path";
import {
  BrowserWindow,
  Menu,
  Tray,
  app,
  nativeImage,
  Event,
  ipcMain,
} from "electron";
import electronDl from "electron-dl";

import { SyncManager } from "./backend/SyncManager";
import { syncManager, electronAPI } from "./backend";

const protocolName = "cloud-saves";
const clientProtocol = `${protocolName}://`;

export class Application {
  private mainWindow: BrowserWindow | null = null;
  private isAppQuitting = false;
  private syncManager: SyncManager = syncManager;
  private titleBarBackgroundColor: string = "#00000000";
  private titleBarSymbolColor: string = "#000";

  constructor() {}

  init() {
    app.commandLine.appendSwitch("lang", "en-US");
    this.registerProtocolClient();
    electronDl();

    this.syncManager.init(() => {
      this.mainWindow?.webContents.send("getSyncedStates");
    });

    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      this.quitApp();
      return;
    } else {
      this.onDeepLink();
    }

    // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    if (require("electron-squirrel-startup")) {
      this.isAppQuitting = true;
      this.quitApp();
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", () => {
      this.mainWindow = this.createWindow();
      this.createTray();
      this.setupIPC();

      app.on("activate", () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.mainWindow = this.createWindow();
          this.setupIPC();
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
        this.quitApp();
      }
    });
  }

  private onDeepLink() {
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
      if (!url?.startsWith(clientProtocol)) {
        return;
      }

      const path = url.replace(clientProtocol, "/").replace("/?", "?");
      this.mainWindow.webContents.send("deepLink", {
        url: path,
      });
    });
  }

  private setupIPC() {
    function registerHandler<T extends unknown[], R>(
      name: string,
      handler: (...args: T) => R,
    ) {
      ipcMain.handle(name, async (_, ...args: unknown[]) => {
        try {
          return await handler(...(args as T));
        } catch (error) {
          console.error(error);
          return { data: null, error: (error as Error).toString() };
        }
      });
    }

    registerHandler("showFolderDialog", electronAPI.showFolderDialog);

    registerHandler("getStatePaths", electronAPI.getStatePaths);

    registerHandler("getFolderInfo", electronAPI.getFolderInfo);

    registerHandler("uploadState", electronAPI.uploadState);

    registerHandler("reuploadState", electronAPI.reuploadState);

    registerHandler("downloadState", electronAPI.downloadState);

    registerHandler("downloadStateAs", electronAPI.downloadStateAs);

    registerHandler("getAppVersion", electronAPI.getAppVersion);

    registerHandler<
      Parameters<Window["electronAPI"]["setTitleBarSettings"]>,
      void
    >(
      "setTitleBarSettings",
      (settings) =>
        this.mainWindow?.setTitleBarOverlay &&
        this.mainWindow?.setTitleBarOverlay({
          color: settings.backgroundColor,
          symbolColor: settings.symbolColor,
        }),
    );
  }

  private registerProtocolClient() {
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(protocolName, process.execPath, [
          path.resolve(process.argv[1]),
        ]);
      }
    } else {
      app.setAsDefaultProtocolClient(protocolName);
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
      minWidth: 640,
      minHeight: 400,
      titleBarStyle: "hidden",
      titleBarOverlay: {
        color: this.titleBarBackgroundColor,
        symbolColor: this.titleBarSymbolColor,
        height: 32,
      },
    });
    mainWindow.removeMenu();

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
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
          this.quitApp();
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

  private quitApp() {
    app.quit();
    this.syncManager?.stop();
  }
}
