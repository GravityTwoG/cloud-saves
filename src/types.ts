export type User = {
  email: string;
  username: string;
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
  archives: {
    url: string;
    id: string;
    size: number;
    createdAt: string;
  }[];
};
