import { GamePath, GameState, GameStateSync } from "@/types";

export type GetStatesQuery = {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
};

export type GetStatesResponse = {
  items: GameState[];
  totalCount: number;
};

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

  getUserStates(query: GetStatesQuery): Promise<GetStatesResponse>;

  getGameState(gameStateId: string): Promise<GameState>;

  getSharedStates(query: GetStatesQuery): Promise<GetStatesResponse>;

  getPublicStates(query: GetStatesQuery): Promise<GetStatesResponse>;
}
