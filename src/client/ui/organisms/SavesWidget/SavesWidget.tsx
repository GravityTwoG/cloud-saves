import { useEffect, useState } from "react";
import clsx from "clsx";

import classes from "./saves-widget.module.scss";

import { GameSave } from "../../../../types";
import * as gamesavesApi from "../../../../external-api/gamesave";

import { H2 } from "../../atoms/Typography";
import { Input } from "../../atoms/Input/Input";
import { Bytes } from "../../atoms/Bytes/Bytes";
import { List } from "../../molecules/List/List";
import { Button } from "../../atoms/Button/Button";

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
        <Button type="submit" className={classes.SearchButton}>
          Search
        </Button>
      </form>

      <List
        className={classes.SavesList}
        elements={saves}
        getKey={(save) => save.gameId}
        renderElement={(save) => (
          <>
            <div>
              <p>{save.path}</p>
              <p>
                Size: <Bytes bytes={save.size} />
              </p>
            </div>

            <Button
              className={classes.Button}
              onClick={async () => {
                const response = await gamesavesApi.downloadSave(save.path);
                console.log(response);
              }}
            >
              Download
            </Button>

            <Button
              onClick={async () => {
                await gamesavesApi.toggleSync(save.path, !save.syncEnabled);
                const data = await gamesavesApi.getUserSaves();
                setSaves(data);
              }}
              className={clsx(classes.MiniButton, classes.FileButton)}
            >
              {save.syncEnabled ? "Disable" : "Enable"} Sync
            </Button>

            <Button
              onDoubleClick={() => {
                onDelete(save.path);
              }}
              className={clsx(classes.MiniButton, classes.FileButton)}
              color="danger"
            >
              Delete
            </Button>
          </>
        )}
      />
    </div>
  );
};
