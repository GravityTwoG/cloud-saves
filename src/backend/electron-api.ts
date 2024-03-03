import { dialog, ipcMain } from "electron";
import { Game, GamePath } from "@/types";

import { getFolderInfo } from "./fs/getFolderInfo";
import { getSavePaths } from "./fs/getSavePaths";
import { savesManager } from ".";

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

  ipcMain.handle("getSavePaths", async (_, paths: GamePath[]) => {
    try {
      const filteredPaths = await getSavePaths(paths);
      return { data: filteredPaths };
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
    async (
      _,
      folder: { gameId: string; path: string; name: string },
      game: Game
    ) => {
      try {
        const data = await savesManager.uploadSave(folder, game);
        return { data };
      } catch (error) {
        return { data: null, error: (error as Error)?.toString() };
      }
    }
  );

  ipcMain.handle("downloadSave", async (_, archiveURL: string) => {
    try {
      await savesManager.downloadSave(archiveURL);
      return { data: null };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  });

  ipcMain.handle(
    "downloadAndExtractSave",
    async (_, archiveURL: string, path: string) => {
      try {
        await savesManager.downloadAndExtractSave(archiveURL, path);
        return { data: null };
      } catch (error) {
        return { data: null, error: (error as Error).toString() };
      }
    }
  );
}
