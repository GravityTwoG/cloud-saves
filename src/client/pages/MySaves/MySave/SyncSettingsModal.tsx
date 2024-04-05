import { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./my-save-page.module.scss";

import { GameStateSync } from "@/types";

import { Button } from "@/client/ui/atoms/Button";
import { Paragraph } from "@/client/ui/atoms/Typography";
import { Modal } from "@/client/ui/molecules/Modal";

type SyncSettingsModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  defaultValue: GameStateSync;
  setupSync: (sync: GameStateSync) => void;
};

export const SyncSettingsModal = (props: SyncSettingsModalProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySave" });

  const [sync, setSync] = useState<GameStateSync>(props.defaultValue);

  return (
    <Modal
      isOpen={props.isOpen}
      closeModal={props.closeModal}
      title={t("sync-settings")}
    >
      <Paragraph>{t("select-period")}</Paragraph>

      <div className={classes.SyncSettingsPeriods}>
        <Button
          onClick={() => setSync(GameStateSync.NO)}
          color={sync === GameStateSync.NO ? "primary" : "secondary"}
        >
          {t("no")}{" "}
        </Button>
        <Button
          onClick={() => setSync(GameStateSync.EVERY_HOUR)}
          color={sync === GameStateSync.EVERY_HOUR ? "primary" : "secondary"}
        >
          {t("every-hour")}{" "}
        </Button>
        <Button
          onClick={() => setSync(GameStateSync.EVERY_DAY)}
          color={sync === GameStateSync.EVERY_DAY ? "primary" : "secondary"}
        >
          {t("every-day")}{" "}
        </Button>
        <Button
          onClick={() => setSync(GameStateSync.EVERY_WEEK)}
          color={sync === GameStateSync.EVERY_WEEK ? "primary" : "secondary"}
        >
          {t("every-week")}{" "}
        </Button>
        <Button
          onClick={() => setSync(GameStateSync.EVERY_MONTH)}
          color={sync === GameStateSync.EVERY_MONTH ? "primary" : "secondary"}
        >
          {t("every-month")}{" "}
        </Button>
      </div>

      <Button
        onClick={() => props.setupSync(sync)}
        className={classes.SyncSettingsConfirmButton}
      >
        {t("confirm")}{" "}
      </Button>
    </Modal>
  );
};
