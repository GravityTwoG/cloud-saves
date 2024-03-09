import AdmZip from "adm-zip";
import fs from "fs/promises";

import { Game } from "@/types";
import { extractGameStateValues } from "./gameStateParameters/extractGameStateValues";

export class SavesManager {
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
      ? await extractGameStateValues(folder, game)
      : { fields: [] };

    const buffer = zip.toBuffer();
    return {
      buffer,
      gameStateValues,
    };
  }

  async downloadSave(archiveURL: string) {
    // TODO
    console.log("Downloading save", archiveURL);
    return { path: "" };
  }

  async downloadAndExtractSave(archiveURL: string, path: string) {
    // TODO
    const save = await this.downloadSave(archiveURL);
    // TODO
    this.extract(save.path);

    console.log("Extracted to", path);

    return save;
  }

  private extract(filePath: string) {
    const zip = new AdmZip(filePath);

    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      console.log(entry.entryName);
    }

    zip.extractAllTo(filePath.replace(".zip", ".extracted"));

    // TODO
  }
}
