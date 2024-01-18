import clsx from "clsx";

import classes from "./typography.module.scss";
import { ReactTagProps } from "../../types";

export type TypographyProps = ReactTagProps<"h1">;

export const H1 = (props: TypographyProps) => {
  return <h1 {...props} className={clsx(classes.H1, props.className)} />;
};

export const H2 = (props: TypographyProps) => {
  return <h2 {...props} className={clsx(classes.H2, props.className)} />;
};

export const H3 = (props: TypographyProps) => {
  return <h3 {...props} className={clsx(classes.H3, props.className)} />;
};

export const H4 = (props: TypographyProps) => {
  return <h4 {...props} className={clsx(classes.H4, props.className)} />;
};

export const H5 = (props: TypographyProps) => {
  return <h5 {...props} className={clsx(classes.H5, props.className)} />;
};

export const H6 = (props: TypographyProps) => {
  return <h6 {...props} className={clsx(classes.H6, props.className)} />;
};

export type ParagraphProps = ReactTagProps<"p">;

export const Paragraph = (props: ParagraphProps) => {
  return <p {...props} className={clsx(classes.Paragraph, props.className)} />;
};
