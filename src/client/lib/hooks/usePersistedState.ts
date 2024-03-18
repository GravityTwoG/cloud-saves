import { useEffect, useState } from "react";

export const usePersistedState = <T>(key: string, initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setState(JSON.parse(storedValue));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
};
