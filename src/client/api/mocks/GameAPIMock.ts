import { Game } from "@/types";
import { ApiError } from "../ApiError";
import { AddGameDTO, IGameAPI, UpdateGameDTO } from "../interfaces/IGameAPI";
import { ResourceRequest, ResourceResponse } from "../interfaces/common";
import { LocalStorage } from "../LocalStorage";

const ls = new LocalStorage("games_");

export class GameAPIMock implements IGameAPI {
  getGames = async (
    query: ResourceRequest
  ): Promise<ResourceResponse<Game>> => {
    console.log("getGames", query);

    try {
      const games = ls.getItem<Game[]>("games");
      const gamesArray: Game[] = [];

      for (const key in games) {
        gamesArray.push(games[key]);
      }

      return {
        items: gamesArray,
        totalCount: gamesArray.length,
      };
    } catch (e) {
      return {
        items: [],
        totalCount: 0,
      };
    }
  };

  getGame = async (gameId: string): Promise<Game> => {
    try {
      const games = ls.getItem<Record<string, Game>>("games");
      return games[gameId];
    } catch (e) {
      throw new ApiError("Game not found");
    }
  };

  addGame = async (game: AddGameDTO): Promise<Game> => {
    const gameToSave: Game = {
      id: Math.floor(Math.random() * 1000).toString(),
      name: game.name,
      description: game.description,
      imageURL: "",
      paths: game.paths,
      extractionPipeline: game.extractionPipeline,
      gameStateParameters: {
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
      },
    };

    try {
      const games = ls.getItem<Record<string, Game>>("games");

      games[gameToSave.id] = gameToSave;
      ls.setItem("games", games);

      return gameToSave;
    } catch (e) {
      ls.setItem("games", { [gameToSave.id]: gameToSave });
      return gameToSave;
    }
  };

  updateGame = async (game: UpdateGameDTO): Promise<Game> => {
    try {
      const games = ls.getItem<Record<string, Game>>("games");

      const existingGame: Game = games[game.id];
      const updatedGame: Game = {
        id: game.id,
        name: game.name || existingGame.name,
        description: game.description || existingGame.description,
        imageURL: "",
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

      ls.setItem("games", games);

      return updatedGame;
    } catch (e) {
      throw new ApiError("Game not found");
    }
  };

  deleteGame = async (gameId: string): Promise<void> => {
    try {
      const games = ls.getItem<Record<string, Game>>("games");

      delete games[gameId];
      ls.setItem("games", games);
      return;
    } catch (e) {
      throw new ApiError("Game not found");
    }
  };
}
