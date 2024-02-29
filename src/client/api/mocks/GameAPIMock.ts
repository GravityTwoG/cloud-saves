import { Game } from "@/types";
import { ApiError } from "../ApiError";
import {
  AddGameDTO,
  GetGamesQuery,
  GetGamesResponse,
  IGameAPI,
  UpdateGameDTO,
} from "../interfaces/IGameAPI";

export class GameAPIMock implements IGameAPI {
  getGames = async (query: GetGamesQuery): Promise<GetGamesResponse> => {
    console.log("getGames", query);
    const gamesJSON = localStorage.getItem("games");

    if (gamesJSON) {
      const games = JSON.parse(gamesJSON);

      const gamesArray: Game[] = [];

      for (const key in games) {
        gamesArray.push(games[key]);
      }

      return {
        items: gamesArray,
        totalCount: gamesArray.length,
      };
    }

    return {
      items: [],
      totalCount: 0,
    };
  };

  getGame = async (gameId: string): Promise<Game> => {
    const gamesJSON = localStorage.getItem("games");

    if (gamesJSON) {
      const games = JSON.parse(gamesJSON);
      return games[gameId];
    }

    throw new ApiError("Game not found");
  };

  addGame = async (game: AddGameDTO): Promise<Game> => {
    const gamesJSON = localStorage.getItem("games");

    const gameToSave = {
      ...game,
      id: Math.random().toString(36).substring(2),
      iconURL: "",
    };

    if (gamesJSON) {
      const games = JSON.parse(gamesJSON);

      games[gameToSave.id] = gameToSave;

      localStorage.setItem("games", JSON.stringify(games));

      return gameToSave;
    } else {
      localStorage.setItem(
        "games",
        JSON.stringify({ [gameToSave.id]: gameToSave })
      );
    }

    throw new ApiError("Game not found");
  };

  updateGame = async (game: UpdateGameDTO): Promise<Game> => {
    const gamesJSON = localStorage.getItem("games");

    if (gamesJSON) {
      const games = JSON.parse(gamesJSON);

      const existingGame = games[game.id];
      const updatedGame: Game = {
        id: game.id,
        name: game.name || existingGame.name,
        description: game.description || existingGame.description,
        iconURL: "",
        paths: game.paths || existingGame.paths,
        extractionPipeline:
          game.extractionPipeline || existingGame.extractionPipeline,
        metadataSchema: game.metadataSchema || existingGame.metadataSchema,
      };

      games[game.id] = updatedGame;

      localStorage.setItem("games", JSON.stringify(games));

      return updatedGame;
    }

    throw new ApiError("Game not found");
  };

  deleteGame = async (gameId: string): Promise<void> => {
    const gamesJSON = localStorage.getItem("games");

    if (gamesJSON) {
      const games = JSON.parse(gamesJSON);

      delete games[gameId];

      localStorage.setItem("games", JSON.stringify(games));

      return;
    }

    throw new ApiError("Game not found");
  };
}
