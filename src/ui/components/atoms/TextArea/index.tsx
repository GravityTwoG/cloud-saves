import { forwardRef } from "react";
import clsx from "clsx";

import classes from "./textarea.module.scss";

import { ReactTagProps } from "../../types";

export type TextAreaProps = ReactTagProps<"textarea">;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ rows = 4, ...props }, ref) => {
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      props.onChange && props.onChange(e);

      const element = e.target;
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight + 2}px`;
    };

    return (
      <textarea
        {...props}
        ref={ref}
        rows={rows}
        className={clsx(classes.TextArea, props.className)}
        onChange={onChange}
      />
    );
  }
);
