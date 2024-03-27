import { GamePath, GameState, GameStateSync, Share } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

export interface IGameStateAPI {
  getStatePaths(): Promise<GamePath[]>;

  uploadState(state: {
    gameId?: string;
    path: string;
    name: string;
  }): Promise<void>;

  reuploadState(state: {
    id: string;
    gameId?: string;
    path: string;
    name: string;
  }): Promise<void>;

  setupSync(settings: {
    gameStateId: string;
    sync: GameStateSync;
  }): Promise<void>;

  downloadState(archiveURL: string): Promise<void>;

  downloadAndExtractState(archiveURL: string, path: string): Promise<void>;

  deleteState(gameStateId: string): Promise<void>;

  getGameState(gameStateId: string): Promise<GameState>;

  getUserStates(query: ResourceRequest): Promise<ResourceResponse<GameState>>;

  getSharedStates(query: ResourceRequest): Promise<ResourceResponse<GameState>>;

  getPublicStates(query: ResourceRequest): Promise<ResourceResponse<GameState>>;

  addShare(share: { gameStateId: string; userId: string }): Promise<void>;

  getShares(gameStateId: string): Promise<{ items: Share[] }>;

  deleteShare(shareId: string): Promise<void>;
}
