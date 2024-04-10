import { memo } from "react";
import { clsx } from "clsx";

import classes from "./flex.module.scss";

import { ReactTagProps } from "@/client/ui/types";

const shorthands = {
  fxww: true, // flex-wrap: wrap
  fxdc: true, // flex-direction: column
  jcsb: true, // justify-content: space-between
  jcsa: true, // justify-content: space-around
  jcc: true, // justify-content: center
  jcs: true, // justify-content: stretch
  jcfs: true, // justify-content: flex-start
  jcfe: true, // justify-content: flex-end
  aic: true, // align-items: center
  ais: true, // align-items: stretch
  aifs: true, // align-items: flex-start
  aife: true, // align-items: flex-end
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
