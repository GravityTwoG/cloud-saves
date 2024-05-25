import { useMemo } from "react";

import classes from "./filter-by-game.module.scss";

import { useResource } from "@/client/lib/hooks/useResource";
import { useAPIContext } from "@/client/contexts/APIContext";

import { Input } from "@/client/ui/atoms/Input";
import { ExpandedSelect } from "@/client/ui/atoms/Select/ExpandedSelect";
import { Preloader } from "@/client/ui/atoms/Preloader";
import { clsx } from "clsx";

export type FilterByGameProps = {
  onGameSelect: (gameId: string) => void;
  gameId: string;
  className?: string;
};

export const FilterByGame = (props: FilterByGameProps) => {
  const { gameAPI } = useAPIContext();

  const {
    query: gameQuery,
    resource: games,
    isLoading,
    onSearch,
    onSearchQueryChange,
  } = useResource(gameAPI.getGames);

  const gameOptions = useMemo(() => {
    return games.items.map((game) => ({
      label: game.name,
      value: game.id,
    }));
  }, [games]);

  return (
    <div className={props.className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <Input
          value={gameQuery.searchQuery}
          onChange={(e) => {
            if (e.target.value.trim().length === 0) {
              onSearchQueryChange("");
              return;
            }

            onSearchQueryChange(e.target.value);
          }}
          placeholder="Filter by game"
          className={classes.SearchInput}
        />
      </form>

      <Preloader isLoading={isLoading}>
        <ExpandedSelect
          options={gameOptions}
          value={props.gameId}
          onChange={(value) => {
            props.onGameSelect(value);
          }}
          canUnselect
          variant="vertical"
          className={clsx(classes.GamesList, "mt-4 w-full")}
        />
      </Preloader>
    </div>
  );
};
