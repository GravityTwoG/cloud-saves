import {
  type DependencyList,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import { Callback, debounce } from "../debounce";

export interface DebounceOptions {
  leading?: boolean | undefined;
  maxWait?: number | undefined;
  trailing?: boolean | undefined;
}

const defaultOptions: DebounceOptions = {
  leading: false,
  trailing: true,
};

/**
 * Accepts a function and returns a new debounced yet memoized version of that same function that delays
 * its invoking by the defined time.
 * If time is not defined, its default value will be 250ms.
 */
export const useDebouncedCallback = <TCallback extends Callback>(
  fn: TCallback,
  dependencies?: DependencyList,
  wait: number = 600,
  options: DebounceOptions = defaultOptions
) => {
  const debounced = useRef(debounce(fn, wait, options));

  useEffect(() => {
    debounced.current = debounce(fn, wait, options);

    return () => {
      debounced.current?.cancel();
    };
  }, [fn, wait, options]);

  useLayoutEffect(() => {
    return () => {
      debounced.current?.cancel();
    };
  }, []);

  return useCallback(debounced.current, dependencies ?? []);
};
