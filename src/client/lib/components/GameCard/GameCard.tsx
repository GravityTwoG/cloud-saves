import { clsx } from "clsx";

import { Game } from "@/types";
import { useConfirmModal } from "@/client/ui/hooks/useConfirmModal/useConfirmModal";

import classes from "./game-card.module.scss";

import { Link } from "wouter";
import { ThreeDotsMenu } from "@/client/ui/molecules/ThreeDotsMenu";

export type GameCardProps = {
  game: Game;
  className?: string;
  onDelete?: (gameStateId: string) => void;
  href: string;
};

export const GameCard = (props: GameCardProps) => {
  const { modal, onClick: onDelete } = useConfirmModal({
    onConfirm: () => props.onDelete?.(props.game.id),
  });

  return (
    <div
      className={clsx(classes.GameCard, props.className)}
      style={{
        backgroundImage: `url(${props.game.iconURL})`,
      }}
    >
      <Link href={props.href} className={classes.GameLink}>
        <div className={classes.GameCardInner}>
          {props.onDelete && (
            <ThreeDotsMenu
              className={classes.GameActions}
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

          <div className={classes.GameInfo}>
            <p>{props.game.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};
