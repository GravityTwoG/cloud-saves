import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./local-saves-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { ResourceRequest } from "@/client/api/interfaces/common";

import { Bytes } from "@/client/ui/atoms/Bytes";
import { Button } from "@/client/ui/atoms/Button";
import { Container } from "@/client/ui/atoms/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Grid } from "@/client/ui/molecules/Grid";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { FadedCard } from "@/client/ui/atoms/FadedCard";

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
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySaves" });

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
    setQuery,
    onSearch,
    resource: paths,
    loadResource,
  } = useResource(gameStateAPI.getStatePaths);

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
    loadResource(query);
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
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <Paragraph>
        {t("folder")}: {selectedFolder.path}
      </Paragraph>

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
        onPageSelect={(pageNumber) => loadPaths({ ...query, pageNumber })}
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
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySaves" });

  const uploadState = async (folder: {
    gameId?: string;
    gameName?: string;
    path: string;
    name: string;
  }) => {
    try {
      await gameStateAPI.uploadState({
        gameId: folder.gameId,
        localPath: folder.path,
        name: folder.gameName || folder.name,
        isPublic: false,
      });
      notify.success(t("game-state-uploaded"));
    } catch (e) {
      notify.error(e);
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
        <Button onClick={() => uploadState(file)}>{t("upload")}</Button>
      </div>

      <div className={classes.FileCardInfo}>
        <div className={classes.FileInfo}>
          <p>
            {`${file.type === "folder" ? t("folder") : t("file")}: `}
            {file.name}
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
