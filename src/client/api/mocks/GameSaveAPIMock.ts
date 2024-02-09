import { GameSave, GameSaveSync } from "@/types";
import { IGameSaveAPI } from "../IGameSaveAPI";

export class GameSaveAPIMock implements IGameSaveAPI {
  getSavePaths = async (): Promise<string[]> => {
    const paths = [
      "C:/Users/%USERNAME%/Documents",
      "C:/Users/%USERNAME%/Documents/My Games",
      "C:/Users/%USERNAME%/Documents/Saved Games",
    ];

    const response = await window.electronAPI.getSavePaths(paths);
    return response.data || [];
  };

  isSavePaths = async (
    paths: string[]
  ): Promise<{ path: string; isSavePath: boolean }[]> => {
    return paths.map((path) => {
      return {
        path,
        isSavePath: true,
      };
    });
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

  getUserSaves = async (): Promise<GameSave[]> => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);

      const savesArray: GameSave[] = [];

      for (const key in saves) {
        savesArray.push(saves[key]);
      }

      return savesArray;
    }

    return [];
  };

  getUserSave = async (gameSaveId: string): Promise<GameSave> => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);
      return saves[gameSaveId];
    }

    throw new Error("User save not found");
  };

  getSharedSaves = async (): Promise<GameSave[]> => {
    return [];
  };

  getGlobalSaves = async (): Promise<GameSave[]> => {
    return [];
  };

  uploadSave = async (save: { path: string; name: string }): Promise<void> => {
    const response = await window.electronAPI.uploadSave(save);
    console.log(response);
    const gameSaveId = save.path.split("/").join("-").split(" ").join("_");

    console.log("uploading", save.path, save.name);
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);

      if (saves[gameSaveId]) {
        saves[gameSaveId].archives.push({
          url: save.path,
          id: Math.random().toString(),
          size: 42,
          createdAt: new Date().toLocaleString(),
        });
      } else {
        saves[gameSaveId] = {
          id: gameSaveId,
          gameId: save.path,
          path: save.path,
          name: save.name,
          sync: "every hour",
          archives: [
            {
              url: save.path,
              id: Math.random().toString(),
              size: 42,
              createdAt: new Date().toLocaleString(),
            },
          ],
        };
      }

      localStorage.setItem("saves", JSON.stringify(saves));
    } else {
      localStorage.setItem(
        "saves",
        JSON.stringify({
          [gameSaveId]: {
            id: gameSaveId,
            gameId: save.path,
            path: save.path,
            name: save.name,
            sync: "every hour",
            archives: [
              {
                url: save.path,
                id: Math.random().toString(),
                size: 42,
                createdAt: new Date().toLocaleString(),
              },
            ],
          },
        })
      );
    }
  };

  setupSync = async (settings: { gameSaveId: string; sync: GameSaveSync }) => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);
      saves[settings.gameSaveId].sync = settings.sync;
      localStorage.setItem("saves", JSON.stringify(saves));
    }
  };

  downloadSave = async (path: string) => {
    await window.electronAPI.downloadAndExtractSave(path);
  };

  deleteSave = async (gameSaveId: string): Promise<void> => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);
      delete saves[gameSaveId];
      localStorage.setItem("saves", JSON.stringify(saves));
    }
  };

  deleteGameSaveArchive = async (gameSaveArchiveId: string): Promise<void> => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);

      for (const gameSaveId in saves) {
        if (saves[gameSaveId].archives) {
          saves[gameSaveId].archives = saves[gameSaveId].archives.filter(
            (item: GameSave["archives"][0]) => item.id !== gameSaveArchiveId
          );
        }
      }

      localStorage.setItem("saves", JSON.stringify(saves));
    }
  };
}
