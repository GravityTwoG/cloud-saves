import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";

import classes from "./save-page.module.scss";

import { GameState } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";

import { Bytes } from "@/client/ui/atoms/Bytes";
import { Paper } from "@/client/ui/atoms/Paper";
import { PolyButton } from "@/client/ui/atoms/Button";
import { Container } from "@/client/ui/atoms/Container";
import { H1, H2, Paragraph } from "@/client/ui/atoms/Typography";
import { ParametersView } from "@/client/lib/components/ParametersView";

export const SavePage = () => {
  const { gameStateAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.mySave" });

  const [gameState, setGameState] = useState<GameState | null>(null);
  const { notify } = useUIContext();

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

  if (!gameState || !gameStateId) {
    return (
      <Container>
        <H1>{t("game-save-not-found")}</H1>
      </Container>
    );
  }

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

  return (
    <div className={classes.SavePage}>
      <div
        className={classes.GameImage}
        style={{ backgroundImage: `url(${gameState.gameIconURL})` }}
      >
        <div className={classes.GameImageOverlay} />
      </div>

      <Container className={classes.PageContent}>
        <H1 className={classes.GameStateName}>
          {gameState?.name || t("save")}
        </H1>

        <Paper className={classes.GameSaveSettings}>
          <div className={classes.GameSaveSettingsLeft}>
            <Paragraph>
              {t("path")}: {gameState?.localPath}
            </Paragraph>
          </div>
        </Paper>

        <H2>{t("about")}</H2>

        <Paper>
          <ParametersView gameStateValues={gameState.gameStateValues} />
        </Paper>

        <Paper className={classes.GameSaveArchive}>
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
        </Paper>
      </Container>
    </div>
  );
};
