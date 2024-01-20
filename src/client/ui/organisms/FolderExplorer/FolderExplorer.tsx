import { useCallback, useEffect, useState } from "react";

import classes from "./folder-explorer.module.scss";

import { Button } from "../../atoms/Button/Button";
import clsx from "clsx";
import { Bytes } from "../../atoms/Bytes/Bytes";

function last(arr: string[]) {
  return arr[arr.length - 1];
}

export const FolderExplorer = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [parentFolder, setParentFolder] = useState<string>("");
  const [files, setFiles] = useState<FileInfo[]>([]);

  const getSavePaths = useCallback(async () => {
    const data = await window.electronAPI.getSavePaths();
    const paths = data.data;

    if (!paths) return;

    setSelectedFolder("");
    setFiles(
      paths.map((path) => ({
        name: last(path.split("/")),
        path: path,
        size: 0,
        mtime: null,
        type: "folder",
      }))
    );
  }, []);

  useEffect(() => {
    getSavePaths();
  }, [getSavePaths]);

  const onFolderOpen = async (filePath: string) => {
    const folderData = await window.electronAPI.getFolderInfo(filePath);

    if (!folderData.data) return;

    const { folder, files } = folderData.data;
    setSelectedFolder(folder);
    setFiles(files.sort((a, b) => a.size - b.size));
    setParentFolder(filePath.split("/").slice(0, -1).join("/"));
  };

  const onOpenDialog = async () => {
    const folderData = await window.electronAPI.showFolderDialog();

    if (!folderData.data) return;

    const { folder, files } = folderData.data;
    setSelectedFolder(folder);
    setFiles(files.sort((a, b) => a.size - b.size));
    setParentFolder(folder.split("/").slice(0, -1).join("/"));
  };

  const goBack = () => {
    onFolderOpen(parentFolder);
  };

  return (
    <div className={classes.FolderExplorer}>
      <div className={classes.FolderActions}>
        <Button onClick={getSavePaths} className={classes.MiniButton}>
          Home
        </Button>
        <Button onClick={onOpenDialog} className={classes.MiniButton}>
          Choose folder to list files
        </Button>
      </div>
      <div>Folder: {selectedFolder}</div>

      <div>Files: </div>
      <ul className={classes.FilesList}>
        {parentFolder && (
          <li className={classes.File}>
            <div
              onClick={goBack}
              className={classes.FileInfo}
              data-type="folder"
            >
              <p>..</p>
            </div>
          </li>
        )}

        {files.map((file) => (
          <li key={file.name} className={classes.File}>
            <div
              onClick={() => {
                if (file.type === "folder") {
                  onFolderOpen(file.path);
                }
              }}
              className={classes.FileInfo}
              data-type={file.type}
            >
              <p>
                {file.type === "folder" ? "folder: " : "file: "}
                {file.name}
              </p>
              {!!file.size && (
                <p>
                  size: <Bytes bytes={file.size} />
                </p>
              )}
              {!!file.mtime && (
                <p>modified: {file.mtime.toLocaleDateString()}</p>
              )}
            </div>

            <Button
              onClick={() => {
                window.electronAPI.uploadSave(file.path);
              }}
              className={clsx(classes.MiniButton, classes.FileButton)}
            >
              Upload
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
