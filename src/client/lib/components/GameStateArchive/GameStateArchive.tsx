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
import { Paragraph } from "@/client/ui/atoms/Typography";

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
      <Paragraph className={classes.Info}>
        <span>
          {t("size")}: <Bytes bytes={props.gameState.sizeInBytes} />
        </span>
        <span>
          {t("uploaded-at")} {formatDate(props.gameState.uploadedAt)}
        </span>
      </Paragraph>

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

function formatDate(dateString: string) {
  const data = new Date(dateString);
  const day = data.getDate().toString();
  const month = (data.getMonth() + 1).toString();
  const year = data.getFullYear();

  const hours = data.getHours().toString();
  const minutes = data.getMinutes().toString();

  return `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year} ${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}
