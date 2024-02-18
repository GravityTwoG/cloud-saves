export interface IOSAPI {
  getSavePaths: (paths: string[]) => Promise<ElectronApiResponse<string[]>>;

  getFolderInfo(folderPath: string): Promise<FolderInfo>;

  showFolderDialog(): Promise<FolderInfo>;

  uploadSave(save: {
    gameId: string;
    path: string;
    name: string;
  }): Promise<void>;

  // Just download
  downloadSave(archiveURL: string): Promise<void>;

  // Download and extract to saves folder of the game
  downloadAndExtractSave(archiveURL: string, path: string): Promise<void>;
}
