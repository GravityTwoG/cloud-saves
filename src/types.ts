export type User = {
  email: string;
  username: string;
};

export type Game = {
  name: string;
};

export type GameSave = {
  gameId: string;
  path: string;
  syncEnabled: boolean;
  size: number;
  createdAt: Date;
};
