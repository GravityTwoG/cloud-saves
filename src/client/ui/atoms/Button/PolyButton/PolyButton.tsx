import { useRef, useState } from "react";
import { clsx } from "clsx";

import classes from "./poly-button.module.scss";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";
import { Spinner } from "../../Spinner";

export type PolyButtonProps = {
  className?: string;
  onClick: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  subActions: {
    onClick: () => void;
    children: React.ReactNode;
    key: string;
  }[];
};

export const PolyButton = (props: PolyButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className={clsx(classes.PolyButton, props.className)} ref={menuRef}>
      <div className={classes.PolyButtonBlock}>
        <button
          className={classes.PolyButtonButton}
          onClick={() => {
            setIsOpen(false);
            props.onClick();
          }}
          disabled={props.isLoading}
        >
          <span className={props.isLoading ? classes.Loading : undefined}>
            {props.children}
          </span>

          {props.isLoading && <Spinner className={classes.Spinner} />}
        </button>

        <button
          className={classes.PolyButtonMenuButton}
          onClick={() => {
            if (props.isLoading) return;
            setIsOpen(!isOpen);
          }}
          data-is-open={isOpen ? "true" : "false"}
        >
          <div />
          <div />
        </button>
      </div>

      {isOpen && (
        <ul className={classes.PolyButtonSubActions}>
          {props.subActions.map((subAction) => (
            <li key={subAction.key} className={classes.PolyButtonSubAction}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  subAction.onClick();
                }}
                disabled={props.isLoading}
              >
                {subAction.children}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
