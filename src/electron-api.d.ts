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
    showFolderDialog: () => Promise<ElectronApiResponse<FolderInfo>>;

    getSavePaths: (paths: string[]) => Promise<ElectronApiResponse<string[]>>;

    getFolderInfo: (
      folderPath: string
    ) => Promise<ElectronApiResponse<FolderInfo>>;

    uploadSave: (folder: {
      path: string;
      name: string;
    }) => Promise<ElectronApiResponse<void>>;

    downloadAndExtractSave: (
      path: string
    ) => Promise<ElectronApiResponse<void>>;
  };
}
