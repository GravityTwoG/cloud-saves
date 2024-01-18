import React from "react";
import clsx from "clsx";
import classes from "./button.module.scss";

import { ReactTagProps } from "../../types";

import { Spinner } from "../Spinner";

const colorMap = {
  primary: undefined,
  secondary: classes.ColorSecondary,
  danger: classes.ColorDanger,
};

export type ButtonProps = {
  isLoading?: boolean;
  color?: "primary" | "secondary" | "danger";
  width?: string;
} & ReactTagProps<"button">;

export const Button: React.FC<ButtonProps> = ({
  isLoading,
  type = "button",
  color = "primary",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      className={clsx(classes.BaseButton, props.className, colorMap[color], {
        [classes.isLoading]: isLoading,
      })}
      style={{ width: props.width, ...props.style }}
      disabled={props.disabled || isLoading}
    >
      <span className={clsx(isLoading ? classes.loading : "")}>
        {props.children}
      </span>

      {isLoading && <Spinner className={classes.Spinner} />}
    </button>
  );
};
