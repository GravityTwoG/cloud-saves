type FileInfo = {
  name: string;
  path: string;
  size: number;
  mtime: Date | null;
  type: "file" | "folder";
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

    getSavePaths: (paths: string[]) => Promise<ElectronApiResponse<string[]>>;

    getFolderInfo: (
      folderPath: string
    ) => Promise<ElectronApiResponse<FolderInfo>>;

    uploadSave: (folder: {
      gameId: string;
      path: string;
      name: string;
    }) => Promise<ElectronApiResponse<void>>;

    downloadSave: (archiveURL: string) => Promise<ElectronApiResponse<void>>;

    downloadAndExtractSave: (
      archiveURL: string,
      path: string
    ) => Promise<ElectronApiResponse<void>>;
  };
}
