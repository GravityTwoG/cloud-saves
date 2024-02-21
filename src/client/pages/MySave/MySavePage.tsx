import { useEffect, useState } from "react";
import { useParams } from "wouter";

import classes from "./my-save-page.module.scss";

import { GameSave, GameSaveSync } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { notify } from "@/client/ui/toast";

import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Bytes } from "@/client/ui/atoms/Bytes/Bytes";
import { Container } from "@/client/ui/atoms/Container/Container";
import { Button } from "@/client/ui/atoms/Button/Button";
import { List } from "@/client/ui/molecules/List/List";
import { Modal } from "@/client/ui/molecules/Modal/Modal";

export const MySavePage = () => {
  const { gameSaveAPI } = useAPIContext();
  const [gameSave, setGameSave] = useState<GameSave | null>(null);
  const { gameSaveId } = useParams();

  useEffect(() => {
    (async () => {
      if (!gameSaveId) return;
      try {
        const data = await gameSaveAPI.getUserSave(gameSaveId);
        setGameSave(data);
      } catch (error) {
        notify.error(error);
        setGameSave(null);
      }
    })();
  }, []);

  const [syncSettingsAreOpen, setSyncSettingsAreOpen] = useState(false);
  const [sync, setSync] = useState<GameSaveSync>(GameSaveSync.NO);

  if (!gameSave) {
    return (
      <Container>
        <H1>Game Save not found</H1>
      </Container>
    );
  }

  const setupSync = async () => {
    try {
      await gameSaveAPI.setupSync({
        gameSaveId: gameSave.id,
        sync: sync,
      });
      setGameSave({
        ...gameSave,
        sync: sync,
      });
      setSyncSettingsAreOpen(false);
    } catch (error) {
      notify.error(error);
    }
  };

  const downloadSave = async (save: {
    url: string;
    id: string;
    size: number;
    createdAt: string;
  }) => {
    try {
      const response = await gameSaveAPI.downloadSave(save.url);
      console.log(response);
    } catch (error) {
      notify.error(error);
    }
  };

  const deleteSave = async (gameSaveArchiveId: string) => {
    if (!gameSave) return;

    try {
      await gameSaveAPI.deleteGameSaveArchive(gameSaveArchiveId);
      setGameSave({
        ...gameSave,
        archives: gameSave.archives.filter(
          (save) => save.id !== gameSaveArchiveId
        ),
      });
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container>
      <H1>{gameSave?.name || "Save"}</H1>

      <div>
        <Paragraph>Path: {gameSave?.path}</Paragraph>
        <Paragraph>
          Sync: {gameSave?.sync}{" "}
          <Button
            onClick={() => {
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
          onClick={setupSync}
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
                  downloadSave(save);
                }}
              >
                Download
              </Button>

              <Button
                onDoubleClick={() => {
                  deleteSave(save.id);
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
