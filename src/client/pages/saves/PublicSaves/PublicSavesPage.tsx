import { useTranslation } from "react-i18next";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { paths } from "@/client/config/paths";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { Grid } from "@/client/ui/molecules/Grid";
import { Preloader } from "@/client/ui/molecules/Preloader";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { GameStateCard } from "@/client/lib/components/GameStateCard";

export const PublicSavesPage = () => {
  const { gameStateAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.publicSaves" });

  const {
    query,
    resource: gameStates,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
  } = useResource(gameStateAPI.getPublicStates);

  return (
    <Container>
      <H1>{t("public-saves")}</H1>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={onSearchQueryChange}
      />

      <Preloader isLoading={isLoading}>
        <Grid
          className="my-4"
          elements={gameStates.items}
          getKey={(gameState) => gameState.id}
          renderElement={(gameState) => (
            <GameStateCard
              gameState={gameState}
              href={paths.save({ gameStateId: gameState.id })}
            />
          )}
        />
      </Preloader>

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={gameStates.totalCount}
        onPageSelect={onPageSelect}
      />
    </Container>
  );
};
