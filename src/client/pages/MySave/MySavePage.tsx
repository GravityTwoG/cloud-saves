import { useEffect, useState } from "react";
import { useParams } from "wouter";

import classes from "./my-save-page.module.scss";

import * as gamesavesApi from "../../api/gamesave";
import { GameSave } from "../../../types";

import { H1, Paragraph } from "../../ui/atoms/Typography";
import { Bytes } from "../../ui/atoms/Bytes/Bytes";
import { Container } from "../../ui/atoms/Container/Container";
import { List } from "../../ui/molecules/List/List";
import { Button } from "../../ui/atoms/Button/Button";

export const MySavePage = () => {
  const [gameSave, setGameSave] = useState<GameSave | null>(null);

  const { gameSaveId } = useParams();

  useEffect(() => {
    (async () => {
      if (!gameSaveId) return;

      const data = await gamesavesApi.getUserSave(gameSaveId);
      setGameSave(data);
    })();
  }, []);

  const onDelete = async (gameSaveArchiveId: string) => {
    if (!gameSave) return;

    await gamesavesApi.deleteGameSaveArchive(gameSaveArchiveId);
    setGameSave({
      ...gameSave,
      archives: gameSave.archives.filter(
        (save) => save.id !== gameSaveArchiveId
      ),
    });
  };

  return (
    <Container>
      <H1>{gameSave?.name || "Save"}</H1>

      <div>
        <Paragraph>Path: {gameSave?.path}</Paragraph>
        <Paragraph>
          Sync enabled: {gameSave?.syncEnabled ? "yes" : "no"}{" "}
          <Button
            onClick={async () => {
              if (!gameSave) return;

              await gamesavesApi.toggleSync(gameSave.id, !gameSave.syncEnabled);
              setGameSave({ ...gameSave, syncEnabled: !gameSave.syncEnabled });
            }}
          >
            {gameSave?.syncEnabled ? "Disable" : "Setup"} Sync
          </Button>
        </Paragraph>
        <Paragraph>
          Is public: no <Button>Make public</Button>
        </Paragraph>
        <Paragraph>
          Shared with: nobody <Button>Share</Button>
        </Paragraph>
      </div>

      <List
        className={classes.SavesList}
        elements={gameSave?.archives || []}
        getKey={(save) => save.id}
        renderElement={(save) => (
          <>
            <div>
              <Paragraph>
                Size: <Bytes bytes={save.size} />
              </Paragraph>
              <Paragraph>Uploaded at: {save.createdAt}</Paragraph>
            </div>

            <div className={classes.Buttons}>
              <Button
                onClick={async () => {
                  const response = await gamesavesApi.downloadSave(save.url);
                  console.log(response);
                }}
              >
                Download
              </Button>

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
    </Container>
  );
};
