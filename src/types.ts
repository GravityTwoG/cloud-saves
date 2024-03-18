export type JSONType = {
  [key: string | number]:
    | string
    | number
    | boolean
    | null
    | JSONType
    | JSONType[];
};

export enum UserRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN",
}

export type User = {
  email: string;
  username: string;
  role: UserRole;
};

export type GameStateParameterType =
  | "string"
  | "number"
  | "boolean"
  | "seconds";

export type GameStateParameters = {
  filename: string;
  fields: {
    key: string;
    type: GameStateParameterType;
    description: string;
    label: string;
  }[];
};

export type GameStateValues = {
  fields: {
    value: string | number | boolean;
    type: GameStateParameterType;
    description: string;
    label: string;
  }[];
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

export type GameSave = {
  id: string;
  gameId: string;
  name: string;
  path: string;
  sync: GameSaveSync;
  gameStateValues: GameStateValues;

  archiveURL: string;
  size: number;

  uploadedAt: string;
  updatedAt: string;
  createdAt: string;
};
