import { Game, MetadataSchema, PipelineItemType } from "@/types";

export type GetGamesQuery = {
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
};

export type GetGamesResponse = {
  items: Game[];
  totalCount: number;
};

export type AddGameDTO = {
  name: string;
  icon: Blob;
  paths: string[];
  extractionPipeline: {
    inputFilename: string;
    type: PipelineItemType;
    outputFilename: string;
  }[];
  metadataSchema: MetadataSchema;
};

export type UpdateGameDTO = {
  id: string;
  name?: string;
  icon?: Blob;
  paths?: string[];
  extractionPipeline?: {
    inputFilename: string;
    type: string;
    outputFilename: string;
  }[];
  metadataSchema?: MetadataSchema;
};

export interface IGameAPI {
  getGames(query: GetGamesQuery): Promise<GetGamesResponse>;

  getGame(gameId: string): Promise<Game>;

  addGame(game: AddGameDTO): Promise<Game>;

  updateGame(game: UpdateGameDTO): Promise<Game>;

  deleteGame(gameId: string): Promise<void>;
}
