import AdmZip from "adm-zip";
import fs from "fs/promises";

import { Game } from "@/types";
import { ValueExtractor } from "./game-state-parameters/ValueExtractor";

export class StatesManager {
  private readonly valueExtractor: ValueExtractor;

  constructor(valueExtractor: ValueExtractor) {
    this.valueExtractor = valueExtractor;
  }

  async uploadSave(folder: { path: string; name: string }, game?: Game) {
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
      : { fields: [] };

    const buffer = zip.toBuffer();
    return {
      buffer,
      gameStateValues,
    };
  }

  async downloadState(archiveURL: string) {
    // TODO
    console.log("Downloading state", archiveURL);
    return { path: "" };
  }

  async downloadAndExtractSave(archiveURL: string, path: string) {
    // TODO
    const state = await this.downloadState(archiveURL);
    // TODO
    this.extractZIP(state.path);

    console.log("Extracted to", path);

    return state;
  }

  private extractZIP(filePath: string) {
    const zip = new AdmZip(filePath);

    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      console.log(entry.entryName);
    }

    zip.extractAllTo(filePath.replace(".zip", ".extracted"));

    // TODO
  }
}
