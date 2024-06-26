import fs from "fs/promises";
import path from "path";
import { session } from "electron";

import { Game, GameState } from "@/types";
import { GameAPI, GameFromServer } from "@/client/api/GameAPI";
import { Fetcher } from "@/client/api/Fetcher";

import { ValueExtractor } from "./game-state-parameters/ValueExtractor";

import { moveFolder } from "./fs/moveFolder";
import { downloadToFolder } from "./fs/downloadToFolder";
import { extractZIP } from "./fs/zip/extractZIP";
import { zipFolderOrFile } from "./fs/zip/zipFolderOrFile";
import { getTempFolderPath } from "./fs/getTempFolderPath";

export class StatesManager {
  private readonly valueExtractor: ValueExtractor;
  private readonly fetcher: Fetcher;
  private readonly tempFolderPath: string;

  constructor(valueExtractor: ValueExtractor, fetcher: Fetcher) {
    this.valueExtractor = valueExtractor;
    this.fetcher = fetcher;

    this.tempFolderPath = getTempFolderPath();
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

    await this.fetcher.post(`/game-saves`, {
      headers: {
        Cookie: await this.buildCookieHeader(),
      },
      body: formData,
    });

    return gameStateData;
  }

  async reuploadState(gameState: GameState) {
    const gameStateData = await this.getState(gameState);
    const formData = this.mapToGameStateData(gameState, gameStateData);

    await this.fetcher.patch(`/game-saves/${gameState.id}`, {
      headers: {
        Cookie: await this.buildCookieHeader(),
      },
      body: formData,
    });

    return gameStateData;
  }

  async downloadState(gameState: GameState) {
    const archivePath = this.tempFolderPath;
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
    // copy all files to temp folder
    const tempFolderBeforeUpload = path.join(
      this.tempFolderPath,
      `/before-upload/${folder.name}-${Math.random()}`,
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
    const game = await this.fetcher.get<GameFromServer>(`/games/${gameId}`, {
      headers: {
        Cookie: await this.buildCookieHeader(),
      },
    });

    return GameAPI.mapGameFromServer(game);
  }

  private async buildCookieHeader() {
    const cookies = await session.defaultSession.cookies.get({});
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";");
  }
}
