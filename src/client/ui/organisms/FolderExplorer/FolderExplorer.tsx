import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";

import classes from "./folder-explorer.module.scss";
import { useAPIContext } from "@/client/contexts/APIContext";
import { notify } from "@/client/ui/toast";

import { Button } from "@/client/ui/atoms/Button/Button";
import { Bytes } from "@/client/ui/atoms/Bytes/Bytes";
import { Paragraph } from "@/client/ui/atoms/Typography";
import { List } from "@/client/ui/molecules/List/List";

function last(arr: string[]) {
  return arr[arr.length - 1];
}

export const FolderExplorer = () => {
  const { gameSaveAPI, osAPI } = useAPIContext();
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [parentFolder, setParentFolder] = useState<string>("");
  const [files, setFiles] = useState<FileInfo[]>([]);

  const getSavePaths = useCallback(async () => {
    try {
      const paths = await gameSaveAPI.getSavePaths();

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
    } catch (e) {
      notify.error(e);
    }
  }, []);

  useEffect(() => {
    getSavePaths();
  }, [getSavePaths]);

  const onFolderOpen = async (filePath: string) => {
    try {
      const folderData = await osAPI.getFolderInfo(filePath);

      const { folder, files } = folderData;
      setSelectedFolder(folder);
      setFiles(files.sort((a, b) => a.size - b.size));
      setParentFolder(filePath.split("/").slice(0, -1).join("/"));
    } catch (e) {
      notify.error(e);
    }
  };

  const onOpenDialog = async () => {
    try {
      const folderData = await osAPI.showFolderDialog();

      const { folder, files } = folderData;
      setSelectedFolder(folder);
      setFiles(files.sort((a, b) => a.size - b.size));
      setParentFolder(folder.split("/").slice(0, -1).join("/"));
    } catch (e) {
      notify.error(e);
    }
  };

  const uploadSave = async (folder: { path: string; name: string }) => {
    try {
      await gameSaveAPI.uploadSave(folder);
    } catch (e) {
      notify.error(e);
    }
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
                uploadSave(file);
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
