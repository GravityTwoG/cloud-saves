import { useTranslation } from "react-i18next";

import { useAPIContext } from "@/client/shared/contexts/APIContext";
import { useResourceWithSync } from "@/client/shared/hooks/useResource";
import { paths } from "@/client/config/paths";
import { scrollToTop } from "@/client/ui/lib/scrollToTop";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { Flex } from "@/client/ui/atoms/Flex";
import { Grid } from "@/client/ui/molecules/Grid";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { GameStateCard } from "@/client/entities/GameState/GameStateCard";
import { FilterByGame } from "@/client/entities/Game/FilterByGame";

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
    _loadResource,
  } = useResourceWithSync(gameStateAPI.getPublicStates, {
    searchQuery: "",
    pageNumber: 1,
    pageSize: 12,
    gameId: "",
  });

  return (
    <Container>
      <H1>{t("public-saves")}</H1>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={onSearchQueryChange}
      />

      <Flex aifs jcs>
        <FilterByGame
          gameId={query.gameId || ""}
          onGameSelect={(gameId) =>
            _loadResource({ ...query, gameId, pageNumber: 1 })
          }
          className="mt-4 mr-4"
        />

        <div className="w-full">
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
        </div>
      </Flex>
    </Container>
  );
};
