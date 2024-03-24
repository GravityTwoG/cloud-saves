import { Game, GamePath } from "@/types";
import { IOSAPI } from "./interfaces/IOSAPI";
import { ApiError } from "./ApiError";

export class OSAPI implements IOSAPI {
  getSavePaths = async (
    paths: GamePath[]
  ): Promise<ElectronApiResponse<GamePath[]>> => {
    const response = await window.electronAPI.getSavePaths(paths);

    return response;
  };

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

  uploadState = async (
    state: {
      path: string;
      name: string;
    },
    game: Game
  ): Promise<{
    buffer: Buffer;
    gameStateValues: {
      gameStateParameterId: string;
      value: string;
    }[];
  }> => {
    const response = await window.electronAPI.uploadSave(state, game);

    if (!response.data) {
      throw new ApiError(response.error || "Failed to upload state");
    }

    return response.data;
  };

  downloadState = async (archiveURL: string): Promise<void> => {
    await window.electronAPI.downloadSave(archiveURL);
  };

  downloadAndExtractState = async (
    archiveURL: string,
    path: string
  ): Promise<void> => {
    await window.electronAPI.downloadAndExtractSave(archiveURL, path);
  };
}
