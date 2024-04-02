import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";

import classes from "./my-save-page.module.scss";

import { GameState, GameStateSync } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useAuthContext } from "@/client/contexts/AuthContext";
import { navigate } from "@/client/useHashLocation";
import { paths } from "@/client/config/paths";
import { syncMap } from "../utils";

import { H1, H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Bytes } from "@/client/ui/atoms/Bytes/Bytes";
import { Container } from "@/client/ui/atoms/Container/Container";
import { Button } from "@/client/ui/atoms/Button/Button";
import { Flex } from "@/client/ui/atoms/Flex";
import { Modal } from "@/client/ui/molecules/Modal/Modal";
import { ConfirmButton } from "@/client/ui/molecules/ConfirmButton/ConfirmButton";
import { PolyButton } from "@/client/ui/molecules/PolyButton/PolyButton";
import { SharesWidget } from "@/client/lib/components/SharesWidget";
import { ParametersView } from "@/client/lib/components/ParametersView/ParametersView";

export const MySavePage = () => {
  const { gameStateAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySave" });

  const [gameState, setGameState] = useState<GameState | null>(null);
  const { notify } = useUIContext();
  const { user } = useAuthContext();

  const { gameStateId } = useParams();
  useEffect(() => {
    (async () => {
      if (!gameStateId) return;
      try {
        const data = await gameStateAPI.getGameState(gameStateId);
        setGameState(data);
      } catch (error) {
        notify.error(error);
        setGameState(null);
      }
    })();
  }, []);

  const [syncSettingsAreOpen, setSyncSettingsAreOpen] = useState(false);
  const [sync, setSync] = useState<GameStateSync>(GameStateSync.NO);

  if (!gameState || !gameStateId) {
    return (
      <Container>
        <H1>{t("game-save-not-found")}</H1>
      </Container>
    );
  }

  const setupSync = async () => {
    try {
      await gameStateAPI.setupSync({
        userId: user.id,
        gameStateId: gameState.id,
        sync: sync,
      });
      setGameState({
        ...gameState,
        sync: sync,
      });
      setSyncSettingsAreOpen(false);
    } catch (error) {
      notify.error(error);
    }
  };

  const togglePublicity = async () => {
    try {
      await gameStateAPI.reuploadState({
        ...gameState,
        isPublic: !gameState.isPublic,
      });
      const data = await gameStateAPI.getGameState(gameStateId);
      setGameState(data);
    } catch (error) {
      notify.error(error);
    }
  };

  const onReuploadState = async () => {
    try {
      await gameStateAPI.reuploadState(gameState);
    } catch (error) {
      notify.error(error);
    }
  };

  const downloadState = async () => {
    try {
      const response = await gameStateAPI.downloadState(gameState);
      console.log(response);
    } catch (error) {
      notify.error(error);
    }
  };

  const downloadStateAs = async () => {
    try {
      const response = await gameStateAPI.downloadStateAs(gameState);
      console.log(response);
    } catch (error) {
      notify.error(error);
    }
  };

  const deleteState = async (gameStateId: string) => {
    try {
      await gameStateAPI.deleteState(gameStateId);
      navigate(paths.mySaves({}));
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container className={classes.MySavePage}>
      <H1 className={classes.GameStateName}>
        <img
          src={gameState.gameIconURL || "https://via.placeholder.com/64"}
          alt={gameState.name}
          className={classes.GameIcon}
        />{" "}
        {gameState?.name || t("save")}
      </H1>

      <div className={classes.GameSaveSettings}>
        <div className={classes.GameSaveSettingsLeft}>
          <Paragraph>
            {t("path")}: {gameState?.localPath}
          </Paragraph>
          <Paragraph>
            {t("sync")}: {t(syncMap[gameState?.sync])}{" "}
            <Button
              onClick={() => {
                setSyncSettingsAreOpen(true);
                setSync(gameState.sync);
              }}
            >
              {t("setup-sync")}{" "}
            </Button>
          </Paragraph>
          <Paragraph>
            {t("is-public")}: {gameState.isPublic ? t("yes") : t("no")}{" "}
            <Button onClick={togglePublicity}>
              {gameState.isPublic ? t("make-private") : t("make-public")}
            </Button>
          </Paragraph>
          <Paragraph>
            {t("shared-with")}: <SharesWidget gameStateId={gameState.id} />
          </Paragraph>
        </div>

        <Flex fxdc ais gap="0.5rem" className={classes.GameSaveSettingsRight}>
          <Button onClick={onReuploadState}>{t("upload-save")}</Button>
          <ConfirmButton
            onClick={() => {
              deleteState(gameState.id);
            }}
            color="danger"
          >
            {t("delete-save")}{" "}
          </ConfirmButton>
        </Flex>
      </div>

      <Modal
        isOpen={syncSettingsAreOpen}
        closeModal={() => setSyncSettingsAreOpen(false)}
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
          onClick={setupSync}
          className={classes.SyncSettingsConfirmButton}
        >
          {t("confirm")}{" "}
        </Button>
      </Modal>

      <H2>{t("about")}</H2>

      <ParametersView gameStateValues={gameState.gameStateValues} />

      <div className={classes.GameSaveArchive}>
        <span>
          {t("size")}: <Bytes bytes={gameState.sizeInBytes} />
        </span>
        <span>
          {t("uploaded-at")} {gameState.createdAt}
        </span>

        <div className={classes.Buttons}>
          <PolyButton
            subActions={[
              {
                onClick: downloadStateAs,
                children: t("download-as"),
                key: "1",
              },
            ]}
            onClick={downloadState}
          >
            {t("download")}
          </PolyButton>
        </div>
      </div>
    </Container>
  );
};
