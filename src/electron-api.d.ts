type FileInfo = {
  name: string;
  path: string;
  size: number;
  mtime: Date | null;
  type: "file" | "folder";
  gameId?: string;
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
      paths: { path: string; gameId?: string }[]
    ) => Promise<ElectronApiResponse<{ path: string; gameId?: string }[]>>;

    getFolderInfo: (
      folderPath: string
    ) => Promise<ElectronApiResponse<FolderInfo>>;

    uploadSave: (
      folder: {
        path: string;
        name: string;
      },
      game: unknown
    ) => Promise<ElectronApiResponse<{ buffer: Buffer; metadata: unknown }>>;

    downloadSave: (archiveURL: string) => Promise<ElectronApiResponse<void>>;

    downloadAndExtractSave: (
      archiveURL: string,
      path: string
    ) => Promise<ElectronApiResponse<void>>;
  };
}
