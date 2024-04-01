import fs from "fs/promises";
import path from "path";
import os from "os";
import AdmZip from "adm-zip";

import { Game, GameState } from "@/types";
import { ValueExtractor } from "./game-state-parameters/ValueExtractor";
import { moveFolder } from "./fs/moveFolder";
import { downloadToFolder } from "./fs/downloadToFolder";
import { extractZIP } from "./fs/extractZIP";
import { session } from "electron";
import { GameFromServer } from "@/client/api/GameAPI";

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
      gameStateData
    );

    await fetch(`${import.meta.env.VITE_API_BASE_URL}/game-saves`, {
      method: "POST",
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
    return gameStateData;
  }

  async downloadState(gameState: GameState) {
    const tempPath = os.tmpdir();
    const archivePath = path.join(tempPath, "cloud-saves");
    const filename = `${gameState.name}-archive.zip`;
    const filePath = path.join(archivePath, filename);

    await downloadToFolder(gameState.archiveURL, archivePath, filename);

    const extractedFolderPath = await extractZIP(filePath);

    // move extracted folder to game states folder
    await moveFolder(extractedFolderPath, gameState.localPath);
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
    }
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
      })
    );

    return formData;
  };

  // returns gameStateValues and buffer with gameState archive
  private async getState(folder: {
    gameId?: string;
    localPath: string;
    name: string;
  }) {
    const zip = new AdmZip();

    const isDirectory = (await fs.lstat(folder.localPath)).isDirectory();

    if (isDirectory) {
      await zip.addLocalFolderPromise(folder.localPath, {});
    } else {
      zip.addLocalFile(folder.localPath);
    }

    const game = folder.gameId ? await this.getGame(folder.gameId) : undefined;
    const gameStateValues = game
      ? await this.valueExtractor.extract(folder.localPath, game)
      : [];

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

  private async buildCookieHeader() {
    const cookies = await session.defaultSession.cookies.get({});
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(";");
  }
}
