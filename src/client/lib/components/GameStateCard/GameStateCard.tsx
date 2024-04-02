import { GameState } from "@/types";

import classes from "./game-state-card.module.scss";
import { clsx } from "clsx";
import { Link } from "wouter";
import { ThreeDotsMenu } from "@/client/ui/molecules/ThreeDotsMenu";
import { useTranslation } from "react-i18next";
import { syncMap } from "@/client/pages/MySaves/utils";
import { useConfirmModal } from "@/client/ui/hooks/useConfirmModal/useConfirmModal";

export type GameStateCardProps = {
  gameState: GameState;
  className?: string;
  onDelete?: (gameStateId: string) => void;
  href: string;
};

export const GameStateCard = (props: GameStateCardProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "components.GameStateCard",
  });

  const { modal, onClick: onDelete } = useConfirmModal({
    onConfirm: () => props.onDelete?.(props.gameState.id),
  });

  return (
    <div
      className={clsx(classes.GameStateCard, props.className)}
      style={{
        backgroundImage: `url(${props.gameState.gameIconURL})`,
      }}
    >
      <Link href={props.href} className={classes.GameStateLink}>
        <div className={classes.GameStateCardInner}>
          {props.onDelete && (
            <ThreeDotsMenu
              className={classes.GameStateActions}
              menuItems={[
                {
                  onClick: () => onDelete(),
                  children: "Delete",
                  key: "delete",
                },
              ]}
            />
          )}
          {modal}

          <div className={classes.GameStateInfo}>
            <p>{props.gameState.name}</p>
            <p>
              {t("sync")}: {t(syncMap[props.gameState.sync])}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
