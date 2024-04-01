import { getSystemErrorMap } from "node:util";

const systemErrorMap = getSystemErrorMap();
export function isSystemError(error: unknown): error is NodeJS.ErrnoException {
  let errno: unknown;
  try {
    errno = (error as { errno?: number })?.errno;
  } catch {
    // In case `errno` is a getter that throws:
    return false;
  }
  return typeof errno === "number" && systemErrorMap.has(errno);
}
