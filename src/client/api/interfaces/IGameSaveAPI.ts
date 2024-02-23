import { GameSave, GameSaveSync } from "@/types";

export type GetSavesQuery = {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
};

export type GetSavesResponse = {
  items: GameSave[];
  totalCount: number;
};

export interface IGameSaveAPI {
  getSavePaths(): Promise<string[]>;

  uploadSave(save: { path: string; name: string }): Promise<void>;

  setupSync(settings: {
    gameSaveId: string;
    sync: GameSaveSync;
  }): Promise<void>;

  downloadSave(saveURL: string): Promise<void>;

  downloadAndExtractSave(archiveURL: string, path: string): Promise<void>;

  deleteSave(gameSaveId: string): Promise<void>;

  getUserSaves(query: GetSavesQuery): Promise<GetSavesResponse>;

  getUserSave(gameSaveId: string): Promise<GameSave>;

  getSharedSaves(query: GetSavesQuery): Promise<GetSavesResponse>;

  getPublicSaves(query: GetSavesQuery): Promise<GetSavesResponse>;
}
