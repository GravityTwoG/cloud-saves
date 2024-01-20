export type User = {
  email: string;
  username: string;
};

export type Game = {
  name: string;
};

export type GameSave = {
  gameId: string;
  size: number;
  createdAt: Date;
};
