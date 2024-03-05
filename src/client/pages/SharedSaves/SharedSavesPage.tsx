import { useEffect, useState } from "react";

import classes from "./shared-saves-page.module.scss";

import { notify } from "@/client/ui/toast";
import { useDebouncedCallback } from "@/client/lib/hooks/useDebouncedCallback";
import { GetSavesQuery } from "@/client/api/interfaces/IGameSaveAPI";
import { GameSave } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext/useAPIContext";
import { paths } from "@/client/config/routes";

import { Link } from "wouter";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";

export const SharedSavesPage = () => {
  const { gameSaveAPI } = useAPIContext();
  const [query, setQuery] = useState(() => ({
    searchQuery: "",
    pageNumber: 1,
    pageSize: 12,
  }));

  const [saves, setSaves] = useState<{ saves: GameSave[]; totalCount: number }>(
    () => ({
      saves: [],
      totalCount: 0,
    })
  );

  const onSearch = () => {};

  const loadSaves = useDebouncedCallback(
    async (query: GetSavesQuery) => {
      try {
        const data = await gameSaveAPI.getSharedSaves(query);
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

  useEffect(() => {
    loadSaves(query);
  }, []);

  return (
    <Container>
      <H1>Shared Saves</H1>

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
    </Container>
  );
};
