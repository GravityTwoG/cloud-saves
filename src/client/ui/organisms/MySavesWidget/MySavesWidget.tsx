import { useEffect, useState } from "react";
import { clsx } from "clsx";

import classes from "./my-saves-widget.module.scss";

import { GameSave } from "@/types";
import { paths } from "@/client/config/routes";
import { useAPIContext } from "@/client/contexts/APIContext";

import { Link } from "wouter";
import { H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Input } from "@/client/ui/atoms/Input/Input";
import { Button } from "@/client/ui/atoms/Button/Button";
import SearchIcon from "@/client/ui/icons/Search.svg";
import { List } from "@/client/ui/molecules/List/List";

export type SavesWidgetProps = {
  className?: string;
};

export const MySavesWidget = (props: SavesWidgetProps) => {
  const { gameSaveAPI } = useAPIContext();
  const [saves, setSaves] = useState<GameSave[]>([]);
  const [synchronized, setSynchronized] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await gameSaveAPI.getUserSaves();
      setSaves(data);
    })();
  }, []);

  const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const onDelete = async (path: string) => {
    await gameSaveAPI.deleteSave(path);
    const data = await gameSaveAPI.getUserSaves();
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

      <div className={classes.SearchFilters}>
        <Button
          onClick={() => setSynchronized(!synchronized)}
          color={synchronized ? "secondary" : "primary"}
        >
          Synchronized
        </Button>
      </div>

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
                {save.name}
              </Link>
              <Paragraph>Sync: {save.sync}</Paragraph>
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
