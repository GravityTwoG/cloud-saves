import fs from "fs/promises";
import path from "path";
import os from "os";
import AdmZip from "adm-zip";

import { Game, GameState } from "@/types";
import { ValueExtractor } from "./game-state-parameters/ValueExtractor";
import { moveFolder } from "./fs/moveFolder";
import { downloadToFolder } from "./fs/downloadToFolder";
import { extractZIP } from "./fs/extractZIP";

export class StatesManager {
  private readonly valueExtractor: ValueExtractor;

  constructor(valueExtractor: ValueExtractor) {
    this.valueExtractor = valueExtractor;
  }

  async uploadState(folder: { path: string; name: string }, game?: Game) {
    const zip = new AdmZip();

    const isDirectory = (await fs.lstat(folder.path)).isDirectory();

    if (isDirectory) {
      await zip.addLocalFolderPromise(folder.path, {});
    } else {
      zip.addLocalFile(folder.path);
    }
    // await zip.writeZipPromise(`${path}.zip`);
    const gameStateValues = game
      ? await this.valueExtractor.extract(folder, game)
      : [];

    const buffer = zip.toBuffer();
    return {
      buffer,
      gameStateValues,
    };
  }

  async downloadState(gameState: GameState) {
    const tempPath = os.tmpdir();
    const archivePath = path.join(tempPath, "cloud-saves");
    const filename = `${gameState.name}-archive.zip`;
    const filePath = path.join(archivePath, filename);

    await downloadToFolder(gameState.archiveURL, archivePath, filename);

    const extractedFolderPath = await extractZIP(filePath);

    // move extracted folder to game folder
    await moveFolder(extractedFolderPath, gameState.localPath);
  }
}
