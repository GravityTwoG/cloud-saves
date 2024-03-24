import { Game, GamePath } from "@/types";

export interface IOSAPI {
  getSavePaths: (paths: GamePath[]) => Promise<ElectronApiResponse<GamePath[]>>;

  getFolderInfo(folderPath: string): Promise<FolderInfo>;

  showFolderDialog(): Promise<FolderInfo>;

  uploadState(
    state: {
      path: string;
      name: string;
    },
    game?: Game
  ): Promise<{
    buffer: Buffer;
    gameStateValues: {
      gameStateParameterId: string;
      value: string;
    }[];
  }>;

  // Just download
  downloadState(archiveURL: string): Promise<void>;

  // Download and extract to states folder of the game
  downloadAndExtractState(archiveURL: string, path: string): Promise<void>;
}
