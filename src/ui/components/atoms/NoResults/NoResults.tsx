import clsx from "clsx";

import classes from "./no-results.module.scss";

import { ReactTagProps } from "../../types";

export type NoResultsProps = ReactTagProps<"div">;

export const NoResults = (props: NoResultsProps) => {
  return (
    <div {...props} className={clsx(classes.NoResults, props.className)} />
  );
};
