import { useTranslation } from "react-i18next";

import { useAPIContext } from "@/client/shared/contexts/APIContext";
import { useResourceWithSync } from "@/client/shared/hooks/useResource";
import { paths } from "@/client/config/paths";
import { scrollToTop } from "@/client/ui/lib/scrollToTop";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { Grid } from "@/client/ui/molecules/Grid";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { GameStateCard } from "@/client/entities/GameState/GameStateCard";

export const SharedSavesPage = () => {
  const { gameStateAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.sharedSaves" });

  const {
    query,
    resource: gameStates,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
  } = useResourceWithSync(gameStateAPI.getSharedStates);

  return (
    <Container>
      <H1>{t("shared-saves")}</H1>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={onSearchQueryChange}
      />

      <Grid
        isLoading={isLoading}
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

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={gameStates.totalCount}
        onPageSelect={(pageNumber) => {
          onPageSelect(pageNumber);
          scrollToTop();
        }}
      />
    </Container>
  );
};
