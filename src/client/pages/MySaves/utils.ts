import { GameSaveSync } from "@/types";

export const syncMap = {
  [GameSaveSync.NO]: "no",
  [GameSaveSync.EVERY_HOUR]: "every-hour",
  [GameSaveSync.EVERY_DAY]: "every-day",
  [GameSaveSync.EVERY_WEEK]: "every-week",
  [GameSaveSync.EVERY_MONTH]: "every-month",
} as const;
