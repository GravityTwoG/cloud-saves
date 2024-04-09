import { BrowserWindow, app, dialog } from "electron";
import electronDl from "electron-dl";

import { GamePath, GameState } from "@/types";
import { getFolderInfo } from "./fs/getFolderInfo";
import { getStatePaths } from "./fs/getStatePaths";
import { downloadToFolder } from "./fs/downloadToFolder";
import { statesManager } from ".";

export const electronAPI: Omit<
  Window["electronAPI"],
  "sendSyncedStates" | "onGetSyncedStates" | "onDeepLink"
> = {
  showFolderDialog: async () => {
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
  },

  getFolderInfo: async (folderPath: string) => {
    try {
      const info = getFolderInfo(folderPath);

      return { data: info };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  },

  getStatePaths: async (paths: GamePath[]) => {
    try {
      const filteredPaths = await getStatePaths(paths);
      return { data: filteredPaths };
    } catch (error) {
      return { data: null, error: (error as Error).toString() };
    }
  },

  uploadState: async (state: {
    gameId?: string;
    localPath: string;
    name: string;
    isPublic: boolean;
  }) => {
    try {
      const data = await statesManager.uploadState(state);
      return { data };
    } catch (error) {
      return { data: null, error: (error as Error)?.toString() };
    }
  },

  reuploadState: async (state: GameState) => {
    try {
      const data = await statesManager.reuploadState(state);
      return { data };
    } catch (error) {
      return { data: null, error: (error as Error)?.toString() };
    }
  },

  downloadState: async (gameState: GameState) => {
    try {
      await statesManager.downloadState(gameState);
      return { data: null };
    } catch (error) {
      if (error instanceof electronDl.CancelError) {
        console.info("item.cancel() was called");
      } else {
        console.error(error);
      }
      return { data: null, error: (error as Error)?.toString() };
    }
  },

  downloadStateAs: async (gameState: GameState) => {
    try {
      const win = BrowserWindow.getFocusedWindow();
      if (!win) {
        return { data: null };
      }

      const customPath = await dialog.showOpenDialog({
        title: "Download",
        defaultPath: gameState.localPath,
        properties: ["openDirectory"],
      });
      if (customPath.canceled || !customPath.filePaths[0]) {
        return { data: null };
      }

      await downloadToFolder(
        gameState.archiveURL,
        customPath.filePaths[0],
        `${gameState.name}-archive.zip`,
        true
      );

      return { data: null };
    } catch (error) {
      if (error instanceof electronDl.CancelError) {
        console.info("item.cancel() was called");
      } else {
        console.error(error);
      }

      return { data: null, error: (error as Error)?.toString() };
    }
  },

  getAppVersion: async () => {
    return { data: app.getVersion() };
  },
};
