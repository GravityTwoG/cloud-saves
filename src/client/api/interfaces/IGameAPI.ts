import { Game, GameStateParameterType } from "@/types";
import { ResourceRequest, ResourceResponse } from "./common";

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
      commonParameter: {
        id: string;
      };
      label: string;
      description: string;
    }[];
  };
};

export type UpdateGameDTO = {
  id: string;
} & AddGameDTO;

export interface IGameAPI {
  getGames(query: ResourceRequest): Promise<ResourceResponse<Game>>;

  getGame(gameId: string): Promise<Game>;

  addGame(game: AddGameDTO): Promise<Game>;

  updateGame(game: UpdateGameDTO): Promise<Game>;

  deleteGame(gameId: string): Promise<void>;
}
