import { GamePath, GameState } from "@/types";
import { IOSAPI } from "./interfaces/IOSAPI";
import { ApiError } from "./ApiError";

export class OSAPI implements IOSAPI {
  getFolderInfo = async (folderPath: string) => {
    const response = await window.electronAPI.getFolderInfo(folderPath);
    if (!response.data) {
      throw response.error;
    }
    return response.data;
  };

  showFolderDialog = async () => {
    const response = await window.electronAPI.showFolderDialog();
    if (!response.data) {
      throw response.error;
    }
    return response.data;
  };

  onDeepLink = (callback: (link: { url: string }) => void): void => {
    return window.electronAPI.onDeepLink(callback);
  };

  onGetSyncedSaves = (callback: () => void): void => {
    return window.electronAPI.onGetSyncedStates(callback);
  };

  sendSyncedSaves = async (args: GameState[]): Promise<void> => {
    await window.electronAPI.sendSyncedStates(args);
  };

  getStatePaths = async (paths: GamePath[]): Promise<GamePath[]> => {
    const response = await window.electronAPI.getStatePaths(paths);
    if (!response.data) {
      throw new ApiError(response.error || "Failed to get state paths");
    }
    return response.data;
  };

  uploadState = async (state: {
    gameId?: string;
    localPath: string;
    name: string;
    isPublic: boolean;
  }): Promise<{
    buffer: Buffer;
    gameStateValues: { value: string; gameStateParameterId: string }[];
  }> => {
    const response = await window.electronAPI.uploadState(state);
    if (!response.data) {
      throw new ApiError(response.error || "Failed to upload state");
    }
    return response.data;
  };

  reuploadState = async (state: GameState): Promise<void> => {
    const response = await window.electronAPI.reuploadState(state);
    if (!response.data) {
      throw new ApiError(response.error || "Failed to reupload state");
    }
  };

  downloadState = async (gameState: GameState): Promise<void> => {
    await window.electronAPI.downloadState(gameState);
  };

  downloadStateAs = async (gameState: GameState): Promise<void> => {
    await window.electronAPI.downloadStateAs(gameState);
  };

  getAppVersion = async (): Promise<string> => {
    const response = await window.electronAPI.getAppVersion();
    if (!response.data) {
      throw new ApiError(response.error || "Failed to get app version");
    }
    return response.data;
  };
}
