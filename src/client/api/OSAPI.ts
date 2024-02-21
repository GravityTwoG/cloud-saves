import { IOSAPI } from "./interfaces/IOSAPI";

export class OSAPI implements IOSAPI {
  getSavePaths = async (
    paths: string[]
  ): Promise<ElectronApiResponse<string[]>> => {
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

  uploadSave = async (save: {
    gameId: string;
    path: string;
    name: string;
  }): Promise<void> => {
    await window.electronAPI.uploadSave(save);
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
