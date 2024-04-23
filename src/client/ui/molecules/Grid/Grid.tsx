import { clsx } from "clsx";

import classes from "./grid.module.scss";
import { Paper } from "@/client/ui/atoms/Paper";
import { NoElements } from "@/client/ui/atoms/NoElements";
import { Preloader } from "@/client/ui/atoms/Preloader";

export type GridProps<E> = {
  elements: E[];
  renderElement: (element: E) => JSX.Element;
  getKey: (element: E) => string;
  className?: string;
  elementClassName?: string;
  elementWidth?: number;
  isLoading?: boolean;
};

export function Grid<E>(props: GridProps<E>) {
  return (
    <Preloader isLoading={props.isLoading || false}>
      {!props.isLoading && !props.elements.length && <NoElements />}

      <ul
        className={clsx(classes.Grid, props.className)}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${
            props.elementWidth || 200
          }px, 1fr))`,
        }}
      >
        {props.elements.map((element) => (
          <li key={props.getKey(element)}>
            <Paper
              className={clsx(classes.GridElement, props.elementClassName)}
            >
              {props.renderElement(element)}
            </Paper>
          </li>
        ))}
      </ul>
    </Preloader>
  );
}
