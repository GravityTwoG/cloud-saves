import { Game } from "@/types";
import { Fetcher } from "./Fetcher";
import {
  AddGameDTO,
  GetGamesQuery,
  GetGamesResponse,
  IGameAPI,
  UpdateGameDTO,
} from "./interfaces/IGameAPI";

type GameFromServer = {
  id: number;
  name: string;
  description: string;
  paths: { id: string; path: string }[];
  extractionPipeline: {
    inputFilename: string;
    type: "sav-to-json";
    outputFilename: string;
  }[];
  schema: {
    filename: string;
    gameStateParameters: {
      id: number;
      key: string;
      type: string;
      label: string;
      description: string;
    }[];
  };
  imageUrl: string;
};

export class GameAPI implements IGameAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  getGame = async (gameId: string): Promise<Game> => {
    const game = await this.fetcher.get<GameFromServer>(`/games/${gameId}`);

    return this.mapGameFromServer(game);
  };

  getGames = async (query: GetGamesQuery): Promise<GetGamesResponse> => {
    const games = await this.fetcher.get<{
      items: GameFromServer[];
      totalCount: number;
    }>(
      `/games?searchQuery=${query.searchQuery}&pageSize=${query.pageSize}&pageNumber=${query.pageNumber}`
    );

    return {
      items: games.items.map(this.mapGameFromServer),
      totalCount: games.totalCount,
    };
  };

  addGame = (game: AddGameDTO): Promise<Game> => {
    const formData = new FormData();

    formData.append("image", game.icon || new Blob());
    formData.append(
      "gameData",
      JSON.stringify({
        name: game.name,
        description: game.description,
        paths: game.paths.map((path) => ({ path })),
        extractionPipeline: game.extractionPipeline,
        schema: {
          filename: game.gameStateParameters.filename,
          gameStateParameters: game.gameStateParameters.parameters.map(
            (field) => ({
              key: field.key,
              type: field.type.type || field.type.id,
              label: field.label,
              description: field.description,
            })
          ),
        },
      })
    );

    return this.fetcher.post("/games", {
      headers: {},
      body: formData,
    });
  };

  updateGame = (game: UpdateGameDTO): Promise<Game> => {
    const formData = new FormData();

    // if (game.icon) {
    formData.append("image", game.icon || "");
    // }

    formData.append(
      "gameData",
      JSON.stringify({
        name: game.name,
        description: game.description,
        paths: game.paths,
        extractionPipeline: game.extractionPipeline,
        schema: {
          filename: game.gameStateParameters.filename,
          gameStateParameters: game.gameStateParameters.parameters.map(
            (field) => ({
              id: field.id,
              key: field.key,
              type: field.type.type || field.type.id,
              label: field.label,
              description: field.description,
            })
          ),
        },
      })
    );

    return this.fetcher.patch(`/games/${game.id}`, {
      headers: {},
      body: formData,
    });
  };

  deleteGame = (gameId: string): Promise<void> => {
    return this.fetcher.delete(`/games/${gameId}`);
  };

  private mapGameFromServer = (game: GameFromServer): Game => {
    return {
      id: game.id.toString(),
      name: game.name,
      description: game.description,
      paths: game.paths,
      extractionPipeline: game.extractionPipeline,
      gameStateParameters: {
        filename: game.schema.filename,
        parameters: game.schema.gameStateParameters.map((field) => ({
          id: field.id.toString(),
          key: field.key,
          type: {
            type: field.type,
            id: field.type,
          },
          label: field.label,
          description: field.description,
        })),
      },
      iconURL: game.imageUrl,
    };
  };
}
