import { ReactElement, ForwardedRef, forwardRef } from "react";
import { clsx } from "clsx";

import classes from "./expanded-select.module.scss";
import { SelectOption } from "../AsyncSelect/AsyncSelect";

export type ExpandedSelectProps<T> = {
  options: SelectOption<T>[];
  onChange: (optionName: T) => void;
  value: T;
  canUnselect?: boolean;
  className?: string;
  name?: string;
  variant?: "vertical" | "horizontal";
};

export type ExpandedSelectComponent = <T extends string>(
  props: ExpandedSelectProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => ReactElement | null;

export const ExpandedSelect = forwardRef(
  <T extends string>(
    props: ExpandedSelectProps<T>,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactElement => {
    const variant = props.variant || "horizontal";

    return (
      <div
        className={clsx(
          classes.ExpandedSelect,
          variant === "vertical" && classes.ExpandedSelectVertical,
          props.className,
        )}
      >
        <FakeInput value={props.value} name={props.name} ref={ref} />

        <ul className={classes.OptionsList}>
          {props.options.length === 0 && <li className={classes.Option}>-</li>}

          {props.options.map((option) => (
            <li
              key={option.value}
              className={clsx(classes.Option, {
                [classes.OptionActive]: option.value === props.value,
              })}
              role="button"
              onClick={() => {
                if (option.value !== props.value) {
                  props.onChange(option.value);
                }
                if (props.canUnselect && option.value === props.value) {
                  props.onChange("" as T);
                }
              }}
            >
              <button>{option.label}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  },
) as ExpandedSelectComponent;

const FakeInput = forwardRef<
  HTMLInputElement,
  { name?: string; value: string }
>((props, ref) => {
  return (
    <input
      name={props.name}
      ref={ref}
      className={classes.FakeInput}
      value={props.value}
      onChange={() => {}}
    />
  );
});
