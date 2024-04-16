import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import classes from "./game-state-archive.module.scss";

import { GameState } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";

import DownloadIcon from "@/client/ui/icons/Download.svg";
import { Bytes } from "@/client/ui/atoms/Bytes";
import { Paper } from "@/client/ui/atoms/Paper";
import { PolyButton } from "@/client/ui/atoms/Button";

export type GameStateArchiveProps = {
  gameState: GameState;
  className?: string;
};

export const GameStateArchive = (props: GameStateArchiveProps) => {
  const { gameStateAPI } = useAPIContext();
  const { notify } = useUIContext();
  const { t } = useTranslation(undefined, {
    keyPrefix: "components.GameStateArchive",
  });

  const downloadState = async () => {
    try {
      const response = await gameStateAPI.downloadState(props.gameState);
      console.log(response);
    } catch (error) {
      notify.error(error);
    }
  };

  const downloadStateAs = async () => {
    try {
      const response = await gameStateAPI.downloadStateAs(props.gameState);
      console.log(response);
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <Paper className={clsx(classes.GameStateArchive, props.className)}>
      <span>
        {t("size")}: <Bytes bytes={props.gameState.sizeInBytes} />
      </span>
      <span>
        {t("uploaded-at")} {props.gameState.uploadedAt}
      </span>

      <div className={classes.Buttons}>
        <PolyButton
          subActions={[
            {
              onClick: downloadStateAs,
              children: (
                <>
                  <DownloadIcon />
                  {t("download-to")}
                </>
              ),
              key: "1",
            },
          ]}
          onClick={downloadState}
        >
          <DownloadIcon />
          {t("download")}
        </PolyButton>
      </div>
    </Paper>
  );
};
