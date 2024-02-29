import classes from "./game-add-page.module.scss";

import { useAPIContext } from "@/client/contexts/APIContext/useAPIContext";
import { notify } from "@/client/ui/toast";
import { navigate } from "@/client/useHashLocation";
import { paths } from "@/client/config/routes";
import { GameFormData } from "../utils";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { GameForm } from "../GameForm/GameForm";

export const GameAddPage = () => {
  const { gameAPI } = useAPIContext();

  const onSubmit = async (data: GameFormData) => {
    try {
      await gameAPI.addGame({
        name: data.name,
        description: data.description,
        icon: data.icon[0] || "",
        paths: data.paths.map((path) => path.path),
        extractionPipeline: data.extractionPipeline,
        metadataSchema: data.metadataSchema,
      });

      navigate(paths.games({}));
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Container className={classes.GameAddPage}>
      <H1>Add Game</H1>

      <GameForm onSubmit={onSubmit} />
    </Container>
  );
};
