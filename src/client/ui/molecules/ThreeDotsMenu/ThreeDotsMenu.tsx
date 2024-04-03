import { clsx } from "clsx";
import classes from "./three-dots-menu.module.scss";
import { ReactNode, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export type ThreeDotsMenuProps = {
  className?: string;
  menuItems: {
    onClick?: () => void;
    children: ReactNode;
    key: string;
  }[];
};

export const ThreeDotsMenu = (props: ThreeDotsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div
      ref={menuRef}
      className={clsx(classes.ThreeDotsMenu, props.className)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <button
        className={classes.ThreeDotsMenuButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div />
        <div />
        <div />
      </button>

      {isOpen && (
        <ul className={classes.ThreeDotsMenuContent}>
          {props.menuItems.map((item) => (
            <li
              className={classes.ThreeDotsMenuItem}
              onClick={item.onClick}
              key={item.key}
            >
              {item.children}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
