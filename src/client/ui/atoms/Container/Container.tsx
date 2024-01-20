import clsx from "clsx";

import classes from "./container.module.scss";

import { ReactTagProps } from "../../types";

export type ContainerProps = ReactTagProps<"div">;

export const Container = (props: ContainerProps) => {
  return (
    <div {...props} className={clsx(classes.Container, props.className)} />
  );
};
