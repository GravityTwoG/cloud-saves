import { Game, GameState, GameStateSync } from "@/types";
import { ipcMain, session } from "electron";
import { getModifiedAtMs } from "./fs/getModifiedAtMs";
import { StatesManager } from "./StatesManager";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const MIN_SYNC_PERIOD_MS = 1000 * 60;

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
      commonParameterId: number;
    }[];
  };
  imageUrl: string;
};

export class SyncManager {
  private intervalId: NodeJS.Timeout | null = null;
  private statesManager: StatesManager;

  constructor(statesManager: StatesManager) {
    this.statesManager = statesManager;
  }

  init(onGetSyncedStates: () => void) {
    this.intervalId = setInterval(() => {
      onGetSyncedStates();
    }, MIN_SYNC_PERIOD_MS);

    let isSyncing = false;
    ipcMain.handle("sendSyncedSaves", async (_, gameStates: GameState[]) => {
      if (isSyncing) {
        return;
      }

      isSyncing = true;
      await this.uploadSynced(gameStates);
      await this.downloadSynced(gameStates);
      isSyncing = false;
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    ipcMain.removeAllListeners("sendSyncedSaves");
  }

  private async uploadSynced(gameStates: GameState[]) {
    for (const gameState of gameStates) {
      try {
        const lastUploadMs = new Date(gameState.uploadedAt).getTime();
        const currentTimeMs = new Date().getTime();
        const periodMs = this.getPeriodInMs(gameState.sync);

        console.log("lastUpload", lastUploadMs, "currentTime", currentTimeMs);

        if (currentTimeMs - lastUploadMs > periodMs && periodMs > 0) {
          console.log("Uploading state", gameState.localPath);
          await this.uploadState(gameState);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    }
  }

  private async uploadState(gameState: GameState) {
    const game = gameState.gameId
      ? await this.getGame(gameState.gameId)
      : undefined;

    const response = await this.statesManager.uploadState(
      { name: gameState.name, path: gameState.localPath },
      game
    );

    const formData = new FormData();
    formData.append("archive", new Blob([response.buffer]));
    formData.append(
      "gameStateData",
      JSON.stringify({
        gameId: gameState.gameId,
        name: game ? game.name : gameState.name,
        localPath: gameState.localPath,
        isPublic: false,
        gameStateValues: response.gameStateValues.map((value) => ({
          value: value.value,
          gameStateParameterId: value.gameStateParameterId,
        })),
      })
    );

    const response2 = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/game-saves/${gameState.id}`,
      {
        method: "PATCH",
        headers: {
          Cookie: await this.buildCookieHeader(),
        },
        body: formData,
      }
    );

    console.log(response2.status);
    console.log(response2.statusText);
  }

  private async buildCookieHeader() {
    const cookies = await session.defaultSession.cookies.get({});
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";");
  }

  private async getGame(gameId: string): Promise<Game> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/games/${gameId}`,
      {
        headers: {
          Cookie: await this.buildCookieHeader(),
        },
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const game = (await response.json()) as GameFromServer;

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
          commonParameter: {
            id: field.commonParameterId.toString(),
            type: {
              type: field.type,
              id: field.type,
            },
            label: "",
            description: "",
          },
          label: field.label,
          description: field.description,
        })),
      },
      iconURL: game.imageUrl,
    };
  }

  private async downloadSynced(gameStates: GameState[]) {
    for (const gameState of gameStates) {
      const lastUploadMs = new Date(gameState.uploadedAt).getTime();
      const modifiedAtMs = await getModifiedAtMs(gameState.localPath);

      try {
        if (lastUploadMs > modifiedAtMs) {
          console.log("Downloading state", gameState.localPath);
          await this.statesManager.downloadState(gameState);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    }
  }

  private getPeriodInMs(sync: GameStateSync) {
    switch (sync) {
      case GameStateSync.NO:
        return -1;
      case GameStateSync.EVERY_HOUR:
        return HOUR;
      case GameStateSync.EVERY_DAY:
        return 24 * HOUR;
      case GameStateSync.EVERY_WEEK:
        return 24 * 7 * HOUR;
      case GameStateSync.EVERY_MONTH:
        return 24 * 30 * HOUR;
    }
  }
}
