export enum UserRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN",
}

export type User = {
  email: string;
  username: string;
  role: UserRole;
};

export type Game = {
  id: string;
  name: string;
};

export enum GameSaveSync {
  NO = "no",
  EVERY_HOUR = "every hour",
  EVERY_DAY = "every day",
  EVERY_WEEK = "every week",
  EVERY_MONTH = "every month",
}

export type GameSave = {
  id: string;
  gameId: string;
  name: string;
  path: string;
  sync: GameSaveSync;

  archiveURL: string;
  size: number;
  createdAt: string;
};
