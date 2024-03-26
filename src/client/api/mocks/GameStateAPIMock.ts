import { GamePath, GameState, GameStateSync } from "@/types";
import { IGameStateAPI } from "../interfaces/IGameStateAPI";
import { IOSAPI } from "../interfaces/IOSAPI";
import { ApiError } from "../ApiError";
import { IGameAPI } from "../interfaces/IGameAPI";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";

export class GameStateAPIMock implements IGameStateAPI {
  private readonly osAPI: IOSAPI;
  private readonly gameAPI: IGameAPI;

  constructor(osAPI: IOSAPI, gameAPI: IGameAPI) {
    this.osAPI = osAPI;
    this.gameAPI = gameAPI;
  }

  getStatePaths = async (): Promise<GamePath[]> => {
    const paths: GamePath[] = [];

    const games = await this.gameAPI.getGames({
      pageNumber: 1,
      pageSize: 1000,
      searchQuery: "",
    });

    for (const game of games.items) {
      for (const path of game.paths) {
        paths.push({
          path: path.path,
          gameId: game.id,
          gameName: game.name,
          gameIconURL: game.iconURL,
        });
      }
    }

    const response = await this.osAPI.getSavePaths(paths);

    if (!response.data) {
      throw new ApiError(response.error || "Failed to get state paths");
    }

    return response.data;
  };

  getGameState = async (gameStateId: string): Promise<GameState> => {
    const statesJSON = localStorage.getItem("states");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);
      return states[gameStateId];
    }

    throw new ApiError("Game state not found");
  };

  getUserStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    console.log("getUserStates", query);
    const statesJSON = localStorage.getItem("states");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);

      const statesArray: GameState[] = [];

      for (const key in states) {
        statesArray.push(states[key]);
      }

      return {
        items: statesArray,
        totalCount: statesArray.length,
      };
    }

    return {
      items: [],
      totalCount: 0,
    };
  };

  getSharedStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    console.log("getSharedStates", query);
    return {
      items: [],
      totalCount: 0,
    };
  };

  getPublicStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    console.log("getGlobalStates", query);
    return {
      items: [],
      totalCount: 0,
    };
  };

  uploadState = async (state: {
    gameId?: string;
    path: string;
    name: string;
  }): Promise<void> => {
    const game = state.gameId
      ? await this.gameAPI.getGame(state.gameId)
      : undefined;

    const response = await this.osAPI.uploadState(state, game);

    const gameStateId = state.path.split("/").join("-").split(" ").join("_");
    const gameState = {
      id: gameStateId,
      gameId: state.path,
      localPath: state.path,
      name: game ? game.name : state.name,
      sync: GameStateSync.NO,
      gameStateValues: response.gameStateValues,
      archiveURL: state.path,
      sizeInBytes: 42,
      uploadedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
    };

    const statesJSON = localStorage.getItem("states");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);
      states[gameStateId] = gameState;
      localStorage.setItem("states", JSON.stringify(states));
    } else {
      localStorage.setItem(
        "states",
        JSON.stringify({
          [gameStateId]: gameState,
        })
      );
    }
  };

  reuploadState = async (state: {
    id: string;
    gameId?: string;
    path: string;
    name: string;
  }): Promise<void> => {
    const game = state.gameId
      ? await this.gameAPI.getGame(state.gameId)
      : undefined;

    const response = await this.osAPI.uploadState(state, game);

    const gameStateId = state.path.split("/").join("-").split(" ").join("_");
    const gameState = {
      id: gameStateId,
      gameId: state.path,
      localPath: state.path,
      name: game ? game.name : state.name,
      sync: GameStateSync.NO,
      gameStateValues: response.gameStateValues,
      archiveURL: state.path,
      sizeInBytes: 42,
      uploadedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
    };

    const statesJSON = localStorage.getItem("states");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);
      states[gameStateId] = gameState;
      localStorage.setItem("states", JSON.stringify(states));
    } else {
      localStorage.setItem(
        "states",
        JSON.stringify({
          [gameStateId]: gameState,
        })
      );
    }
  };

  setupSync = async (settings: {
    gameStateId: string;
    sync: GameStateSync;
  }) => {
    const statesJSON = localStorage.getItem("states");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);
      states[settings.gameStateId].sync = settings.sync;
      localStorage.setItem("states", JSON.stringify(states));
    }
  };

  downloadState = async (path: string) => {
    await this.osAPI.downloadState(path);
  };

  downloadAndExtractState = async (
    archiveURL: string,
    path: string
  ): Promise<void> => {
    await this.osAPI.downloadAndExtractState(archiveURL, path);
  };

  deleteState = async (gameStateId: string): Promise<void> => {
    const statesJSON = localStorage.getItem("states");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);
      delete states[gameStateId];
      localStorage.setItem("states", JSON.stringify(states));
    }
  };
}
