import { GamePath, GameState, GameStateSync, Share } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

export interface IGameStateAPI {
  getStatePaths(query: ResourceRequest): Promise<ResourceResponse<GamePath>>;

  uploadState(state: {
    gameId?: string;
    localPath: string;
    name: string;
    isPublic: boolean;
  }): Promise<void>;

  reuploadState(state: GameState): Promise<void>;

  downloadState(state: GameState): Promise<void>;

  downloadStateAs(state: GameState): Promise<void>;

  setupSync(settings: {
    userId: string;
    gameStateId: string;
    sync: GameStateSync;
  }): Promise<void>;

  deleteState(gameStateId: string): Promise<void>;

  getGameState(gameStateId: string): Promise<GameState>;

  getUserStates(query: ResourceRequest): Promise<ResourceResponse<GameState>>;

  getSharedStates(query: ResourceRequest): Promise<ResourceResponse<GameState>>;

  getPublicStates(query: ResourceRequest): Promise<ResourceResponse<GameState>>;

  addShare(share: { gameStateId: string; userId: string }): Promise<void>;

  getShares(gameStateId: string): Promise<{ items: Share[] }>;

  deleteShare(shareId: string): Promise<void>;
}
