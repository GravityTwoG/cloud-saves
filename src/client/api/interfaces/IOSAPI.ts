import { Game, GamePath, GameState } from "@/types";

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

  // Download and extract to states folder of the game
  downloadState(gameState: GameState): Promise<void>;

  // Just download
  downloadStateAs(gameState: GameState): Promise<void>;
}
