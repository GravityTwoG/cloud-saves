import { GamePath, GameState } from "@/types";

export interface IOSAPI {
  getFolderInfo(folderPath: string): Promise<FolderInfo>;

  showFolderDialog(): Promise<FolderInfo>;

  onDeepLink: (
    callback: (link: { url: string }) => void,
  ) => UnsubscribeFunction;

  onGetSyncedSaves: (callback: () => void) => UnsubscribeFunction;

  sendSyncedSaves: (args: GameState[]) => Promise<void>;

  getStatePaths: (paths: GamePath[]) => Promise<GamePath[]>;

  uploadState(state: {
    gameId?: string;
    localPath: string;
    name: string;
    isPublic: boolean;
  }): Promise<{
    buffer: Buffer;
    gameStateValues: { value: string; gameStateParameterId: string }[];
  }>;

  reuploadState(state: GameState): Promise<void>;

  // Download and extract to states folder of the game
  downloadState(gameState: GameState): Promise<void>;

  // Just download to selected folder
  downloadStateAs(gameState: GameState): Promise<void>;

  getAppVersion(): Promise<string>;

  setTitleBarSettings(settings: {
    backgroundColor: string;
    symbolColor: string;
  }): Promise<void>;
}
