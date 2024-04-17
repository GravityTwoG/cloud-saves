import { BrowserWindow, app, dialog } from "electron";

import { GamePath, GameState } from "@/types";
import { getFolderInfo } from "./fs/getFolderInfo";
import { getStatePaths } from "./fs/getStatePaths";
import { downloadToFolder } from "./fs/downloadToFolder";
import { statesManager } from ".";

export const electronAPI: Omit<
  Window["electronAPI"],
  | "sendSyncedStates"
  | "onGetSyncedStates"
  | "onDeepLink"
  | "setTitleBarSettings"
> = {
  showFolderDialog: async () => {
    const obj = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (obj.canceled) {
      return { data: null, error: "cancelled" };
    }

    return { data: getFolderInfo(obj.filePaths[0]) };
  },

  getFolderInfo: async (folderPath: string) => {
    const info = getFolderInfo(folderPath);

    return { data: info };
  },

  getStatePaths: async (paths: GamePath[]) => {
    const filteredPaths = await getStatePaths(paths);
    return { data: filteredPaths };
  },

  uploadState: async (state: {
    gameId?: string;
    localPath: string;
    name: string;
    isPublic: boolean;
  }) => {
    const data = await statesManager.uploadState(state);
    return { data };
  },

  reuploadState: async (state: GameState) => {
    const data = await statesManager.reuploadState(state);
    return { data };
  },

  downloadState: async (gameState: GameState) => {
    await statesManager.downloadState(gameState);
    return { data: null };
  },

  downloadStateAs: async (gameState: GameState) => {
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
      true,
    );

    return { data: null };
  },

  getAppVersion: async () => {
    return { data: app.getVersion() };
  },
};
