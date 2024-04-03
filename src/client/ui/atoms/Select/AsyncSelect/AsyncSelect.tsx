import classes from "./async-select.module.scss";

import { GroupBase, Theme } from "react-select";
import ReactAsyncSelect, { AsyncProps } from "react-select/async";

export type SelectOption<T> = {
  value: T;
  label: string;
};

export type LoadOptionsCallback<T> = (res: SelectOption<T>[]) => void;

export type AsyncSelectProps<T> = {
  option?: SelectOption<T>;
  options: SelectOption<T>[];

  onChange?: (option: SelectOption<T>) => void;
  onBlur?: AsyncProps<
    SelectOption<T>,
    false,
    GroupBase<SelectOption<T>>
  >["onBlur"];
  loadOptions:
    | ((inputValue: string) => Promise<SelectOption<T>[]>)
    | ((inputValue: string, cb: LoadOptionsCallback<T>) => void);

  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

export const AsyncSelect = function <T>(props: AsyncSelectProps<T>) {
  return (
    <div className={classes.AsyncSelect}>
      <ReactAsyncSelect
        defaultOptions={props.options}
        loadOptions={props.loadOptions}
        value={props.option}
        onChange={(v) => {
          if (v) {
            props.onChange && props.onChange(v);
          }
        }}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        id={props.id}
        name={props.name}
        cacheOptions
        menuPlacement="auto"
        theme={themeFactory}
        isDisabled={props.disabled}
        className={props.className}
      />
    </div>
  );
};

function themeFactory(theme: Theme) {
  return {
    ...theme,
    borderRadius: 16,
    colors: {
      ...theme.colors,
      primary: "var(--accent-color)", // border color on focus
      primary25: "var(--deco-color)",
      primary50: "var(--accent-hover-color)", // background on press
      neutral0: "var(--paper-color)", // background
      neutral20: "var(--deco-color)", // border
      neutral30: "var(--deco-color)",
    },
  };
}
