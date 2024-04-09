import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import { GameState } from "@/types";
import { useConfirmModal } from "@/client/ui/hooks/useConfirmModal/useConfirmModal";

import classes from "./game-state-card.module.scss";

import { FadedCard } from "@/client/ui/atoms/FadedCard";
import { ThreeDotsMenu } from "@/client/ui/molecules/ThreeDotsMenu";

export type GameStateCardProps = {
  gameState: GameState;
  className?: string;
  onDelete?: (gameStateId: string) => void;
  showSyncSettings?: boolean;
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
    <FadedCard
      imageURL={props.gameState.gameImageURL}
      href={props.href}
      className={clsx(classes.GameStateCard, props.className)}
    >
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
        <p className={classes.GameStateName}>{props.gameState.name}</p>

        {props.showSyncSettings && (
          <p>
            {t("sync")}: {t(props.gameState.sync)}
          </p>
        )}
      </div>
    </FadedCard>
  );
};
