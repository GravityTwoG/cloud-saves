import { useEffect, useState } from "react";
import { clsx } from "clsx";

import classes from "./saves-widget.module.scss";

import { GameSave } from "@/types";
import * as gamesavesApi from "@/client/api/gamesave";
import { paths } from "@/client/config/routes";

import { Link } from "wouter";
import { H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Input } from "@/client/ui/atoms/Input/Input";
import { Button } from "@/client/ui/atoms/Button/Button";
import SearchIcon from "@/client/ui/icons/Search.svg";
import { List } from "@/client/ui/molecules/List/List";

export type SavesWidgetProps = {
  className?: string;
};

export const SavesWidget = (props: SavesWidgetProps) => {
  const [saves, setSaves] = useState<GameSave[]>([]);

  useEffect(() => {
    (async () => {
      const data = await gamesavesApi.getUserSaves();
      setSaves(data);
    })();
  }, []);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onDelete = async (path: string) => {
    await gamesavesApi.deleteSave(path);
    const data = await gamesavesApi.getUserSaves();
    setSaves(data);
  };

  return (
    <div className={clsx(classes.SavesWidget, props.className)}>
      <H2>Uploaded Saves</H2>
      <form className={classes.SearchForm} onSubmit={onSearch}>
        <Input placeholder="Search" className={classes.SearchInput} />
        <Button
          type="submit"
          className={classes.SearchButton}
          title="Search"
          aria-label="Search"
        >
          <SearchIcon />
        </Button>
      </form>

      <List
        className={classes.SavesList}
        elements={saves}
        getKey={(save) => save.gameId}
        renderElement={(save) => (
          <>
            <div>
              <Link
                className={classes.GameSaveLink}
                href={paths.mySave({ gameSaveId: save.id })}
              >
                {save.path}
              </Link>
              <Paragraph>
                Sync enabled: {save.syncEnabled ? "yes" : "no"}
              </Paragraph>
            </div>

            <div className={classes.Buttons}>
              <Button
                onDoubleClick={() => {
                  onDelete(save.id);
                }}
                color="danger"
              >
                Delete
              </Button>
            </div>
          </>
        )}
      />
    </div>
  );
};
