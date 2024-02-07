export type User = {
  email: string;
  username: string;
};

export type Game = {
  id: string;
  name: string;
};

export type GameSave = {
  id: string;
  gameId: string;
  name: string;
  path: string;
  syncEnabled: boolean;
  archives: {
    url: string;
    id: string;
    size: number;
    createdAt: string;
  }[];
};
