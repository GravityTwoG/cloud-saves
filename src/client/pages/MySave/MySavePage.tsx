import { useEffect, useState } from "react";
import { useParams } from "wouter";

import classes from "./my-save-page.module.scss";

import { GameSave, GameSaveSync, Metadata, MetadataType } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext/useAPIContext";
import { notify } from "@/client/ui/toast";
import { navigate } from "@/client/useHashLocation";
import { paths } from "@/client/config/routes";

import { H1, H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Bytes } from "@/client/ui/atoms/Bytes/Bytes";
import { Container } from "@/client/ui/atoms/Container/Container";
import { Button } from "@/client/ui/atoms/Button/Button";
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
      await gameSaveAPI.deleteSave(gameSaveArchiveId);
      navigate(paths.mySaves({}));
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container>
      <H1>{gameSave?.name || "Save"}</H1>

      <div className={classes.GameSaveSettings}>
        <div className={classes.GameSaveSettingsLeft}>
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

        <div>
          <Button
            onDoubleClick={() => {
              deleteSave(gameSave.id);
            }}
            color="danger"
          >
            Delete
          </Button>
        </div>
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

      <H2>About</H2>

      <MetadataView metadata={gameSave.metadata} />

      <div className={classes.GameSaveArchive}>
        <span>
          Size: <Bytes bytes={gameSave.size} />
        </span>
        <span>Uploaded at: {gameSave.createdAt}</span>

        <div className={classes.Buttons}>
          <Button
            onClick={async () => {
              downloadSave({
                id: gameSave.id,
                url: gameSave.archiveURL,
                size: gameSave.size,
                createdAt: gameSave.createdAt,
              });
            }}
          >
            Download
          </Button>
        </div>
      </div>
    </Container>
  );
};

type MetadataViewProps = {
  metadata: Metadata;
};

const MetadataView = (props: MetadataViewProps) => {
  return (
    <div>
      {props.metadata.fields.map((field, idx) => (
        <MetadataViewItem key={idx} {...field} />
      ))}
    </div>
  );
};

function formatTime(value: number, type: "seconds") {
  if (type === "seconds") {
    if (value < 60) {
      return `${value} seconds`;
    }
    const minutes = Math.floor(value / 60);

    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);

    return `${hours} hours`;
  }

  return `${value}`;
}

const MetadataViewItem = (props: {
  label: string;
  value: string | number | boolean;
  type: MetadataType;
  description: string;
}) => {
  if (props.type === "seconds" && typeof props.value === "number") {
    return (
      <div>
        <b>{props.label}</b>: {formatTime(props.value, props.type)}
      </div>
    );
  }

  return (
    <div>
      <b>{props.label}</b>: {props.value.toString()}
    </div>
  );
};
