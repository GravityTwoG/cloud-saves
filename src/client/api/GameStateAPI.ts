import { GamePath, GameState, GameStateSync, Share } from "@/types";
import { IGameStateAPI } from "./interfaces/IGameStateAPI";
import { IOSAPI } from "./interfaces/IOSAPI";
import { ApiError } from "./ApiError";
import { IGameAPI } from "./interfaces/IGameAPI";
import { Fetcher } from "./Fetcher";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";
import { LocalStorage } from "./mocks/LocalStorage";

const ls = new LocalStorage("game_states_not_mock_");

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
  isPublic: boolean;
  sizeInBytes: number;
};

type ShareFromServer = {
  id: string;
  username: string;
};

type GamePathFromServer = {
  id: number;
  path: string;
  gameId: number;
  gameName: string;
  gameIconUrl: string;
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
    const pathsFromServer = await this.fetcher.get<{
      items: GamePathFromServer[][];
    }>(`/game-paths?pageSize=1000&pageNumber=1&searchQuery=""`);

    const paths: GamePath[] = pathsFromServer.items[0].map((path) => ({
      id: path.id.toString(),
      path: path.path,
      gameId: path.gameId.toString(),
      gameName: path.gameName,
      gameIconURL: path.gameIconUrl,
    }));

    const response = await this.osAPI.getStatePaths(paths);

    if (!response.data) {
      throw new ApiError(response.error || "Failed to get state paths");
    }

    return response.data;
  };

  getGameState = async (gameStateId: string): Promise<GameState> => {
    const state = await this.fetcher.get<GameStateFromServer>(
      `${apiPrefix}/${gameStateId}`
    );

    const syncSettings = this.getSyncSettings();

    const mapped = this.mapGameStateFromServer(state);

    return {
      ...mapped,
      sync: syncSettings[mapped.id]
        ? syncSettings[mapped.id].sync
        : GameStateSync.NO,
    };
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

    const syncSettings = this.getSyncSettings();

    return {
      items: states.items.map((state) => {
        const mapped = this.mapGameStateFromServer(state);

        return {
          ...mapped,
          sync: syncSettings[mapped.id]
            ? syncSettings[mapped.id].sync
            : GameStateSync.NO,
        };
      }),
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
    localPath: string;
    name: string;
    isPublic: boolean;
  }): Promise<void> => {
    await this.osAPI.uploadState(state);
  };

  reuploadState = async (state: GameState): Promise<void> => {
    await this.osAPI.reuploadState(state);
  };

  downloadState = async (state: GameState): Promise<void> => {
    await this.osAPI.downloadState(state);
  };

  downloadStateAs = async (state: GameState): Promise<void> => {
    await this.osAPI.downloadStateAs(state);
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

  deleteState = async (gameStateId: string): Promise<void> => {
    await this.fetcher.delete(`${apiPrefix}/${gameStateId}`);
  };

  private mapGameStateFromServer = (state: GameStateFromServer): GameState => {
    return {
      id: state.id.toString(),
      gameId: state.gameId.toString(),
      gameIconURL: state.gameIconUrl,
      name: state.name,
      sync: GameStateSync.NO,
      isPublic: state.isPublic,
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

  // Shares
  addShare = async (share: {
    gameStateId: string;
    userId: string;
  }): Promise<void> => {
    const formData = new FormData();
    formData.append(
      "gameStateSharedData",
      JSON.stringify({
        gameStateId: share.gameStateId,
        shareWithId: share.userId,
      })
    );

    await this.fetcher.post(`/game-state-shares`, {
      headers: {},
      body: formData,
    });
  };

  getShares = async (gameStateId: string): Promise<{ items: Share[] }> => {
    const shares = await this.fetcher.get<{
      gameStateShares: ShareFromServer[];
    }>(`/game-state-shares/${gameStateId}`);

    return {
      items: shares.gameStateShares.map((share) => ({
        id: share.id.toString(),
        gameStateId,
        userId: "share.userId",
        username: share.username,
      })),
    };
  };

  deleteShare = async (shareId: string): Promise<void> => {
    await this.fetcher.delete(`/game-state-shares/${shareId}`);
  };
}
