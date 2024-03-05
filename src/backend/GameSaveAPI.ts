import { session } from "electron";
import { Game, GameSave } from "@/types";
import { SavesManager } from "./SavesManager";

export class GameSaveAPI {
  private savesManager: SavesManager;

  constructor(savesManager: SavesManager) {
    this.savesManager = savesManager;
  }

  uploadSave = async (gameSave: GameSave) => {
    const game = gameSave.gameId
      ? await this.getGame(gameSave.gameId)
      : undefined;

    const response = await this.savesManager.uploadSave(
      { name: gameSave.name, path: gameSave.path },
      game
    );

    // upload buffer and metadata
    // await fetch(`${import.meta.env.VITE_API_BASE_URL}/game-saves`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     buffer: response.buffer,
    //     metadata: response.metadata,
    //   }),
    // });

    return response;
  };

  downloadSave = async (gameSave: GameSave) => {
    await this.savesManager.downloadSave(gameSave.path);
  };

  private async getGame(gameId: string): Promise<Game> {
    const cookies = await session.defaultSession.cookies.get({});

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/games/${gameId}`,
      {
        headers: {
          Cookie: cookies
            .map((cookie) => `${cookie.name}=${cookie.value}`)
            .join(";"),
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const game = await response.json();

    return {
      id: game.id.toString(),
      name: game.name,
      description: game.description,
      paths: game.paths.map((path: { path: string }) => path.path),
      extractionPipeline: game.extractionPipeline,
      metadataSchema: game.schema,
      iconURL: `${import.meta.env.VITE_API_BASE_URL}/games/image/${
        game.imageId
      }`,
    };
  }
}
