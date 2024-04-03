import { clsx } from "clsx";

import classes from "./list.module.scss";
import { Paper } from "../../atoms/Paper";

export type ListProps<E> = {
  elements: E[];
  renderElement: (element: E) => JSX.Element;
  getKey: (element: E) => string;
  className?: string;
  elementClassName?: string;
};

export function List<E>(props: ListProps<E>) {
  return (
    <ul className={clsx(classes.List, props.className)}>
      {props.elements.map((element) => (
        <li key={props.getKey(element)}>
          <Paper className={clsx(classes.ListElement, props.elementClassName)}>
            {props.renderElement(element)}
          </Paper>
        </li>
      ))}
    </ul>
  );
}
