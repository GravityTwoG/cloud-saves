import classes from "./game-state-page-layout.module.scss";

import { Container } from "@/client/ui/atoms/Container";

export type GameStatePageLayoutProps = {
  gameImageURL: string;
  children?: React.ReactNode;
};

export const GameStatePageLayout = (props: GameStatePageLayoutProps) => {
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
