import { useEffect, useState } from "react";
import { useParams } from "wouter";

import classes from "./my-save-page.module.scss";

import * as gamesavesApi from "@/client/api/gamesave";
import { GameSave, GameSaveSync } from "@/types";

import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Bytes } from "@/client/ui/atoms/Bytes/Bytes";
import { Container } from "@/client/ui/atoms/Container/Container";
import { Button } from "@/client/ui/atoms/Button/Button";
import { List } from "@/client/ui/molecules/List/List";
import { Modal } from "@/client/ui/molecules/Modal/Modal";

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

  const [syncSettingsAreOpen, setSyncSettingsAreOpen] = useState(false);
  const [sync, setSync] = useState<GameSaveSync>(GameSaveSync.NO);

  const setupSync = async () => {
    if (!gameSave) return;

    await gamesavesApi.setupSync({
      gameSaveId: gameSave.id,
      sync: sync,
    });
    setGameSave({
      ...gameSave,
      sync: sync,
    });
  };

  return (
    <Container>
      <H1>{gameSave?.name || "Save"}</H1>

      <div>
        <Paragraph>Path: {gameSave?.path}</Paragraph>
        <Paragraph>
          Sync: {gameSave?.sync}{" "}
          <Button
            onClick={async () => {
              if (!gameSave) return;

              setSyncSettingsAreOpen(true);
              setSync(gameSave.sync);
            }}
          >
            Setup Sync
          </Button>
        </Paragraph>
        <Paragraph>
          Is public: no <Button>Make public</Button>
        </Paragraph>
        <Paragraph>
          Shared with: nobody <Button>Share</Button>
        </Paragraph>
      </div>

      <Modal
        isOpen={syncSettingsAreOpen}
        closeModal={() => setSyncSettingsAreOpen(false)}
        title="Sync settings"
      >
        <Paragraph>Select period:</Paragraph>

        <div className={classes.SyncSettingsPeriods}>
          <Button
            onClick={() => setSync(GameSaveSync.NO)}
            color={sync === GameSaveSync.NO ? "primary" : "secondary"}
          >
            No
          </Button>
          <Button
            onClick={() => setSync(GameSaveSync.EVERY_HOUR)}
            color={sync === GameSaveSync.EVERY_HOUR ? "primary" : "secondary"}
          >
            Every hour
          </Button>
          <Button
            onClick={() => setSync(GameSaveSync.EVERY_DAY)}
            color={sync === GameSaveSync.EVERY_DAY ? "primary" : "secondary"}
          >
            Every day
          </Button>
          <Button
            onClick={() => setSync(GameSaveSync.EVERY_WEEK)}
            color={sync === GameSaveSync.EVERY_WEEK ? "primary" : "secondary"}
          >
            Every week
          </Button>
          <Button
            onClick={() => setSync(GameSaveSync.EVERY_MONTH)}
            color={sync === GameSaveSync.EVERY_MONTH ? "primary" : "secondary"}
          >
            Every month
          </Button>
        </div>

        <Button
          onClick={async () => {
            if (!gameSave) return;

            setSyncSettingsAreOpen(false);
            setupSync();
          }}
          className={classes.SyncSettingsConfirmButton}
        >
          Confirm
        </Button>
      </Modal>

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
