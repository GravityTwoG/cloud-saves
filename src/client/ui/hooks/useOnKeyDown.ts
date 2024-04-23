import { useCallback, useEffect } from "react";

export const useOnKeyDown = (
  key: string,
  onKeyDown: (event: KeyboardEvent) => void,
  deps: unknown[],
) => {
  const _onKeyDown = useCallback(onKeyDown, deps);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === key) {
        _onKeyDown(event);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, _onKeyDown]);

  return;
};
