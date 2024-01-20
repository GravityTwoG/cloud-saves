// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

const electronApi: Window["electronAPI"] = {
  showFolderDialog: () => ipcRenderer.invoke("showFolderDialog"),
  getSavePaths: () => ipcRenderer.invoke("getSavePaths"),
  getFolderInfo: (folderPath: string) =>
    ipcRenderer.invoke("getFolderInfo", folderPath),
  uploadSave: (path: string) => ipcRenderer.invoke("uploadSave", path),
};

contextBridge.exposeInMainWorld("electronAPI", electronApi);
