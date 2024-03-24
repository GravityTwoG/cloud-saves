import { GameStateSync } from "@/types";

export const syncMap = {
  [GameStateSync.NO]: "no",
  [GameStateSync.EVERY_HOUR]: "every-hour",
  [GameStateSync.EVERY_DAY]: "every-day",
  [GameStateSync.EVERY_WEEK]: "every-week",
  [GameStateSync.EVERY_MONTH]: "every-month",
} as const;
