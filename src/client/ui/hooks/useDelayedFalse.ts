import { useEffect, useState } from "react";

export const useDelayedFalse = (value: boolean, delay = 150) => {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    if (value && !delayedValue) {
      const timeout = setTimeout(() => setDelayedValue(true), 0);
      return () => clearTimeout(timeout);
    }

    if (!value && delayedValue) {
      const timeout = setTimeout(() => setDelayedValue(false), delay);
      return () => clearTimeout(timeout);
    }
  }, [value, delayedValue, delay]);

  return delayedValue;
};
