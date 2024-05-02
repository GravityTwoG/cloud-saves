import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";

import classes from "./save-page.module.scss";

import { GameState } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";

import { Paper } from "@/client/ui/atoms/Paper";
import { H1, H2, Paragraph } from "@/client/ui/atoms/Typography";
import { GameStatePageLayout } from "@/client/layouts/GameStatePageLayout";
import { ParametersView } from "@/client/lib/components/ParametersView";
import { GameStateArchive } from "@/client/lib/components/GameStateArchive";

export const SavePage = () => {
  const { gameStateAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySave" });

  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { notify } = useUIContext();

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

  return (
    <GameStatePageLayout
      gameImageURL={gameState.gameImageURL}
      isLoading={isLoading}
    >
      <H1>{gameState.name}</H1>

      <Paper className={clsx(classes.GameSaveSettings, "mb-4")}>
        <div className={classes.GameSaveSettingsLeft}>
          <Paragraph>
            {t("path")}: {gameState.localPath}
          </Paragraph>
        </div>
      </Paper>

      <H2>{t("about")}</H2>

      <ParametersView
        className="mb-4"
        gameStateValues={gameState.gameStateValues}
      />

      <GameStateArchive className="mb-4" gameState={gameState} />
    </GameStatePageLayout>
  );
};
