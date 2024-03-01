import { Game, MetadataSchema } from "@/types";
import {
  AddGameDTO,
  GetGamesQuery,
  GetGamesResponse,
  IGameAPI,
  UpdateGameDTO,
} from "./interfaces/IGameAPI";
import { fetcher } from "./fetcher";

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
  async getGame(gameId: string): Promise<Game> {
    const game = await fetcher.get<GameFromServer>(`/games/${gameId}`);

    return this.mapGameFromServer(game);
  }

  async getGames(query: GetGamesQuery): Promise<GetGamesResponse> {
    const games = await fetcher.get<{
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

    return fetcher.post("/games", {
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

    return fetcher.put(`/games/${game.id}`, {
      headers: {},
      body: formData,
    });
  }

  deleteGame(gameId: string): Promise<void> {
    return fetcher.delete(`/games/${gameId}`);
  }

  private mapGameFromServer = (game: GameFromServer): Game => {
    return {
      id: game.id.toString(),
      name: game.name,
      description: game.description,
      paths: game.paths.map((path) => path.path),
      extractionPipeline: game.extractionPipeline,
      metadataSchema: game.schema,
      iconURL: `${fetcher.getBaseURL()}/games/image/${game.imageId}`,
    };
  };
}
