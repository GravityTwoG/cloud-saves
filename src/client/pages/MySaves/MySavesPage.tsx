import { useTranslation } from "react-i18next";

import { paths } from "@/client/config/paths";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useResource } from "@/client/lib/hooks/useResource";

import { H1, H2 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Grid } from "@/client/ui/molecules/Grid";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";
import { Preloader } from "@/client/ui/molecules/Preloader";
import { GameStateCard } from "@/client/lib/components/GameStateCard";

export const MySavesPage = () => {
  const { gameStateAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySaves" });

  const {
    query,
    resource: gameStates,
    isLoading,
    onSearch,
    onSearchQueryChange,
    onPageSelect,
    _loadResource: loadSaves,
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
                href={paths.mySave({ gameStateId: gameState.id })}
                onDelete={onDelete}
                showSyncSettings
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
      </div>
    </Container>
  );
};
