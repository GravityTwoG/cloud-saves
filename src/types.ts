export type User = {
  email: string;
};

export type Game = {
  name: string;
};

export type GameSave = {
  gameId: string;
  size: number;
  createdAt: Date;
};
