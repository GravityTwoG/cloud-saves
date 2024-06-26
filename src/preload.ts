// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

const electronApi: Window["electronAPI"] = {
  showFolderDialog: () => ipcRenderer.invoke("showFolderDialog"),

  getStatePaths: (paths) => ipcRenderer.invoke("getStatePaths", paths),

  getFolderInfo: (folderPath) =>
    ipcRenderer.invoke("getFolderInfo", folderPath),

  onDeepLink: (callback) => {
    const listener = (_: unknown, link: Parameters<typeof callback>[0]) => {
      callback(link);
    };
    ipcRenderer.on("deepLink", listener);
    return () => ipcRenderer.removeListener("deepLink", listener);
  },

  onGetSyncedStates: (callback) => {
    ipcRenderer.on("getSyncedStates", callback);
    return () => ipcRenderer.removeListener("getSyncedStates", callback);
  },

  sendSyncedStates: (args) => ipcRenderer.invoke("sendSyncedStates", args),

  uploadState: (folder) => ipcRenderer.invoke("uploadState", folder),

  reuploadState: (gameState) => ipcRenderer.invoke("reuploadState", gameState),

  downloadState: (gameState) => ipcRenderer.invoke("downloadState", gameState),

  downloadStateAs: (gameState) =>
    ipcRenderer.invoke("downloadStateAs", gameState),

  getAppVersion: () => ipcRenderer.invoke("getAppVersion"),

  setTitleBarSettings: (settings) =>
    ipcRenderer.invoke("setTitleBarSettings", settings),
};

contextBridge.exposeInMainWorld("electronAPI", electronApi);
