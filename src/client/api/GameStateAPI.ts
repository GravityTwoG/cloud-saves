import { GamePath, GameState, GameStateSync, Share } from "@/types";
import { IGameStateAPI } from "./interfaces/IGameStateAPI";
import { IOSAPI } from "./interfaces/IOSAPI";
import { Fetcher } from "./Fetcher";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";
import { LocalStorage } from "./LocalStorage";

const ls = new LocalStorage("game_states_not_mock_");

type GameStateFromServer = {
  archiveUrl: string;
  gameIconUrl: string;
  gameId: number;
  gameStateValues: {
    id: number;
    gameStateParameterId: number;
    gameStateParameterType: {
      id: number;
      type: string;
    };
    value: string;
    label: string;
    description: string;
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

type SyncSettings = Record<string, { sync: GameStateSync; userId: string }>;

const apiPrefix = "/game-saves";

export class GameStateAPI implements IGameStateAPI {
  private readonly fetcher: Fetcher;
  private readonly osAPI: IOSAPI;

  constructor(fetcher: Fetcher, osAPI: IOSAPI) {
    this.fetcher = fetcher;
    this.osAPI = osAPI;
  }

  getStatePaths = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GamePath>> => {
    const pathsFromServer = await this.fetcher.get<
      ResourceResponse<GamePathFromServer>
    >(
      `/game-paths?pageSize=${query.pageSize}&pageNumber=${query.pageNumber}&searchQuery=${query.searchQuery}`
    );

    const paths: GamePath[] = pathsFromServer.items.map((path) => ({
      id: path.id.toString(),
      path: path.path,
      gameId: path.gameId.toString(),
      gameName: path.gameName,
      gameImageURL: path.gameIconUrl,
    }));
    const localPaths = await this.osAPI.getStatePaths(paths);

    return {
      items: localPaths,
      totalCount: pathsFromServer.totalCount,
    };
  };

  getGameState = async (gameStateId: string): Promise<GameState> => {
    const state = await this.fetcher.get<GameStateFromServer>(
      `${apiPrefix}/${gameStateId}`
    );

    return this.mapGameStateFromServer(state, this.getSyncSettings());
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
      items: states.items.map((i) =>
        this.mapGameStateFromServer(i, this.getSyncSettings())
      ),
      totalCount: states.totalCount,
    };
  };

  getSharedStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    const states = await this.fetcher.get<{
      items: GameStateFromServer[];
      totalCount: number;
    }>(
      `${apiPrefix}/received-game-state-shares?searchQuery=${query.searchQuery}&pageSize=${query.pageSize}&pageNumber=${query.pageNumber}`
    );

    return {
      items: states.items.map((i) =>
        this.mapGameStateFromServer(i, this.getSyncSettings())
      ),
      totalCount: states.totalCount,
    };
  };

  getPublicStates = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<GameState>> => {
    const states = await this.fetcher.get<{
      items: GameStateFromServer[];
      totalCount: number;
    }>(
      `${apiPrefix}/public?searchQuery=${query.searchQuery}&pageSize=${query.pageSize}&pageNumber=${query.pageNumber}`
    );

    return {
      items: states.items.map((i) =>
        this.mapGameStateFromServer(i, this.getSyncSettings())
      ),
      totalCount: states.totalCount,
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
      const states = ls.getItem<SyncSettings>("sync_settings");
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

  getSyncSettings(): SyncSettings {
    try {
      const syncSetting = ls.getItem<SyncSettings>("sync_settings");
      return syncSetting;
    } catch (e) {
      return {};
    }
  }

  deleteState = async (gameStateId: string): Promise<void> => {
    await this.fetcher.delete(`${apiPrefix}/${gameStateId}`);
  };

  private mapGameStateFromServer = (
    state: GameStateFromServer,
    syncSettings: SyncSettings
  ): GameState => {
    return {
      id: state.id.toString(),
      gameId: state.gameId.toString(),
      gameImageURL: state.gameIconUrl,
      name: state.name,
      sync: syncSettings[state.id]
        ? syncSettings[state.id].sync
        : GameStateSync.NO,
      isPublic: state.isPublic,
      localPath: state.localPath,
      archiveURL: state.archiveUrl,
      sizeInBytes: state.sizeInBytes,
      gameStateValues: state.gameStateValues.map((value) => ({
        value: value.value,
        gameStateParameterId: value.gameStateParameterId.toString(),
        type: value.gameStateParameterType.type,
        label: value.label,
        description: value.description,
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
    await this.fetcher.post(`/game-state-shares`, {
      body: {
        gameStateId: share.gameStateId,
        shareWithId: share.userId,
      },
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
