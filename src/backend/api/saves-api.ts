import { dialog, ipcMain } from "electron";

import { getFolderInfo } from "../saves/getFolderInfo";
import { getSavePaths } from "../saves/getSavePaths";
import { uploadSave } from "../saves/uploadSave";
import { downloadAndExtractSave, downloadSave } from "../saves/downloadSave";

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

  ipcMain.handle(
    "uploadSave",
    async (_, folder: { path: string; name: string }) => {
      try {
        await uploadSave(folder);
        return { data: null };
      } catch (error) {
        return { data: null, error: (error as Error).toString() };
      }
    }
  );

  ipcMain.handle("downloadSave", async (_, url: string) => {
    try {
      await downloadSave(url);
      return { data: null };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });

  ipcMain.handle("downloadAndExtractSave", async (_, path: string) => {
    try {
      await downloadAndExtractSave(path);
      return { data: null };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });

  // ipcMain.handle(
  //   "toggleSync",
  //   async (_, { path, enabled }: { path: string; enabled: boolean }) => {
  //     try {
  //       await toggleSync(path, enabled);
  //       return { data: null };
  //     } catch (error) {
  //       return { data: null, error: (error as Error).toString() };
  //     }
  //   }
  // );
}
