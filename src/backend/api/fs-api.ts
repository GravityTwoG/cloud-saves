import { dialog, ipcMain } from "electron";
import { getFolderInfo } from "../fs/getFolderInfo";
import { getSavePaths } from "../fs/getSavePaths";
import { uploadSave } from "../fs/uploadSave";

export function setupIPC() {
  ipcMain.handle("showFolderDialog", async () => {
    try {
      const obj = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      if (obj.canceled) {
        return { data: null, error: "cancelled" };
      }

      return { data: getFolderInfo(obj.filePaths[0]) };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });

  ipcMain.handle("getSavePaths", async () => {
    try {
      const paths = await getSavePaths();
      return { data: paths };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });

  ipcMain.handle("getFolderInfo", async (_, folderPath: string) => {
    try {
      const info = getFolderInfo(folderPath);

      return { data: info };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });

  ipcMain.handle("uploadSave", async (_, path: string) => {
    try {
      await uploadSave(path);
      return { data: null };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });
}
