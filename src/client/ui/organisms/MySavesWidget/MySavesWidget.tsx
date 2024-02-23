import { useEffect, useState } from "react";
import { clsx } from "clsx";

import classes from "./my-saves-widget.module.scss";

import { GameSave } from "@/types";
import { paths } from "@/client/config/routes";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useDebouncedCallback } from "@/client/lib/hooks/useDebouncedCallback";
import { GetSavesQuery } from "@/client/api/interfaces/IGameSaveAPI";
import { notify } from "@/client/ui/toast";

import { Link } from "wouter";
import { H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Button } from "@/client/ui/atoms/Button/Button";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "../../molecules/SearchForm/SearchForm";

const defaultQuery: GetSavesQuery = {
  searchQuery: "",
  pageNumber: 1,
  pageSize: 12,
};

export type SavesWidgetProps = {
  setOnSaveUpload: (saveUploaded: () => void) => void;
  className?: string;
};

export const MySavesWidget = (props: SavesWidgetProps) => {
  const { gameSaveAPI } = useAPIContext();

  const [saves, setSaves] = useState<{ saves: GameSave[]; totalCount: number }>(
    { saves: [], totalCount: 0 }
  );
  const [query, setQuery] = useState<GetSavesQuery>(defaultQuery);

  useEffect(() => {
    props.setOnSaveUpload(() => loadSaves(query));
  }, [query]);

  useEffect(() => {
    loadSaves(query);
  }, []);

  const loadSaves = useDebouncedCallback(
    async (query: GetSavesQuery) => {
      try {
        const data = await gameSaveAPI.getUserSaves(query);
        setSaves({
          saves: data.items,
          totalCount: data.totalCount,
        });
        setQuery(query);
      } catch (error) {
        notify.error(error);
      }
    },
    [],
    200
  );

  const onSearch = () => {
    loadSaves({ ...query, pageNumber: 1 });
  };

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
      <H2>Uploaded Saves</H2>
      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
        className={classes.SavesList}
        elements={saves.saves}
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
              <Paragraph>Sync: {save.sync}</Paragraph>
            </div>

            <div className={classes.Buttons}>
              <Button
                onDoubleClick={() => {
                  onDelete(save.id);
                }}
                color="danger"
              >
                Delete
              </Button>
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
