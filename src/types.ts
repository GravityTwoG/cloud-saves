export enum UserRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN",
}

export type User = {
  email: string;
  username: string;
  role: UserRole;
};

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
  key: string;
  type: GameStateParameterType;
  description: string;
  label: string;
};

export type GameStateParameters = {
  filename: string;
  parameters: GameStateParameter[];
};

export type PipelineItemType = "sav-to-json";

export type Game = {
  id: string;
  name: string;
  description: string;
  iconURL: string;
  paths: string[];
  // schema
  extractionPipeline: {
    inputFilename: string;
    type: PipelineItemType;
    outputFilename: string;
  }[];
  gameStateParameters: GameStateParameters;
};

export type GamePath = {
  path: string;
  gameId: string | undefined;
  gameName: string | undefined;
  gameIconURL: string | undefined;
};

export enum GameSaveSync {
  NO = "no",
  EVERY_HOUR = "every hour",
  EVERY_DAY = "every day",
  EVERY_WEEK = "every week",
  EVERY_MONTH = "every month",
}

export type GameStateValue = {
  value: string;
  type: string;
  description: string;
  label: string;
};

export type GameSave = {
  id: string;
  gameId: string;
  name: string;
  path: string;
  sync: GameSaveSync;
  gameStateValues: GameStateValue[];

  archiveURL: string;
  size: number;

  uploadedAt: string;
  updatedAt: string;
  createdAt: string;
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
