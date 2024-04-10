import { useRef, useState } from "react";

import { useDebouncedCallback } from "./useDebouncedCallback";

/**
 * Hook options.
 * @template T - The type of the value.
 */
type UseDebounceValueOptions = {
  /**
   * Determines whether the function should be invoked on the leading edge of the timeout.
   * @default false
   */
  leading?: boolean;
  /**
   * Determines whether the function should be invoked on the trailing edge of the timeout.
   * @default false
   */
  trailing?: boolean;
  /**
   * The maximum time the specified function is allowed to be delayed before it is invoked.
   */
  maxWait?: number;
};

const eq = <T>(left: T, right: T) => left === right;

/**
 * Custom hook that returns a debounced version of the provided value, along with a function to update it.
 */
export function useDebouncedValue<T>(
  initialValue: T | (() => T),
  delay: number,
  options?: UseDebounceValueOptions
) {
  const unwrappedInitialValue =
    initialValue instanceof Function ? initialValue() : initialValue;
  const [debouncedValue, setDebouncedValue] = useState<T>(
    unwrappedInitialValue
  );
  const previousValueRef = useRef<T | undefined>(unwrappedInitialValue);

  const updateDebouncedValue = useDebouncedCallback(
    setDebouncedValue,
    [],
    delay,
    options
  );

  // Update the debounced value if the initial value changes
  if (!eq(previousValueRef.current as T, unwrappedInitialValue)) {
    updateDebouncedValue(unwrappedInitialValue);
    previousValueRef.current = unwrappedInitialValue;
  }

  return [debouncedValue, updateDebouncedValue] as const;
}
