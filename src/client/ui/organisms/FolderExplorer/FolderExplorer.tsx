import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

import classes from "./folder-explorer.module.scss";

import * as gamesavesApi from "../../../api/gamesave";

import { Button } from "../../atoms/Button/Button";
import { Bytes } from "../../atoms/Bytes/Bytes";
import { Paragraph } from "../../atoms/Typography";
import { List } from "../../molecules/List/List";

function last(arr: string[]) {
  return arr[arr.length - 1];
}

export const FolderExplorer = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [parentFolder, setParentFolder] = useState<string>("");
  const [files, setFiles] = useState<FileInfo[]>([]);

  const getSavePaths = useCallback(async () => {
    const paths = await gamesavesApi.getSavePaths();

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
    const folderData = await gamesavesApi.getFolderInfo(filePath);

    if (!folderData.data) return;

    const { folder, files } = folderData.data;
    setSelectedFolder(folder);
    setFiles(files.sort((a, b) => a.size - b.size));
    setParentFolder(filePath.split("/").slice(0, -1).join("/"));
  };

  const onOpenDialog = async () => {
    const folderData = await gamesavesApi.showFolderDialog();

    if (!folderData.data) return;

    const { folder, files } = folderData.data;
    setSelectedFolder(folder);
    setFiles(files.sort((a, b) => a.size - b.size));
    setParentFolder(folder.split("/").slice(0, -1).join("/"));
  };

  return (
    <div className={classes.FolderExplorer}>
      <Paragraph>Folder: {selectedFolder}</Paragraph>

      <div className={classes.FolderActions}>
        {parentFolder && (
          <Button
            onClick={() => onFolderOpen(parentFolder)}
            className={classes.MiniButton}
          >
            Back
          </Button>
        )}
        <Button onClick={getSavePaths} className={classes.MiniButton}>
          Home
        </Button>
        <Button onClick={onOpenDialog} className={classes.MiniButton}>
          Choose folder to list files
        </Button>
      </div>

      <List
        elements={files}
        getKey={(file) => file.path}
        renderElement={(file) => (
          <>
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
              onClick={async () => {
                const response = await gamesavesApi.uploadSave({
                  path: file.path,
                  name: file.name,
                });
                console.log(response);
              }}
              className={clsx(classes.MiniButton, classes.FileButton)}
            >
              Upload
            </Button>
          </>
        )}
      />
    </div>
  );
};
