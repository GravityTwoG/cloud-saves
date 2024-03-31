import { GamePath, GameState, GameStateSync, Share } from "@/types";
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
      const state = states[gameStateId];

      const syncSettings = this.getSyncSettings();

      return {
        ...state,
        sync: syncSettings[state.id]
          ? syncSettings[state.id].sync
          : GameStateSync.NO,
      };
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

      const syncSettings = this.getSyncSettings();

      for (const key in states) {
        const state = states[key];
        statesArray.push({
          ...state,
          sync: syncSettings[state.id]
            ? syncSettings[state.id].sync
            : GameStateSync.NO,
        });
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
      gameIconURL: "",
      localPath: state.path,
      name: game ? game.name : state.name,
      sync: GameStateSync.NO,
      isPublic: false,
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
    isPublic: boolean;
  }): Promise<void> => {
    const game = state.gameId
      ? await this.gameAPI.getGame(state.gameId)
      : undefined;

    const response = await this.osAPI.uploadState(state, game);

    const gameStateId = state.path.split("/").join("-").split(" ").join("_");
    const gameState: GameState = {
      id: gameStateId,
      gameId: state.path,
      gameIconURL: "",
      localPath: state.path,
      name: game ? game.name : state.name,
      sync: GameStateSync.NO,
      isPublic: state.isPublic,
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
    userId: string;
    gameStateId: string;
    sync: GameStateSync;
  }) => {
    try {
      const states = ls.getItem<Record<string, GameState>>("sync_settings");
      states[settings.gameStateId] = {
        ...states[settings.gameStateId],
        sync: settings.sync,
      };
      ls.setItem("sync_settings", states);
    } catch (e) {
      ls.setItem("sync_settings", {
        [settings.gameStateId]: {
          ...settings,
          sync: settings.sync,
        },
      });
    }
  };

  getSyncSettings(): Record<string, { sync: GameStateSync; userId: string }> {
    try {
      const syncSetting =
        ls.getItem<Record<string, { sync: GameStateSync; userId: string }>>(
          "sync_settings"
        );
      return syncSetting;
    } catch (e) {
      return {};
    }
  }

  downloadState = async (gameState: GameState) => {
    await this.osAPI.downloadState(gameState);
  };

  downloadStateAs = async (gameState: GameState) => {
    await this.osAPI.downloadStateAs(gameState);
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

  addShare = async (share: {
    gameStateId: string;
    userId: string;
  }): Promise<void> => {
    console.log("addShare", share);
  };

  getShares = async (gameStateId: string): Promise<{ items: Share[] }> => {
    console.log("getShares", gameStateId);
    return {
      items: [],
    };
  };

  deleteShare = async (shareId: string): Promise<void> => {
    console.log("deleteShare", shareId);
  };
}
