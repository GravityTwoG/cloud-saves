import { memo } from "react";
import { clsx } from "clsx";

import classes from "./flex.module.scss";

import { ReactTagProps } from "@/client/ui/types";

const shorthands = {
  fxww: true,
  fxdc: true,
  jcsb: true,
  jcsa: true,
  jcc: true,
  jcfe: true,
  jcfs: true,
  aic: true,
  ais: true,
  aifs: true,
  aife: true,
} as const;

export type Shorthands = typeof shorthands;

export type FlexProps = ReactTagProps<"div"> &
  Partial<Shorthands> & { gap?: string | number };

export const Flex = memo((props: FlexProps) => {
  const { className, gap, ...otherProps } = props;

  const divProps: ReactTagProps<"div"> & Record<string, unknown> = {};
  const classNames: string[] = [];

  const keys = Object.keys(otherProps) as (keyof typeof otherProps &
    keyof Shorthands)[];
  for (const key of keys) {
    if (key in shorthands && shorthands[key]) {
      classNames.push(classes[key]);
    } else {
      divProps[key] = otherProps[key];
    }
  }

  return (
    <div
      {...divProps}
      style={{ gap, ...divProps.style }}
      className={clsx(classNames, className, classes.Flex)}
    />
  );
});
