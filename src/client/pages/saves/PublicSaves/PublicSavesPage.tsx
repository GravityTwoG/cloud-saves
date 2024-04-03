import { useTranslation } from "react-i18next";

import classes from "./public-saves-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { paths } from "@/client/config/paths";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { Grid } from "@/client/ui/molecules/Grid";
import { GameStateCard } from "@/client/lib/components/GameStateCard";

export const PublicSavesPage = () => {
  const { gameStateAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.publicSaves" });

  const {
    query,
    resource: gameStates,
    onSearch,
    loadResource: loadSaves,
    setQuery,
  } = useResource(gameStateAPI.getPublicStates);

  return (
    <Container>
      <H1>{t("public-saves")}</H1>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <Grid
        className={classes.SavesList}
        elements={gameStates.items}
        getKey={(gameState) => gameState.id}
        renderElement={(gameState) => (
          <GameStateCard
            gameState={gameState}
            href={paths.save({ gameStateId: gameState.id })}
          />
        )}
      />

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={gameStates.totalCount}
        onPageSelect={(page) => loadSaves({ ...query, pageNumber: page })}
      />
    </Container>
  );
};
