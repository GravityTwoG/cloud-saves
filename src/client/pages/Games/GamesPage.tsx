import { useTranslation } from "react-i18next";

import classes from "./games-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useResource } from "@/client/lib/hooks/useResource";
import { useUIContext } from "@/client/contexts/UIContext";
import { useParameterTypesModal } from "./components/ParameterTypesWidget";
import { useCommonParametersModal } from "./components/CommonParametersWidget";

import { Link } from "wouter";
import { H1 } from "@/client/ui/atoms/Typography";
import { Button, ConfirmButton } from "@/client/ui/atoms/Button";
import { Container } from "@/client/ui/atoms/Container";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm";

export const GamesPage = () => {
  const { gameAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  const {
    query,
    resource: games,
    onSearch,
    loadResource: loadGames,
    setQuery,
  } = useResource(gameAPI.getGames);

  const onDelete = async (gameId: string) => {
    try {
      await gameAPI.deleteGame(gameId);
      loadGames(query);
    } catch (error) {
      notify.error(error);
    }
  };

  const [parameterTypesModal, openParameterTypesModal] =
    useParameterTypesModal();
  const [commonParametersModal, openCommonParametersModal] =
    useCommonParametersModal();

  return (
    <Container>
      <div className={classes.Header}>
        <H1>{t("games")}</H1>
        <CommonLink href={paths.gameAdd({})}>{t("add-game")}</CommonLink>
      </div>

      <div className={classes.GameActions}>
        <Button onClick={openParameterTypesModal}>
          {t("parameter-types")}
        </Button>
        <Button onClick={openCommonParametersModal}>
          {t("common-parameters")}
        </Button>
      </div>

      {parameterTypesModal}
      {commonParametersModal}

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
        className={classes.GamesList}
        elements={games.items}
        getKey={(game) => game.id}
        elementClassName={classes.GameItem}
        renderElement={(game) => (
          <>
            <Link
              className={classes.GameLink}
              href={paths.game({ gameId: game.id })}
            >
              <img
                src={game.iconURL || "https://via.placeholder.com/64"}
                alt={game.name}
                className={classes.GameIcon}
              />
              <span>{game.name}</span>
            </Link>

            <div>
              <ConfirmButton
                onClick={() => {
                  onDelete(game.id);
                }}
                color="danger"
              >
                {t("games-delete-game")}{" "}
              </ConfirmButton>
            </div>
          </>
        )}
      />

      <Paginator
        scope={3}
        currentPage={query.pageNumber}
        pageSize={query.pageSize}
        count={games.totalCount}
        onPageSelect={(pageNumber) => loadGames({ ...query, pageNumber })}
      />
    </Container>
  );
};
