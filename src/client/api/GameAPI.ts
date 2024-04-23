import { Game } from "@/types";
import { Fetcher } from "./Fetcher";
import { AddGameDTO, IGameAPI, UpdateGameDTO } from "./interfaces/IGameAPI";
import { ResourceRequest, ResourceResponse } from "./interfaces/common";

export type GameFromServer = {
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
      commonParameter: {
        id: number;
        type: {
          id: number;
          type: string;
        };
        label: string;
        description: string;
      };
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
    return GameAPI.mapGameFromServer(game);
  };

  getGames = async (
    query: ResourceRequest,
  ): Promise<ResourceResponse<Game>> => {
    const games = await this.fetcher.get<{
      items: GameFromServer[];
      totalCount: number;
    }>(`/games`, {
      queryParams: query,
    });

    return {
      items: games.items.map(GameAPI.mapGameFromServer),
      totalCount: games.totalCount,
    };
  };

  addGame = (game: AddGameDTO): Promise<Game> => {
    const formData = this.mapToFormData(game);
    return this.fetcher.post("/games", {
      headers: {},
      body: formData,
    });
  };

  updateGame = (game: UpdateGameDTO): Promise<Game> => {
    const formData = this.mapToFormData(game);
    return this.fetcher.patch(`/games/${game.id}`, {
      headers: {},
      body: formData,
    });
  };

  deleteGame = (gameId: string): Promise<void> => {
    return this.fetcher.delete(`/games/${gameId}`);
  };

  private mapToFormData(addGameDTO: AddGameDTO) {
    const formData = new FormData();
    formData.append("image", addGameDTO.icon || "");
    formData.append(
      "gameData",
      JSON.stringify({
        name: addGameDTO.name,
        description: addGameDTO.description,
        paths: addGameDTO.paths,
        extractionPipeline: addGameDTO.extractionPipeline,
        schema: {
          filename: addGameDTO.gameStateParameters.filename,
          gameStateParameters: addGameDTO.gameStateParameters.parameters.map(
            (field) => ({
              id: field.id,
              key: field.key,
              type: field.type.type,
              commonParameterId: field.commonParameter.id,
              label: field.label,
              description: field.description,
            }),
          ),
        },
      }),
    );
    return formData;
  }

  static mapGameFromServer = (game: GameFromServer): Game => {
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
          commonParameter: field.commonParameter
            ? {
                id: field.commonParameter.id.toString(),
                type: {
                  type: field.commonParameter.type.type,
                  id: field.commonParameter.type.id.toString(),
                },
                label: field.commonParameter.label,
                description: field.commonParameter.description,
              }
            : {
                id: "",
                type: {
                  type: "",
                  id: "",
                },
                label: "",
                description: "",
              },
          label: field.label,
          description: field.description,
        })),
      },
      imageURL: game.imageUrl,
    };
  };
}
