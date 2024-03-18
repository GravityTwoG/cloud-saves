import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import classes from "./folder-explorer.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";

import GamepadIcon from "@/client/ui/icons/Gamepad.svg";
import { Button } from "@/client/ui/atoms/Button/Button";
import { Bytes } from "@/client/ui/atoms/Bytes/Bytes";
import { Paragraph } from "@/client/ui/atoms/Typography";
import { List } from "@/client/ui/molecules/List/List";

function last(arr: string[]) {
  return arr[arr.length - 1];
}

export type FolderExplorerProps = {
  saveUploaded: () => void;
};

export const FolderExplorer = (props: FolderExplorerProps) => {
  const { gameSaveAPI, osAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySaves" });
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [parentFolder, setParentFolder] = useState<string>("");
  const [files, setFiles] = useState<FileInfo[]>([]);

  const getSavePaths = useCallback(async () => {
    try {
      const paths = await gameSaveAPI.getSavePaths();

      setSelectedFolder("");
      setFiles(
        paths.map((path) => ({
          name: last(path.path.split("/")),
          path: path.path,
          size: 0,
          mtime: null,
          type: "folder",
          gameId: path.gameId,
          gameName: path.gameName,
          gameIconURL: path.gameIconURL,
        }))
      );
    } catch (e) {
      notify.error(e);
    }
  }, []);

  useEffect(() => {
    getSavePaths();
  }, [getSavePaths]);

  const onFolderOpen = async (file: FileInfo) => {
    try {
      const folderData = await osAPI.getFolderInfo(file.path);

      if (file.gameId) {
        folderData.files = folderData.files.map((f) => ({
          ...f,
          gameId: file.gameId,
        }));
      }
      const { folder, files } = folderData;

      setSelectedFolder(folder);
      setFiles(files.sort((a, b) => a.size - b.size));
      setParentFolder(file.path.split("/").slice(0, -1).join("/"));
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

  const uploadSave = async (folder: {
    gameId?: string;
    path: string;
    name: string;
  }) => {
    try {
      await gameSaveAPI.uploadSave(folder);
      props.saveUploaded();
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
            onClick={() =>
              onFolderOpen({
                name: "..",
                path: parentFolder,
                type: "folder",
                gameId: undefined,
                size: 0,
                mtime: null,
              })
            }
            className={classes.MiniButton}
          >
            {t("back")}{" "}
          </Button>
        )}
        <Button onClick={getSavePaths} className={classes.MiniButton}>
          {t("home")}{" "}
        </Button>
        <Button onClick={onOpenDialog} className={classes.MiniButton}>
          {t("choose-folder-to-list-files")}{" "}
        </Button>
      </div>

      <List
        elements={files}
        getKey={(file) => file.path}
        renderElement={(file) => (
          <>
            <div
              onClick={() => {
                if (file.type === "folder" && !file.gameId) {
                  onFolderOpen(file);
                }
              }}
              className={classes.FileInfo}
              data-type={file.gameId ? "file" : file.type}
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
              {!!file.gameId && (
                <div className={classes.GameInfo}>
                  {file.gameIconURL ? (
                    <img
                      src={file.gameIconURL}
                      alt={file.gameName}
                      className={classes.GameIcon}
                    />
                  ) : (
                    <GamepadIcon className={classes.GameIcon} />
                  )}
                  <span>{file.gameName}</span>
                </div>
              )}
            </div>

            <Button
              onClick={async () => {
                uploadSave(file);
              }}
              className={clsx(classes.MiniButton, classes.FileButton)}
            >
              {t("upload")}{" "}
            </Button>
          </>
        )}
      />
    </div>
  );
};
