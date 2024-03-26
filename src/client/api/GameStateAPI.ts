import { GamePath, GameState, GameStateSync } from "@/types";
import { IGameStateAPI } from "./interfaces/IGameStateAPI";
import { IOSAPI } from "./interfaces/IOSAPI";
import { ApiError } from "./ApiError";
import { IGameAPI } from "./interfaces/IGameAPI";
import { Fetcher } from "./Fetcher";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";

type GameStateFromServer = {
  archiveUrl: string;
  gameIconUrl: string;
  gameId: number;
  gameStateValues: {
    id: number;
    gameStateParameterId: number;
    value: string;
  }[];
  id: number;
  localPath: string;
  name: string;
  sizeInBytes: number;
};

const apiPrefix = "/game-saves";

export class GameStateAPI implements IGameStateAPI {
  private readonly fetcher: Fetcher;
  private readonly osAPI: IOSAPI;
  private readonly gameAPI: IGameAPI;

  constructor(fetcher: Fetcher, osAPI: IOSAPI, gameAPI: IGameAPI) {
    this.fetcher = fetcher;
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
    const state = await this.fetcher.get<GameStateFromServer>(
      `${apiPrefix}/${gameStateId}`
    );

    return this.mapGameStateFromServer(state);
  };

  getUserStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    const states = await this.fetcher.get<{
      items: GameStateFromServer[];
      totalCount: number;
    }>(
      `${apiPrefix}?searchQuery=${query.searchQuery}&pageSize=${query.pageSize}&pageNumber=${query.pageNumber}`
    );

    return {
      items: states.items.map(this.mapGameStateFromServer),
      totalCount: states.totalCount,
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

    const formData = new FormData();
    formData.append("archive", new Blob([response.buffer]));
    formData.append(
      "gameStateData",
      JSON.stringify({
        gameId: state.gameId,
        name: game ? game.name : state.name,
        localPath: state.path,
        // isPublic: false,
        gameStateValues: response.gameStateValues.map((value) => ({
          value: value.value,
          gameStateParameterId: value.gameStateParameterId,
        })),
      })
    );

    await this.fetcher.post(`${apiPrefix}`, {
      headers: {},
      body: formData,
    });
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

    const formData = new FormData();
    formData.append("archive", new Blob([response.buffer]));
    formData.append(
      "gameStateData",
      JSON.stringify({
        gameId: state.gameId,
        name: game ? game.name : state.name,
        localPath: state.path,
        // isPublic: false,
        gameStateValues: response.gameStateValues.map((value) => ({
          value: value.value,
          gameStateParameterId: value.gameStateParameterId,
        })),
      })
    );

    await this.fetcher.patch(`${apiPrefix}/${state.id}`, {
      headers: {},
      body: formData,
    });
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
    await this.fetcher.delete(`${apiPrefix}/${gameStateId}`);
  };

  private mapGameStateFromServer = (state: GameStateFromServer): GameState => {
    return {
      id: state.id.toString(),
      gameId: state.gameId.toString(),
      name: state.name,
      sync: GameStateSync.NO,
      localPath: state.localPath,
      archiveURL: state.archiveUrl,
      sizeInBytes: state.sizeInBytes,
      gameStateValues: state.gameStateValues.map((value) => ({
        value: value.value,
        gameStateParameterId: value.gameStateParameterId.toString(),
        label: "value.gameStateParameter.label",
        type: "value.gameStateParameter.type",
        description: "value.gameStateParameter.description",
      })),
      uploadedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    };
  };
}
