import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import classes from "./my-saves-widget.module.scss";

import { paths } from "@/client/config/paths";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { syncMap } from "../utils";

import { Link } from "wouter";
import { H2, Paragraph } from "@/client/ui/atoms/Typography";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";
import { ConfirmButton } from "@/client/ui/molecules/ConfirmButton/ConfirmButton";

export type SavesWidgetProps = {
  setOnSaveUpload: (saveUploaded: () => void) => void;
  className?: string;
};

export const MySavesWidget = (props: SavesWidgetProps) => {
  const { gameSaveAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySaves" });

  const {
    query,
    resource: saves,
    onSearch,
    loadResource: loadSaves,
    setQuery,
  } = useResource(gameSaveAPI.getUserSaves);

  useEffect(() => {
    props.setOnSaveUpload(() => loadSaves(query));
  }, [query]);

  const onDelete = async (path: string) => {
    try {
      await gameSaveAPI.deleteSave(path);
      loadSaves(query);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <div className={clsx(props.className)}>
      <H2>{t("uploaded-saves")}</H2>
      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
        className={classes.SavesList}
        elements={saves.items}
        getKey={(save) => save.gameId}
        renderElement={(save) => (
          <>
            <div>
              <Link
                className={classes.GameSaveLink}
                href={paths.mySave({ gameSaveId: save.id })}
              >
                {save.name}
              </Link>
              <Paragraph>
                {t("sync")}: {t(syncMap[save.sync])}
              </Paragraph>
            </div>

            <div className={classes.Buttons}>
              <ConfirmButton
                onClick={() => {
                  onDelete(save.id);
                }}
                color="danger"
              >
                {t("delete-save")}{" "}
              </ConfirmButton>
            </div>
          </>
        )}
      />

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={saves.totalCount}
        onPageSelect={(page) => loadSaves({ ...query, pageNumber: page })}
      />
    </div>
  );
};
