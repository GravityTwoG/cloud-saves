interface Window {
  electronAPI: {
    showFolderDialog: () => Promise<{
      folder: string;
      files: {
        name: string;
        size: number;
        mtime: Date;
      }[];
    } | null>;
  };
}
