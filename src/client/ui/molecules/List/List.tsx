import clsx from "clsx";

import classes from "./list.module.scss";

export type ListProps<E> = {
  elements: E[];
  renderElement: (element: E) => JSX.Element;
  getKey: (element: E) => string;
  className?: string;
};

export function List<E>(props: ListProps<E>) {
  return (
    <ul className={clsx(classes.List, props.className)}>
      {props.elements.map((element) => (
        <li className={classes.ListElement} key={props.getKey(element)}>
          {props.renderElement(element)}
        </li>
      ))}
    </ul>
  );
}
