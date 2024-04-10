import React from "react";
import { clsx } from "clsx";
import classes from "./button.module.scss";

import { ReactTagProps } from "../../types";

import { Spinner } from "../Spinner";

const colorMap = {
  primary: undefined,
  secondary: classes.ColorSecondary,
  danger: classes.ColorDanger,
};

const variantMap = {
  primary: classes.PrimaryButton,
  CTA: classes.CTAButton,
};

export type ButtonProps = {
  isLoading?: boolean;
  color?: "primary" | "secondary" | "danger";
  width?: string;
  variant?: "primary" | "CTA";
} & ReactTagProps<"button">;

export const Button: React.FC<ButtonProps> = ({
  isLoading,
  type = "button",
  color = "primary",
  variant = "primary",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      className={clsx(
        classes.BaseButton,
        props.className,
        variantMap[variant],
        colorMap[color],
        isLoading && classes.isLoading
      )}
      style={{ width: props.width, ...props.style }}
      disabled={props.disabled || isLoading}
    >
      <span
        className={clsx(classes.ButtonContent, isLoading && classes.loading)}
      >
        {props.children}
      </span>

      {isLoading && <Spinner className={classes.Spinner} />}
    </button>
  );
};
