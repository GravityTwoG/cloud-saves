import { forwardRef } from "react";
import { clsx } from "clsx";

import classes from "./input.module.scss";

import { ReactTagProps } from "@/client/ui/types";

export type InputProps = Omit<ReactTagProps<"input">, "children">;

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
