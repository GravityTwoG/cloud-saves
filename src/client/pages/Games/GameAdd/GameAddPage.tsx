import { useTranslation } from "react-i18next";

import classes from "./game-add-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { navigate } from "@/client/app/useHashLocation";
import { paths } from "@/client/config/paths";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { GameForm } from "../components/GameForm/GameForm";
import { AddGameDTO } from "@/client/api/interfaces/IGameAPI";

export const GameAddPage = () => {
  const { gameAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.addGame" });

  const onSubmit = async (data: AddGameDTO) => {
    try {
      await gameAPI.addGame({
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

  return (
    <Container className={classes.GameAddPage}>
      <H1>{t("add-game")}</H1>

      <GameForm onSubmit={onSubmit} />
    </Container>
  );
};
