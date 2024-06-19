import { flushSync } from "react-dom";

export function startViewTransition(cb: () => void) {
  if (transitionsEnabled()) {
    const transition = document.startViewTransition(() => flushSync(cb));
    return transition;
  }

  cb();
  return null;
}

export const transitionsEnabled = () =>
  "startViewTransition" in document &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
