import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./local-saves-page.module.scss";

import { ResourceRequest } from "@/client/api/interfaces/common";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResourceWithSync } from "@/client/lib/hooks/useResource";
import { scrollToTop } from "@/client/lib/scrollToTop";

import UploadIcon from "@/client/ui/icons/Upload.svg";
import FolderIcon from "@/client/ui/icons/Folder.svg";
import FileIcon from "@/client/ui/icons/File.svg";
import { Bytes } from "@/client/ui/atoms/Bytes";
import { Button } from "@/client/ui/atoms/Button";
import { Container } from "@/client/ui/atoms/Container";
import { FadedCard } from "@/client/ui/atoms/FadedCard";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Grid } from "@/client/ui/molecules/Grid";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";

function last(arr: string[]) {
  return arr[arr.length - 1];
}

function getParentPath(path: string) {
  const parts = path.split(/\\/g);
  return parts.slice(0, parts.length - 1).join("\\");
}

export const LocalSavesPage = () => {
  const { gameStateAPI, osAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.localSaves" });

  const [isManual, setIsManual] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<{
    path: string;
    parentPath: string;
  }>({
    path: "",
    parentPath: "",
  });
  const [files, setFiles] = useState<FileInfo[]>([]);

  const {
    query,
    resource: paths,
    isLoading,
    onSearch,
    onSearchQueryChange,
    _loadResource,
  } = useResourceWithSync(gameStateAPI.getStatePaths);

  const onFolderOpen = async (folderToOpen: FileInfo) => {
    try {
      setIsManual(true);
      const folderData = await osAPI.getFolderInfo(folderToOpen.path);
      let files = folderData.files;
      if (folderToOpen.gameId) {
        files = files.map((f) => ({
          ...f,
          gameId: folderToOpen.gameId,
        }));
      }
      setFiles(files.sort((a, b) => a.size - b.size));
      setSelectedFolder({
        path: folderData.folder,
        parentPath: getParentPath(folderData.folder),
      });
    } catch (e) {
      notify.error(e);
    }
  };

  const onOpenDialog = async () => {
    try {
      setIsManual(true);
      const { folder, files } = await osAPI.showFolderDialog();
      setFiles(files.sort((a, b) => a.size - b.size));
      setSelectedFolder({
        path: folder,
        parentPath: getParentPath(folder),
      });
    } catch (e) {
      notify.error(e);
    }
  };

  const loadPaths = async (query: ResourceRequest) => {
    setIsManual(false);
    setFiles([]);
    setSelectedFolder({
      path: "",
      parentPath: "",
    });
    _loadResource(query);
  };

  const items = useMemo(() => {
    if (isManual) {
      return files;
    }

    return paths.items.map((path) => ({
      name: last(path.path.split("/")),
      path: path.path,
      size: 0,
      mtime: new Date(),
      type: "folder" as "folder" | "file",
      gameId: path.gameId,
      gameName: path.gameName,
      gameIconURL: path.gameImageURL || "",
    }));
  }, [paths, isManual, files]);

  return (
    <Container className={classes.FolderExplorer}>
      <H1>{t("local-saves")}</H1>

      <SearchForm
        onSearch={() => {
          setIsManual(false);
          setFiles([]);
          setSelectedFolder({
            path: "",
            parentPath: "",
          });
          onSearch();
        }}
        searchQuery={query.searchQuery}
        onQueryChange={onSearchQueryChange}
      />

      {selectedFolder.path && (
        <Paragraph className={classes.SelectedFolder}>
          <FolderIcon className={classes.Icon} /> {selectedFolder.path}
        </Paragraph>
      )}

      <div className={classes.FolderActions}>
        <Button
          onClick={() =>
            loadPaths({ ...query, pageNumber: 1, searchQuery: "" })
          }
          className={classes.MiniButton}
        >
          {t("home")}{" "}
        </Button>

        {selectedFolder.parentPath && (
          <Button
            onClick={() =>
              onFolderOpen({
                name: "..",
                path: selectedFolder.parentPath,
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

        <Button onClick={onOpenDialog} className={classes.MiniButton}>
          {t("choose-folder-to-list-files")}{" "}
        </Button>
      </div>

      <Grid
        isLoading={isLoading}
        className="my-4"
        elements={items}
        getKey={(file) => file.path}
        renderElement={(file) => (
          <FileCard file={file} onFolderOpen={onFolderOpen} />
        )}
        elementWidth={350}
      />

      <Paginator
        count={paths.totalCount}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        onPageSelect={(pageNumber) => {
          loadPaths({ ...query, pageNumber });
          scrollToTop();
        }}
      />
    </Container>
  );
};

type FileCardProps = {
  file: FileInfo;
  onFolderOpen: (folderToOpen: FileInfo) => void;
};

const FileCard = ({ file, onFolderOpen }: FileCardProps) => {
  const { gameStateAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.localSaves" });

  const uploadState = async (folder: {
    gameId?: string;
    gameName?: string;
    path: string;
    name: string;
  }) => {
    await gameStateAPI.uploadState({
      gameId: folder.gameId,
      localPath: folder.path,
      name: folder.gameName || folder.name,
      isPublic: false,
    });
  };

  const onUpload = async (folder: {
    gameId?: string;
    gameName?: string;
    path: string;
    name: string;
  }) => {
    try {
      notify.promise(uploadState(folder), {
        loading: t("game-state-uploading"),
        success: t("game-state-uploaded"),
        error: t("game-state-upload-error"),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FadedCard
      imageURL={file.gameIconURL || ""}
      className={classes.FileCard}
      data-type={file.gameId ? "file" : file.type}
      onClick={() => {
        if (file.type === "folder" && !file.gameId) {
          onFolderOpen(file);
        }
      }}
    >
      <div className={classes.FileActions}>
        <Button onClick={() => onUpload(file)}>
          <UploadIcon />
          {t("upload")}
        </Button>
      </div>

      <div className={classes.FileCardInfo}>
        <div className={classes.FileInfo}>
          <p className={classes.FileName}>
            {file.type === "folder" ? (
              <FolderIcon className={classes.Icon} />
            ) : (
              <FileIcon className={classes.Icon} />
            )}{" "}
            <span>{file.name}</span>
          </p>

          {!!file.size && (
            <p>
              size: <Bytes bytes={file.size} />
            </p>
          )}

          {!!file.mtime && <p>modified: {file.mtime.toLocaleDateString()}</p>}
        </div>

        {!!file.gameId && (
          <div className={classes.GameInfo}>
            <span>{file.gameName}</span>
          </div>
        )}
      </div>
    </FadedCard>
  );
};
