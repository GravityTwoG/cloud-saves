import { clsx } from "clsx";
import classes from "./go-back.module.scss";

import LeftArrowIcon from "@/client/ui/icons/LeftArrow.svg";

export type GoBackProps = {
  className?: string;
};

export const GoBack = (props: GoBackProps) => {
  return (
    <button
      className={clsx(classes.GoBackButton, props.className)}
      onClick={() => window.history.back()}
    >
      <LeftArrowIcon />
    </button>
  );
};
