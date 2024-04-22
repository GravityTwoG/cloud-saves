import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";

import classes from "./my-save-page.module.scss";

import { GameState, GameStateSync } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useAuthContext } from "@/client/contexts/AuthContext";
import { navigate } from "@/client/app/useHashLocation";
import { paths } from "@/client/config/paths";

import UploadIcon from "@/client/ui/icons/Upload.svg";
import SyncIcon from "@/client/ui/icons/Sync.svg";
import { H1, H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Button, ConfirmButton } from "@/client/ui/atoms/Button";
import { Flex } from "@/client/ui/atoms/Flex";
import { Paper } from "@/client/ui/atoms/Paper";
import { GameStatePageLayout } from "@/client/layouts/GameStatePageLayout";
import { SharesWidget } from "@/client/lib/components/SharesWidget";
import { ParametersView } from "@/client/lib/components/ParametersView";
import { GameStateArchive } from "@/client/lib/components/GameStateArchive";
import { SyncSettingsModal } from "./SyncSettingsModal";

export const MySavePage = () => {
  const { gameStateAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { user } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySave" });

  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [syncSettingsAreOpen, setSyncSettingsAreOpen] = useState(false);

  const { gameStateId } = useParams();
  useEffect(() => {
    (async () => {
      if (!gameStateId) return;
      try {
        setIsLoading(true);
        const data = await gameStateAPI.getGameState(gameStateId);
        setGameState(data);
      } catch (error) {
        notify.error(error);
        setGameState(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if ((!gameState || !gameStateId) && !isLoading) {
    return (
      <GameStatePageLayout gameImageURL={""} isLoading={isLoading}>
        <H1>{t("game-save-not-found")}</H1>
      </GameStatePageLayout>
    );
  }
  if (!gameState) {
    return null;
  }

  const setupSync = async (sync: GameStateSync) => {
    try {
      await gameStateAPI.setupSync({
        username: user.username,
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

  const reuploadState = async (newGameState: GameState) => {
    await gameStateAPI.reuploadState(newGameState);
    setGameState(newGameState);
  };

  const onReuploadState = async (newGameState: GameState) => {
    try {
      await notify.promise(reuploadState(newGameState), {
        loading: t("updating-state"),
        success: t("updated-state"),
        error: t("update-state-error"),
      });
      const data = await gameStateAPI.getGameState(gameState.id);
      setGameState(data);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePublicity = () => {
    onReuploadState({
      ...gameState,
      isPublic: !gameState.isPublic,
    });
  };

  const onNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const eventTarget = e.target as unknown as {
        gameStateName: HTMLInputElement;
      };
      if (
        !eventTarget.gameStateName ||
        typeof eventTarget.gameStateName.value !== "string"
      )
        return;

      const newName = eventTarget.gameStateName.value;
      if (newName === gameState.name || !newName.trim()) {
        setIsNameEditing(false);
        return;
      }

      await onReuploadState({
        ...gameState,
        name: newName,
      });
      setIsNameEditing(false);
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
    <GameStatePageLayout
      gameImageURL={gameState.gameImageURL}
      isLoading={isLoading}
    >
      <H1 className={classes.GameStateName}>
        {isNameEditing ? (
          <form
            onSubmit={onNameChange}
            className={classes.GameStateNameForm}
            onBlur={() => setIsNameEditing(false)}
          >
            <input
              type="text"
              defaultValue={gameState.name}
              onBlur={() => setIsNameEditing(false)}
              className={classes.GameStateNameInput}
              name="gameStateName"
              autoFocus
            />
          </form>
        ) : (
          <span onClick={() => setIsNameEditing(true)}>{gameState.name}</span>
        )}
      </H1>

      <Paper className={clsx(classes.GameSaveSettings, "mb-4")}>
        <div className={classes.GameSaveSettingsLeft}>
          <Paragraph>{t("path")}:</Paragraph>
          <Paragraph>{gameState.localPath}</Paragraph>

          <Paragraph>{t("sync")}:</Paragraph>
          <Paragraph>
            {t(gameState.sync)}{" "}
            <Button onClick={() => setSyncSettingsAreOpen(true)}>
              <SyncIcon />
              {t("setup-sync")}{" "}
            </Button>
          </Paragraph>

          <Paragraph>{t("is-public")}:</Paragraph>
          <Paragraph>
            {gameState.isPublic ? t("yes") : t("no")}{" "}
            <Button onClick={togglePublicity}>
              {gameState.isPublic ? t("make-private") : t("make-public")}
            </Button>
          </Paragraph>

          <Paragraph>{t("shared-with")}:</Paragraph>
          <Paragraph>
            <SharesWidget gameStateId={gameState.id} />
          </Paragraph>
        </div>

        <Flex fxdc ais gap="0.5rem" className={classes.GameSaveSettingsRight}>
          <Button onClick={() => onReuploadState(gameState)}>
            <UploadIcon /> {t("reupload-state")}
          </Button>
          <ConfirmButton
            onClick={() => {
              deleteState(gameState.id);
            }}
            color="danger"
          >
            {t("delete-state")}{" "}
          </ConfirmButton>
        </Flex>
      </Paper>

      <SyncSettingsModal
        isOpen={syncSettingsAreOpen}
        closeModal={() => setSyncSettingsAreOpen(false)}
        defaultValue={gameState.sync}
        setupSync={setupSync}
      />

      <H2>{t("about")}</H2>

      <ParametersView
        className="mb-4"
        gameStateValues={gameState.gameStateValues}
      />

      <GameStateArchive className="mb-4" gameState={gameState} />
    </GameStatePageLayout>
  );
};
