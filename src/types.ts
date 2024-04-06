export enum UserRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN",
}

export type User = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};

// Game

export type GameStateParameterType = {
  id: string;
  type: string;
};

export type CommonParameter = {
  id: string;
  type: GameStateParameterType;
  label: string;
  description: string;
};

export type GameStateParameter = {
  id: string;
  key: string;
  type: GameStateParameterType;
  commonParameter: CommonParameter;
  description: string;
  label: string;
};

export type GameStateParameters = {
  filename: string;
  parameters: GameStateParameter[];
};

export type Game = {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  paths: { id: string; path: string }[];
  // schema
  extractionPipeline: {
    inputFilename: string;
    type: string;
    outputFilename: string;
  }[];
  gameStateParameters: GameStateParameters;
};

export type GamePath = {
  path: string;
  gameId: string | undefined;
  gameName: string | undefined;
  gameImageURL: string | undefined;
};

// Game State

export enum GameStateSync {
  NO = "no",
  EVERY_HOUR = "every-hour",
  EVERY_DAY = "every-day",
  EVERY_WEEK = "every-week",
  EVERY_MONTH = "every-month",
}

export type GameStateValue = {
  value: string;
  type: string;
  description: string;
  label: string;
};

export type GameState = {
  id: string;
  gameId: string;
  gameImageURL: string;
  name: string;
  localPath: string;
  sync: GameStateSync;
  isPublic: boolean;
  gameStateValues: GameStateValue[];

  archiveURL: string;
  sizeInBytes: number;

  uploadedAt: string;
  updatedAt: string;
  createdAt: string;
};

export type Share = {
  id: string;
  gameStateId: string;
  userId: string;
  username: string;
};

export type JSONType = {
  [key: string | number]:
    | string
    | number
    | boolean
    | null
    | JSONType
    | JSONType[];
};
