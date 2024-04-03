import { useRef, useState } from "react";
import { clsx } from "clsx";

import classes from "./poly-button.module.scss";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

export type PolyButtonProps = {
  className?: string;
  onClick: () => void;
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
        >
          {props.children}
        </button>

        <button
          className={classes.PolyButtonMenuButton}
          onClick={() => setIsOpen(!isOpen)}
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
