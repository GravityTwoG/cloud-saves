import { session } from "electron";
import { Game, GameState } from "@/types";
import { StatesManager } from "./StatesManager";

export class GameStateAPI {
  private statesManager: StatesManager;

  constructor(statesManager: StatesManager) {
    this.statesManager = statesManager;
  }

  uploadState = async (gameState: GameState) => {
    const game = gameState.gameId
      ? await this.getGame(gameState.gameId)
      : undefined;

    const response = await this.statesManager.uploadSave(
      { name: gameState.name, path: gameState.localPath },
      game
    );

    // upload buffer and gameStateValues
    // await fetch(`${import.meta.env.VITE_API_BASE_URL}/game-saves`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     buffer: response.buffer,
    //     gameStateValues: response.gameStateValues,
    //   }),
    // });

    return response;
  };

  downloadState = async (gameState: GameState) => {
    await this.statesManager.downloadState(gameState.localPath);
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
      gameStateParameters: game.schema,
      iconURL: `${import.meta.env.VITE_API_BASE_URL}/games/image/${
        game.imageId
      }`,
    };
  }
}
