import { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./my-save-page.module.scss";

import { GameStateSync } from "@/types";

import { Button } from "@/client/ui/atoms/Button";
import { Paragraph } from "@/client/ui/atoms/Typography";
import { Modal } from "@/client/ui/molecules/Modal";
import { ExpandedSelect } from "@/client/ui/atoms/Select/ExpandedSelect";

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

      <div className="mb-2">
        <ExpandedSelect
          options={[
            { value: GameStateSync.NO, label: t("no") },
            { value: GameStateSync.EVERY_HOUR, label: t("every-hour") },
            { value: GameStateSync.EVERY_DAY, label: t("every-day") },
            { value: GameStateSync.EVERY_WEEK, label: t("every-week") },
            { value: GameStateSync.EVERY_MONTH, label: t("every-month") },
          ]}
          value={sync}
          onChange={(option) => setSync(option)}
        />
      </div>

      <Button
        onClick={() => props.setupSync(sync)}
        className={classes.SyncSettingsConfirmButton}
      >
        {t("confirm")}
      </Button>
    </Modal>
  );
};
