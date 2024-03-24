import { Game, GameStateParameterType } from "@/types";

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
  description: string;
  icon: Blob | undefined;
  paths: { id: string; path: string }[];
  extractionPipeline: {
    id: string;
    inputFilename: string;
    type: string;
    outputFilename: string;
  }[];
  gameStateParameters: {
    filename: string;
    parameters: {
      id: string;
      key: string;
      type: GameStateParameterType;
      label: string;
      description: string;
    }[];
  };
};

export type UpdateGameDTO = {
  id: string;
} & AddGameDTO;

export interface IGameAPI {
  getGames(query: GetGamesQuery): Promise<GetGamesResponse>;

  getGame(gameId: string): Promise<Game>;

  addGame(game: AddGameDTO): Promise<Game>;

  updateGame(game: UpdateGameDTO): Promise<Game>;

  deleteGame(gameId: string): Promise<void>;
}
