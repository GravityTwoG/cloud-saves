import { BrowserWindow, dialog, ipcMain } from "electron";
import electronDl from "electron-dl";
import { Game, GamePath, GameState } from "@/types";

import { getFolderInfo } from "./fs/getFolderInfo";
import { getStatePaths } from "./fs/getStatePaths";
import { statesManager } from ".";
import { downloadToFolder } from "./fs/downloadToFolder";

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
      const filteredPaths = await getStatePaths(paths);
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
        const data = await statesManager.uploadState(folder, game);
        return { data };
      } catch (error) {
        return { data: null, error: (error as Error)?.toString() };
      }
    }
  );

  ipcMain.handle("downloadState", async (_, gameState: GameState) => {
    try {
      await statesManager.downloadState(gameState);
    } catch (error) {
      if (error instanceof electronDl.CancelError) {
        console.info("item.cancel() was called");
      } else {
        console.error(error);
      }
    }
  });

  ipcMain.handle("downloadStateAs", async (_, gameState: GameState) => {
    try {
      const win = BrowserWindow.getFocusedWindow();
      if (!win) {
        return;
      }

      const customPath = await dialog.showOpenDialog({
        title: "Download",
        defaultPath: gameState.localPath,
        properties: ["openDirectory"],
      });
      if (customPath.canceled || !customPath.filePaths[0]) {
        return;
      }

      await downloadToFolder(
        gameState.archiveURL,
        customPath.filePaths[0],
        `${gameState.name}-archive.zip`
      );
    } catch (error) {
      if (error instanceof electronDl.CancelError) {
        console.info("item.cancel() was called");
      } else {
        console.error(error);
      }
    }
  });
}
