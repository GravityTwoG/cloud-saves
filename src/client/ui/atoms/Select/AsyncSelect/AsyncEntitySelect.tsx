import { useEffect, useState, useMemo } from "react";

import { AsyncSelect, AsyncSelectProps, SelectOption } from "./AsyncSelect";
import { debounce } from "@/client/ui/lib/debounce";

type Callback<T> = (res: SelectOption<T>[]) => void;

export type AsyncEntitySelectProps<T> = Pick<
  AsyncSelectProps<T>,
  "option" | "onChange" | "onBlur" | "id"
> & {
  loadOptions: (inputValue: string) => Promise<SelectOption<T>[]>;
};

const defaultOption = {
  label: "Не выбрано",
  value: "",
  object: null,
} as SelectOption<string>;

export function AsyncEntitySelect<T>(props: AsyncEntitySelectProps<T>) {
  const [options, setOptions] = useState<SelectOption<T>[]>([
    defaultOption as SelectOption<T>,
  ]);

  const loadOptionsDebounced = useMemo(() => {
    return debounce(
      (inputValue: string, cb: Callback<T>) => {
        props
          .loadOptions(inputValue || "")
          .then((opts) => {
            cb([...opts, defaultOption as SelectOption<T>]);
          })
          .catch((err) => {
            console.error(err);
            return [defaultOption];
          });
      },
      200,
      {}
    );
  }, [props.loadOptions]);

  useEffect(() => {
    props.loadOptions("").then((opts) => {
      setOptions([...opts, defaultOption as SelectOption<T>]);
    });
  }, [props.loadOptions]);

  return (
    <AsyncSelect
      options={options}
      loadOptions={(inputValue: string, cb: Callback<T>) => {
        loadOptionsDebounced(inputValue, (opts: SelectOption<T>[]) => cb(opts));
      }}
      option={props.option}
      onChange={props.onChange}
      id={props.id}
    />
  );
}
