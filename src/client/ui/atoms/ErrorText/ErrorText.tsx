import { ReactNode } from "react";

import classes from "./error-text.module.scss";

export type ErrorTextProps = {
  children?: ReactNode;
};

export const ErrorText = (props: ErrorTextProps) => {
  return <span className={classes.ErrorText}>{props.children}</span>;
};
