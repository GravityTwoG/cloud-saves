import { ReactNode } from "react";
import { clsx } from "clsx";

import classes from "./error-text.module.scss";

export type ErrorTextProps = {
  children?: ReactNode;
  className?: string;
};

export const ErrorText = (props: ErrorTextProps) => {
  return (
    <span className={clsx(classes.ErrorText, props.className)}>
      {props.children}
    </span>
  );
};
