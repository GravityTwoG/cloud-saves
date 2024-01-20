import { forwardRef } from "react";
import clsx from "clsx";

import classes from "./input.module.scss";

import { ReactTagProps } from "../../types";

export type InputProps = ReactTagProps<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        className={clsx(classes.Input, props.className)}
      />
    );
  }
);
