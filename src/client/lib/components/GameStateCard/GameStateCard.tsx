import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import { GameState } from "@/types";
import { useConfirmModal } from "@/client/ui/hooks/useConfirmModal/useConfirmModal";

import classes from "./game-state-card.module.scss";

import { Link } from "wouter";
import { ThreeDotsMenu } from "@/client/ui/molecules/ThreeDotsMenu";

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
              {t("sync")}: {t(props.gameState.sync)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
