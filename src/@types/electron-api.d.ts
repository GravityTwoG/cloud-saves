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

    getStatePaths: (
      paths: import("../types").GamePath[]
    ) => Promise<ElectronApiResponse<import("../types").GamePath[]>>;

    getFolderInfo: (
      folderPath: string
    ) => Promise<ElectronApiResponse<FolderInfo>>;

    onGetSyncedStates: (callback: () => void) => void;

    sendSyncedStates: (
      args: import("../types").GameState[]
    ) => Promise<ElectronApiResponse<void>>;

    uploadState: (folder: {
      gameId?: string;
      localPath: string;
      name: string;
      isPublic: boolean;
    }) => Promise<
      ElectronApiResponse<{
        buffer: Buffer;
        gameStateValues: { value: string; gameStateParameterId: string }[];
      }>
    >;

    reuploadState: (state: import("../types").GameState) => Promise<
      ElectronApiResponse<{
        buffer: Buffer;
        gameStateValues: { value: string; gameStateParameterId: string }[];
      }>
    >;

    downloadState: (
      gameState: import("../types").GameState
    ) => Promise<ElectronApiResponse<void>>;

    downloadStateAs: (
      gameState: import("../types").GameState
    ) => Promise<ElectronApiResponse<void>>;

    getAppVersion: () => Promise<ElectronApiResponse<string>>;

    setTitleBarSettings: (settings: {
      backgroundColor: string;
      symbolColor: string;
    }) => Promise<ElectronApiResponse<void>>;
  };
}
