import { GameSave, GameSaveSync } from "@/types";

export interface IGameSaveAPI {
  getSavePaths(): Promise<string[]>;
  isSavePaths(
    paths: string[]
  ): Promise<{ path: string; isSavePath: boolean }[]>;
  getFolderInfo(folderPath: string): Promise<FolderInfo>;
  showFolderDialog(): Promise<FolderInfo>;

  uploadSave(save: { path: string; name: string }): Promise<void>;
  getUserSaves(): Promise<GameSave[]>;
  getUserSave(gameSaveId: string): Promise<GameSave>;
  setupSync(settings: {
    gameSaveId: string;
    sync: GameSaveSync;
  }): Promise<void>;
  downloadSave(saveURL: string): Promise<void>;
  deleteGameSaveArchive(gameSaveArchiveId: string): Promise<void>;
  deleteSave(gameSaveId: string): Promise<void>;

  getGlobalSaves(): Promise<GameSave[]>;
  getSharedSaves(): Promise<GameSave[]>;
}
