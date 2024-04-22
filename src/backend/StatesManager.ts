import fs from "fs/promises";
import path from "path";
import os from "os";
import { session } from "electron";

import { Game, GameState } from "@/types";
import { GameAPI, GameFromServer } from "@/client/api/GameAPI";

import { ValueExtractor } from "./game-state-parameters/ValueExtractor";

import { moveFolder } from "./fs/moveFolder";
import { downloadToFolder } from "./fs/downloadToFolder";
import { extractZIP } from "./fs/extractZIP";
import { zipFolderOrFile } from "./fs/zipFolderOrFile";

export class StatesManager {
  private readonly valueExtractor: ValueExtractor;

  constructor(valueExtractor: ValueExtractor) {
    this.valueExtractor = valueExtractor;
  }

  async uploadState(folder: {
    gameId?: string;
    localPath: string;
    name: string;
    isPublic: boolean;
  }) {
    const gameStateData = await this.getState(folder);
    const formData = this.mapToGameStateData(
      {
        ...folder,
        gameId: folder.gameId || "",
      },
      gameStateData,
    );

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/game-saves`,
      {
        method: "POST",
        headers: {
          Cookie: await this.buildCookieHeader(),
        },
        body: formData,
      },
    );
    await this.handleError(response);

    return gameStateData;
  }

  async reuploadState(gameState: GameState) {
    const gameStateData = await this.getState(gameState);
    const formData = this.mapToGameStateData(gameState, gameStateData);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/game-saves/${gameState.id}`,
      {
        method: "PATCH",
        headers: {
          Cookie: await this.buildCookieHeader(),
        },
        body: formData,
      },
    );

    await this.handleError(response);

    return gameStateData;
  }

  async downloadState(gameState: GameState) {
    const archivePath = this.getTempFolderPath();
    const filename = `${gameState.name}-archive.zip`;
    const filePath = path.join(archivePath, filename);

    await downloadToFolder(gameState.archiveURL, archivePath, filename);

    const extractedFolderPath = await extractZIP(filePath);

    // move extracted folder to game states folder
    await moveFolder(extractedFolderPath, gameState.localPath);

    // delete extracted folder
    await fs.rm(extractedFolderPath, { recursive: true, force: true });
    // delete archive
    await fs.rm(filePath, { recursive: true, force: true });
  }

  private getTempFolderPath() {
    const tempPath = os.tmpdir();
    return path.join(tempPath, "cloud-saves");
  }

  private mapToGameStateData = (
    gameState: {
      gameId: string;
      localPath: string;
      name: string;
      isPublic: boolean;
    },
    response: {
      buffer: Buffer;
      gameStateValues: { value: string; gameStateParameterId: string }[];
    },
  ) => {
    const formData = new FormData();
    formData.append("archive", new Blob([response.buffer]));
    formData.append(
      "gameStateData",
      JSON.stringify({
        gameId: gameState.gameId,
        name: gameState.name,
        localPath: gameState.localPath,
        isPublic: gameState.isPublic,
        gameStateValues: response.gameStateValues.map((value) => ({
          value: value.value,
          gameStateParameterId: value.gameStateParameterId,
        })),
      }),
    );

    return formData;
  };

  // returns gameStateValues and buffer with gameState archive
  private async getState(folder: {
    gameId?: string;
    localPath: string;
    name: string;
  }) {
    const tempFolderPath = this.getTempFolderPath();
    // copy all files to temp folder
    const tempFolderBeforeUpload = path.join(
      tempFolderPath,
      "/before-upload/" + folder.name,
    );
    await fs.cp(folder.localPath, tempFolderBeforeUpload, { recursive: true });

    const zip = await zipFolderOrFile(folder.localPath, tempFolderBeforeUpload);

    const game = folder.gameId ? await this.getGame(folder.gameId) : undefined;
    const gameStateValues = game
      ? await this.valueExtractor.extract(tempFolderBeforeUpload, game)
      : [];

    // remove temp folder
    await fs.rm(tempFolderBeforeUpload, { recursive: true });

    return {
      buffer: zip.toBuffer(),
      gameStateValues,
    };
  }

  private async getGame(gameId: string): Promise<Game> {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/games/${gameId}`,
      {
        headers: {
          Cookie: await this.buildCookieHeader(),
        },
      },
    );

    await this.handleError(response);

    const game = (await response.json()) as GameFromServer;

    return GameAPI.mapGameFromServer(game);
  }

  private async buildCookieHeader() {
    const cookies = await session.defaultSession.cookies.get({});
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";");
  }

  private async handleError(response: Response) {
    if (!response.ok) {
      const error = new Error(`${response.status}:${response.statusText}`);

      try {
        const json = await response.json();
        error.message = json.message;
        error.cause = json;
      } catch (error) {
        console.log("response.json() error", error);
      }

      throw error;
    }
  }
}
