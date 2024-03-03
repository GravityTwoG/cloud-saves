// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

const electronApi: Window["electronAPI"] = {
  onDeepLink: (callback) => {
    ipcRenderer.on("deepLink", (_, link) => {
      callback(link);
    });
  },

  showFolderDialog: () => ipcRenderer.invoke("showFolderDialog"),

  getSavePaths: (paths) => ipcRenderer.invoke("getSavePaths", paths),

  getFolderInfo: (folderPath) =>
    ipcRenderer.invoke("getFolderInfo", folderPath),

  uploadSave: (folder, game) => ipcRenderer.invoke("uploadSave", folder, game),

  downloadSave: (archiveURL) => ipcRenderer.invoke("downloadSave", archiveURL),

  downloadAndExtractSave: (archiveURL, path) =>
    ipcRenderer.invoke("downloadAndExtractSave", archiveURL, path),

  onGetSyncedSaves: (callback) => {
    ipcRenderer.on("getSyncedSaves", callback);
  },

  sendSyncedSaves: (args) => ipcRenderer.invoke("sendSyncedSaves", args),
};

contextBridge.exposeInMainWorld("electronAPI", electronApi);
