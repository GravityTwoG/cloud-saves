import { clsx } from "clsx";

import classes from "./list.module.scss";
import { Paper } from "@/client/ui/atoms/Paper";
import { NoElements } from "@/client/ui/atoms/NoElements";
import { Preloader } from "@/client/ui/atoms/Preloader";

export type ListProps<E> = {
  elements: E[];
  renderElement: (element: E) => JSX.Element;
  getKey: (element: E) => string;
  className?: string;
  elementClassName?: string;
  isLoading?: boolean;
};

export function List<E>(props: ListProps<E>) {
  return (
    <Preloader className={props.className} isLoading={props.isLoading || false}>
      {!props.isLoading && !props.elements.length && <NoElements />}

      <ul className={classes.List}>
        {props.elements.map((element) => (
          <li key={props.getKey(element)}>
            <Paper
              className={clsx(classes.ListElement, props.elementClassName)}
            >
              {props.renderElement(element)}
            </Paper>
          </li>
        ))}
      </ul>
    </Preloader>
  );
}
