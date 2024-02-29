export enum UserRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN",
}

export type User = {
  email: string;
  username: string;
  role: UserRole;
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

export type MetadataType = "string" | "number" | "boolean" | "seconds";

export type MetadataSchema = {
  filename: string;
  fields: {
    key: string;
    type: MetadataType;
    description: string;
    label: string;
  }[];
};

export type Metadata = {
  fields: {
    value: string | number | boolean;
    type: MetadataType;
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
  extractionPipeline: {
    inputFilename: string;
    type: PipelineItemType;
    outputFilename: string;
  }[];
  metadataSchema: MetadataSchema;
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
  metadata: Metadata;

  archiveURL: string;
  size: number;
  createdAt: string;
};
