import { Game, GamePath, Metadata } from "@/types";
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

  uploadSave = async (
    save: {
      path: string;
      name: string;
    },
    game: Game
  ): Promise<{ buffer: Buffer; metadata: Metadata }> => {
    const response = await window.electronAPI.uploadSave(save, game);

    if (!response.data) {
      throw new ApiError(response.error || "Failed to upload save");
    }

    return response.data as { buffer: Buffer; metadata: Metadata };
  };

  downloadSave = async (archiveURL: string): Promise<void> => {
    await window.electronAPI.downloadSave(archiveURL);
  };

  downloadAndExtractSave = async (
    archiveURL: string,
    path: string
  ): Promise<void> => {
    await window.electronAPI.downloadAndExtractSave(archiveURL, path);
  };
}
