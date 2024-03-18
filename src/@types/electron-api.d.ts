type FileInfo = {
  name: string;
  path: string;
  size: number;
  mtime: Date | null;
  type: "file" | "folder";

  gameId?: string;
  gameName?: string;
  gameIconURL?: string;
};

type FolderInfo = {
  folder: string;
  files: FileInfo[];
};

type ElectronApiResponse<D> = {
  data: D | null;
  error?: string;
};

interface Window {
  electronAPI: {
    onDeepLink: (callback: (link: { url: string }) => void) => void;

    showFolderDialog: () => Promise<ElectronApiResponse<FolderInfo>>;

    getSavePaths: (
      paths: import("../types").GamePath[]
    ) => Promise<ElectronApiResponse<import("../types").GamePath[]>>;

    getFolderInfo: (
      folderPath: string
    ) => Promise<ElectronApiResponse<FolderInfo>>;

    uploadSave: (
      folder: {
        path: string;
        name: string;
      },
      game: import("../types").Game
    ) => Promise<
      ElectronApiResponse<{
        buffer: Buffer;
        gameStateValues: import("../types").GameStateValues;
      }>
    >;

    downloadSave: (archiveURL: string) => Promise<ElectronApiResponse<void>>;

    downloadAndExtractSave: (
      archiveURL: string,
      path: string
    ) => Promise<ElectronApiResponse<void>>;

    onGetSyncedSaves: (callback: () => void) => void;

    sendSyncedSaves: (
      args: import("../types").GameSave[]
    ) => Promise<ElectronApiResponse<void>>;
  };
}
