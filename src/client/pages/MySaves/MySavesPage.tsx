import { useTranslation } from "react-i18next";

import classes from "./my-saves-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResource } from "@/client/lib/hooks/useResource";

import { H1, H2 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";
import { Grid } from "@/client/ui/molecules/Grid";
import { GameStateCard } from "@/client/lib/components/GameStateCard";

export const MySavesPage = () => {
  const { gameStateAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySaves" });

  const {
    query,
    resource: saves,
    onSearch,
    loadResource: loadSaves,
    setQuery,
  } = useResource(gameStateAPI.getUserStates);

  const onDelete = async (path: string) => {
    try {
      await gameStateAPI.deleteState(path);
      loadSaves(query);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container>
      <H1>{t("my-saves")}</H1>

      <CommonLink href={paths.localSaves({})}>{t("local-saves")}</CommonLink>

      <div>
        <H2>{t("uploaded-saves")}</H2>
        <SearchForm
          searchQuery={query.searchQuery}
          onSearch={onSearch}
          onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
        />

        <Grid
          className={classes.SavesList}
          elements={saves.items}
          getKey={(save) => save.gameId}
          renderElement={(save) => (
            <GameStateCard
              gameState={save}
              href={paths.mySave({ gameStateId: save.id })}
              onDelete={onDelete}
            />
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
    </Container>
  );
};
