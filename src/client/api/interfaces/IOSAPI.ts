import { Game, GamePath, GameStateValues } from "@/types";

export interface IOSAPI {
  getSavePaths: (paths: GamePath[]) => Promise<ElectronApiResponse<GamePath[]>>;

  getFolderInfo(folderPath: string): Promise<FolderInfo>;

  showFolderDialog(): Promise<FolderInfo>;

  uploadSave(
    save: {
      path: string;
      name: string;
    },
    game?: Game
  ): Promise<{ buffer: Buffer; gameStateValues: GameStateValues }>;

  // Just download
  downloadSave(archiveURL: string): Promise<void>;

  // Download and extract to saves folder of the game
  downloadAndExtractSave(archiveURL: string, path: string): Promise<void>;
}
