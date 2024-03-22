import { clsx } from "clsx";

import classes from "./flex.module.scss";

import { ReactTagProps } from "@/client/ui/types";

const shorthands = [
  "fxww",
  "fxdc",
  "jcsb",
  "jcsa",
  "jcc",
  "jcfe",
  "jcfs",
  "aic",
  "ais",
  "aifs",
  "aife",
] as const;

export type Shorthand = (typeof shorthands)[number];
export type Shorthands = { [K in Shorthand]?: boolean };

export type FlexProps = ReactTagProps<"div"> & Shorthands;

export const Flex = (props: FlexProps) => {
  const { className, ...otherProps } = props;

  const classNames = shorthands.reduce((acc: string[], s: string) => {
    const p = props as unknown as { [k: string]: unknown };

    if (s in p && p[s]) {
      acc.push(classes[s]);
    }
    return acc;
  }, []);

  return (
    <div
      {...otherProps}
      className={clsx(classNames, className, classes.Flex)}
    />
  );
};
