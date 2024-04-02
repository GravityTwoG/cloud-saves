import { clsx } from "clsx";

import classes from "./grid.module.scss";

export type GridProps<E> = {
  elements: E[];
  renderElement: (element: E) => JSX.Element;
  getKey: (element: E) => string;
  className?: string;
  elementClassName?: string;
};

export function Grid<E>(props: GridProps<E>) {
  return (
    <ul className={clsx(classes.Grid, props.className)}>
      {props.elements.map((element) => (
        <li
          className={clsx(classes.GridElement, props.elementClassName)}
          key={props.getKey(element)}
        >
          {props.renderElement(element)}
        </li>
      ))}
    </ul>
  );
}
