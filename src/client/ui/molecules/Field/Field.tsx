import { clsx } from "clsx";

import classes from "./field.module.scss";

import { ReactTagProps } from "@/client/ui/types";

export type FieldProps = ReactTagProps<"label"> & { label: string };

export const Field = ({ label, children, ...props }: FieldProps) => {
  return (
    <div className={clsx(props.className, classes.Field)}>
      <label {...props} className={classes.label}>
        {label}
      </label>
      {children}
    </div>
  );
};
