import { GamePath, GameSave, GameSaveSync } from "@/types";
import {
  GetSavesQuery,
  GetSavesResponse,
  IGameSaveAPI,
} from "../interfaces/IGameSaveAPI";
import { IOSAPI } from "../interfaces/IOSAPI";
import { ApiError } from "../ApiError";
import { IGameAPI } from "../interfaces/IGameAPI";

export class GameSaveAPIMock implements IGameSaveAPI {
  private readonly osAPI: IOSAPI;
  private readonly gameAPI: IGameAPI;

  constructor(osAPI: IOSAPI, gameAPI: IGameAPI) {
    this.osAPI = osAPI;
    this.gameAPI = gameAPI;
  }

  getSavePaths = async (): Promise<GamePath[]> => {
    const paths: GamePath[] = [];

    const games = await this.gameAPI.getGames({
      pageNumber: 1,
      pageSize: 1000,
      searchQuery: "",
    });

    for (const game of games.items) {
      for (const path of game.paths) {
        paths.push({
          path,
          gameId: game.id,
          gameName: game.name,
          gameIconURL: game.iconURL,
        });
      }
    }

    const response = await this.osAPI.getSavePaths(paths);

    if (!response.data) {
      throw new ApiError(response.error || "Failed to get save paths");
    }

    return response.data;
  };

  getUserSaves = async (query: GetSavesQuery): Promise<GetSavesResponse> => {
    console.log("getUserSaves", query);
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);

      const savesArray: GameSave[] = [];

      for (const key in saves) {
        savesArray.push(saves[key]);
      }

      return {
        items: savesArray,
        totalCount: savesArray.length,
      };
    }

    return {
      items: [],
      totalCount: 0,
    };
  };

  getUserSave = async (gameSaveId: string): Promise<GameSave> => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);
      return saves[gameSaveId];
    }

    throw new ApiError("User save not found");
  };

  getSharedSaves = async (query: GetSavesQuery): Promise<GetSavesResponse> => {
    console.log("getSharedSaves", query);
    return {
      items: [],
      totalCount: 0,
    };
  };

  getPublicSaves = async (query: GetSavesQuery): Promise<GetSavesResponse> => {
    console.log("getGlobalSaves", query);
    return {
      items: [],
      totalCount: 0,
    };
  };

  uploadSave = async (save: {
    gameId?: string;
    path: string;
    name: string;
  }): Promise<void> => {
    const game = save.gameId
      ? await this.gameAPI.getGame(save.gameId)
      : undefined;

    const response = await this.osAPI.uploadSave(save, game);

    const gameSaveId = save.path.split("/").join("-").split(" ").join("_");
    const gameSave: GameSave = {
      id: gameSaveId,
      gameId: save.path,
      path: save.path,
      name: game ? game.name : save.name,
      sync: GameSaveSync.NO,
      metadata: response.metadata,
      archiveURL: save.path,
      size: 42,
      uploadedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
    };

    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);
      saves[gameSaveId] = gameSave;
      localStorage.setItem("saves", JSON.stringify(saves));
    } else {
      localStorage.setItem(
        "saves",
        JSON.stringify({
          [gameSaveId]: gameSave,
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
    await this.osAPI.downloadSave(path);
  };

  downloadAndExtractSave = async (
    archiveURL: string,
    path: string
  ): Promise<void> => {
    await this.osAPI.downloadAndExtractSave(archiveURL, path);
  };

  deleteSave = async (gameSaveId: string): Promise<void> => {
    const savesJSON = localStorage.getItem("saves");

    if (savesJSON) {
      const saves = JSON.parse(savesJSON);
      delete saves[gameSaveId];
      localStorage.setItem("saves", JSON.stringify(saves));
    }
  };
}
