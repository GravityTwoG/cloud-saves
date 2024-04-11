import classes from "./game-state-page-layout.module.scss";

import { Container } from "@/client/ui/atoms/Container";
import { H1, H2 } from "@/client/ui/atoms/Typography";
import { Paper } from "@/client/ui/atoms/Paper";
import { Preloader } from "@/client/ui/atoms/Preloader";

export type GameStatePageLayoutProps = {
  gameImageURL: string;
  isLoading: boolean;
  children?: React.ReactNode;
};

export const GameStatePageLayout = (props: GameStatePageLayoutProps) => {
  if (props.isLoading) {
    return (
      <div className={classes.GameStatePage}>
        <div
          className={classes.GameImage}
          style={{ backgroundImage: `url(${props.gameImageURL})` }}
        >
          <div className={classes.GameImageOverlay} />
        </div>

        <Container className={classes.PageContent}>
          <Preloader isLoading>
            <H1>-</H1>

            <Paper className="mb-4">-</Paper>

            <H2>-</H2>

            <Paper className="mb-4">-</Paper>

            <Paper className="mb-4">-</Paper>
          </Preloader>
        </Container>
      </div>
    );
  }

  return (
    <div className={classes.GameStatePage}>
      <div
        className={classes.GameImage}
        style={{ backgroundImage: `url(${props.gameImageURL})` }}
      >
        <div className={classes.GameImageOverlay} />
      </div>

      <Container className={classes.PageContent}>{props.children}</Container>
    </div>
  );
};
