import { GamePath, GameState, GameStateSync } from "@/types";
import { IGameStateAPI } from "../interfaces/IGameStateAPI";
import { IOSAPI } from "../interfaces/IOSAPI";
import { ApiError } from "../ApiError";
import { IGameAPI } from "../interfaces/IGameAPI";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";
import { LocalStorage } from "./LocalStorage";

const ls = new LocalStorage("game_states_");

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
    try {
      const states = ls.getItem<Record<string, GameState>>("states");
      return states[gameStateId];
    } catch (e) {
      throw new ApiError("Game state not found");
    }
  };

  getUserStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    console.log("getUserStates", query);
    try {
      const states = ls.getItem<Record<string, GameState>>("states");
      const statesArray: GameState[] = [];

      for (const key in states) {
        statesArray.push(states[key]);
      }

      return {
        items: statesArray,
        totalCount: statesArray.length,
      };
    } catch (e) {
      return {
        items: [],
        totalCount: 0,
      };
    }
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
    const gameState: GameState = {
      id: gameStateId,
      gameId: state.path,
      localPath: state.path,
      name: game ? game.name : state.name,
      sync: GameStateSync.NO,
      gameStateValues: response.gameStateValues.map((field) => ({
        gameStateParameterId: field.gameStateParameterId,
        value: field.value,
        type: "string",
        label: "label",
        description: "description",
      })),
      archiveURL: state.path,
      sizeInBytes: 42,
      uploadedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
    };

    try {
      const states = ls.getItem<Record<string, GameState>>("states");
      states[gameStateId] = gameState;
      ls.setItem("states", states);
    } catch (e) {
      ls.setItem("states", {
        [gameStateId]: gameState,
      });
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
    const gameState: GameState = {
      id: gameStateId,
      gameId: state.path,
      localPath: state.path,
      name: game ? game.name : state.name,
      sync: GameStateSync.NO,
      gameStateValues: response.gameStateValues.map((field) => ({
        gameStateParameterId: field.gameStateParameterId,
        value: field.value,
        type: "string",
        label: "label",
        description: "description",
      })),
      archiveURL: state.path,
      sizeInBytes: 42,
      uploadedAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
    };

    try {
      const states = ls.getItem<Record<string, GameState>>("states");
      states[gameStateId] = gameState;
      ls.setItem("states", states);
    } catch (e) {
      ls.setItem("states", {
        [gameStateId]: gameState,
      });
    }
  };

  setupSync = async (settings: {
    gameStateId: string;
    sync: GameStateSync;
  }) => {
    try {
      const states = ls.getItem<Record<string, GameState>>("states");
      states[settings.gameStateId].sync = settings.sync;
      ls.setItem("states", states);
    } catch (e) {
      console.log(e);
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
    try {
      const states = ls.getItem<Record<string, GameState>>("states");
      delete states[gameStateId];
      ls.setItem("states", states);
    } catch (e) {
      console.log(e);
    }
  };
}
