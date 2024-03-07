import { Game, MetadataSchema } from "@/types";
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
  paths: { path: string }[];
  extractionPipeline: {
    inputFilename: string;
    type: "sav-to-json";
    outputFilename: string;
  }[];
  schema: MetadataSchema;
  imageId: number;
};

export class GameAPI implements IGameAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async getGame(gameId: string): Promise<Game> {
    const game = await this.fetcher.get<GameFromServer>(`/games/${gameId}`);

    return this.mapGameFromServer(game);
  }

  async getGames(query: GetGamesQuery): Promise<GetGamesResponse> {
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
  }

  addGame(game: AddGameDTO): Promise<Game> {
    const formData = new FormData();

    formData.append("image", game.icon);
    formData.append(
      "gameData",
      JSON.stringify({
        name: game.name,
        description: game.description,
        paths: game.paths.map((path) => ({ path })),
        extractionPipeline: game.extractionPipeline,
        schema: game.metadataSchema,
      })
    );

    return this.fetcher.post("/games", {
      headers: {},
      body: formData,
    });
  }

  updateGame(game: UpdateGameDTO): Promise<Game> {
    const formData = new FormData();

    if (game.icon) {
      formData.append("image", game.icon);
    }

    formData.append(
      "gameData",
      JSON.stringify({
        name: game.name,
        description: game.description,
        paths: game.paths ? game.paths.map((path) => ({ path })) : undefined,
        extractionPipeline: game.extractionPipeline,
        schema: game.metadataSchema,
      })
    );

    return this.fetcher.put(`/games/${game.id}`, {
      headers: {},
      body: formData,
    });
  }

  deleteGame(gameId: string): Promise<void> {
    return this.fetcher.delete(`/games/${gameId}`);
  }

  private mapGameFromServer = (game: GameFromServer): Game => {
    return {
      id: game.id.toString(),
      name: game.name,
      description: game.description,
      paths: game.paths.map((path) => path.path),
      extractionPipeline: game.extractionPipeline,
      metadataSchema: game.schema,
      iconURL: `${this.fetcher.getBaseURL()}/games/image/${game.imageId}`,
    };
  };
}
