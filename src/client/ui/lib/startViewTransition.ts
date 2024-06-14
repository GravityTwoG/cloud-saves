import { flushSync } from "react-dom";

export function startViewTransition(cb: () => void) {
  if ("startViewTransition" in document) {
    document.startViewTransition(() => flushSync(cb));
  } else {
    cb();
  }
}
