import { useEffect, useState } from "react";
import { clsx } from "clsx";
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

const placeholderSrc = "/public/placeholder.jpg";

export const GameStatePageLayout = (props: GameStatePageLayoutProps) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || props.gameImageURL);

  const customClass =
    placeholderSrc && imgSrc === placeholderSrc
      ? classes.ImageLoading
      : classes.ImageLoaded;

  useEffect(() => {
    if (!props.gameImageURL) return;
    let mounted = true;
    const img = new Image();
    img.src = props.gameImageURL;
    img.onload = () => {
      if (mounted) {
        setImgSrc(props.gameImageURL);
      }
    };

    return () => {
      mounted = false;
    };
  }, [props.gameImageURL]);

  if (props.isLoading) {
    return (
      <div className={classes.GameStatePage}>
        <div
          className={clsx(classes.GameImage, customClass)}
          style={{ backgroundImage: `url(${imgSrc})` }}
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
        style={{ backgroundImage: `url(${imgSrc})` }}
      >
        <div className={classes.GameImageOverlay} />
      </div>

      <Container className={classes.PageContent}>{props.children}</Container>
    </div>
  );
};
