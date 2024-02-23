import { useEffect, useState } from "react";

import classes from "./games-page.module.scss";

import { Game } from "@/types";
import { paths } from "@/client/config/routes";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useDebouncedCallback } from "@/client/lib/hooks/useDebouncedCallback";
import { GetGamesQuery } from "@/client/api/interfaces/IGameAPI";
import { notify } from "@/client/ui/toast";

import { Link } from "wouter";
import { H1 } from "@/client/ui/atoms/Typography";
import { Button } from "@/client/ui/atoms/Button/Button";
import { Container } from "@/client/ui/atoms/Container/Container";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { List } from "@/client/ui/molecules/List/List";
import { Paginator } from "@/client/ui/molecules/Paginator";
import { SearchForm } from "@/client/ui/molecules/SearchForm/SearchForm";

const defaultQuery: GetGamesQuery = {
  searchQuery: "",
  pageNumber: 1,
  pageSize: 12,
};

export const GamesPage = () => {
  const { gameAPI } = useAPIContext();

  const [games, setGames] = useState<{ games: Game[]; totalCount: number }>({
    games: [],
    totalCount: 0,
  });
  const [query, setQuery] = useState<GetGamesQuery>(defaultQuery);

  useEffect(() => {
    loadGames(query);
  }, []);

  const loadGames = useDebouncedCallback(
    async (query: GetGamesQuery) => {
      try {
        const data = await gameAPI.getGames(query);
        setGames({
          games: data.items,
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
    loadGames({ ...query, pageNumber: 1 });
  };

  const onDelete = async (gameId: string) => {
    try {
      await gameAPI.deleteGame(gameId);
      loadGames(query);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container>
      <div className={classes.Header}>
        <H1>Games</H1>
        <CommonLink href={paths.gameAdd({})}>Add Game</CommonLink>
      </div>

      <SearchForm
        searchQuery={query.searchQuery}
        onSearch={onSearch}
        onQueryChange={(searchQuery) => setQuery({ ...query, searchQuery })}
      />

      <List
        className={classes.GamesList}
        elements={games.games}
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
              <Button
                onDoubleClick={() => {
                  onDelete(game.id);
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
        count={games.totalCount}
        onPageSelect={(page) => loadGames({ ...query, pageNumber: page })}
      />
    </Container>
  );
};
