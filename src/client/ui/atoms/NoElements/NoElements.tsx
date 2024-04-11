import { clsx } from "clsx";

import classes from "./no-elements.module.scss";

import { ReactTagProps } from "@/client/ui/types";
import EmptyBoxIcon from "@/client/ui/icons/EmptyBox.svg";

export type NoElementsProps = ReactTagProps<"div">;

export const NoElements = (props: NoElementsProps) => {
  return (
    <div {...props} className={clsx(classes.NoElements, props.className)}>
      <EmptyBoxIcon />
    </div>
  );
};
