import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useTranslation } from "react-i18next";

import classes from "./game-page.module.scss";

import { Game } from "@/types";
import { AddGameDTO } from "@/client/api/interfaces/IGameAPI";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { navigate } from "@/client/useHashLocation";
import { paths } from "@/client/config/paths";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { GameForm } from "../components/GameForm/GameForm";
import { ConfirmButton } from "@/client/ui/atoms/Button/";

export const GamePage = () => {
  const { gameAPI } = useAPIContext();
  const { gameId } = useParams();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.game" });

  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    if (!gameId) return;
    gameAPI.getGame(gameId).then(setGame).catch(notify.error);
  }, [gameId]);

  const onDelete = async (gameId: string) => {
    try {
      await gameAPI.deleteGame(gameId);
    } catch (error) {
      notify.error(error);
    }
  };

  const onSubmit = async (data: AddGameDTO) => {
    try {
      if (!gameId) return;

      await gameAPI.updateGame({
        id: gameId,
        name: data.name,
        description: data.description,
        icon: data.icon,
        paths: data.paths,
        extractionPipeline: data.extractionPipeline,
        gameStateParameters: data.gameStateParameters,
      });
      navigate(paths.games({}));
    } catch (error) {
      notify.error(error);
    }
  };

  if (!game) {
    return (
      <Container>
        <H1>{t("game-not-found")}</H1>
      </Container>
    );
  }

  return (
    <Container className={classes.GamePage}>
      <div className={classes.Header}>
        <img
          src={game.iconURL || "https://via.placeholder.com/64"}
          alt={game.name}
          className={classes.GameIcon}
        />{" "}
        <H1>{game.name}</H1>
      </div>

      <div className={classes.Actions}>
        <ConfirmButton
          onClick={() => {
            onDelete(game.id);
          }}
          color="danger"
        >
          {t("delete-game")}{" "}
        </ConfirmButton>
      </div>

      <GameForm game={game} onSubmit={onSubmit} />
    </Container>
  );
};
