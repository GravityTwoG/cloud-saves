import React from "react";
import clsx from "clsx";
import classes from "./button.module.scss";

import { ReactTagProps } from "../../types";

const colorMap = {
  primary: undefined,
  secondary: classes.ColorSecondary,
  danger: classes.ColorDanger,
};

export type ButtonProps = {
  isLoading?: boolean;
  color?: "primary" | "secondary" | "danger";
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
      disabled={props.disabled || isLoading}
    >
      <span className={clsx(isLoading ? classes.loading : "")}>
        {props.children}
      </span>

      {isLoading && <Spinner className={classes.Spinner} />}
    </button>
  );
};

export type SpinnerProps = {
  className?: string;
};

export const Spinner = (props: SpinnerProps) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: "none",
        display: "block",
        shapeRendering: "auto",
        stroke: "white",
      }}
      width="100px"
      height="100px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        className="stroke-inherit"
        strokeWidth="6"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(132.005 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </svg>
  );
};
