// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

const electronApi: Window["electronAPI"] = {
  showFolderDialog: () => ipcRenderer.invoke("showFolderDialog"),

  getSavePaths: (paths: string[]) => ipcRenderer.invoke("getSavePaths", paths),

  getFolderInfo: (folderPath: string) =>
    ipcRenderer.invoke("getFolderInfo", folderPath),

  uploadSave: (folder: { path: string; name: string }) =>
    ipcRenderer.invoke("uploadSave", folder),

  downloadAndExtractSave: (path: string) =>
    ipcRenderer.invoke("downloadAndExtractSave", path),
};

contextBridge.exposeInMainWorld("electronAPI", electronApi);
