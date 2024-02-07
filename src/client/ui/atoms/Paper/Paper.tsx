import classes from "./paper.module.scss";

import { ReactTagProps } from "@/client/ui/types";
import { clsx } from "clsx";

export type PaperProps = ReactTagProps<"div">;

export const Paper = (props: PaperProps) => {
  return <div {...props} className={clsx(classes.Paper, props.className)} />;
};
