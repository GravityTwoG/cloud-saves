import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";

import classes from "./save-page.module.scss";

import { GameState } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";

import { H1, H2, Paragraph } from "@/client/ui/atoms/Typography";
import { Bytes } from "@/client/ui/atoms/Bytes";
import { Container } from "@/client/ui/atoms/Container";
import { PolyButton } from "@/client/ui/atoms/Button";
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
    <Container className={classes.SavePage}>
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
        </div>
      </div>

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
