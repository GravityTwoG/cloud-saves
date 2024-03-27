import { ReactNode, forwardRef } from "react";
import { clsx } from "clsx";
import { ReactTagProps } from "@/client/ui/types";

import classes from "./select.module.scss";

export type SelectProps = {
  options: { name: ReactNode; value: string | number }[];
} & ReactTagProps<"select">;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, ...props }, ref) => {
    return (
      <select
        {...props}
        className={clsx(props.className, classes.Select)}
        ref={ref}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    );
  }
);
