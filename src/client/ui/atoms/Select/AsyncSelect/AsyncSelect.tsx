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

function themeFactory(theme: Theme): Theme {
  return {
    ...theme,
    borderRadius: 16,
    colors: {
      ...theme.colors,
      primary: "var(--color-accent)", // border color on focus
      primary25: "var(--color-deco)",
      primary50: "var(--color-accent-hover)", // background on press
      primary75: "var(--color-deco)",
      danger: "var(--color-danger",
      dangerLight: "var(--color-danger-hover)",

      neutral0: "var(--color-paper)", // background
      neutral20: "var(--color-deco)", // border
      neutral30: "var(--color-deco)",
      neutral80: "var(--color-text)", // input text
    },
  };
}
