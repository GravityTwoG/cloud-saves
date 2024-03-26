import { Game } from "@/types";
import { ApiError } from "../ApiError";
import { AddGameDTO, IGameAPI, UpdateGameDTO } from "../interfaces/IGameAPI";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";

export class GameAPIMock implements IGameAPI {
  getGames = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<Game>> => {
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

      return {
        ...gameToSave,
        gameStateParameters: {
          filename: gameToSave.gameStateParameters.filename,
          parameters: gameToSave.gameStateParameters.parameters.map(
            (field) => ({
              id: field.id,
              key: field.key,
              type: field.type,
              commonParameter: {
                id: "id",
                type: {
                  id: field.type.id,
                  type: field.type.type,
                },
                label: "label",
                description: "description",
              },
              label: field.label,
              description: field.description,
            })
          ),
        },
      };
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

      const existingGame: Game = games[game.id];
      const updatedGame: Game = {
        id: game.id,
        name: game.name || existingGame.name,
        description: game.description || existingGame.description,
        iconURL: "",
        paths: game.paths || existingGame.paths,
        extractionPipeline:
          game.extractionPipeline || existingGame.extractionPipeline,
        gameStateParameters: game.gameStateParameters
          ? {
              filename: game.gameStateParameters.filename,
              parameters: game.gameStateParameters.parameters.map((field) => ({
                id: field.id,
                key: field.key,
                type: field.type,
                commonParameter: {
                  id: "id",
                  type: {
                    id: field.type.id,
                    type: field.type.type,
                  },
                  label: "label",
                  description: "description",
                },
                label: field.label,
                description: field.description,
              })),
            }
          : existingGame.gameStateParameters,
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
