import AdmZip from "adm-zip";
import fs from "fs/promises";
import path from "path";

import { Game } from "@/types";

import { convertSAVToJSON } from "./metadata/convertSAVToJSON";
import { extractMetadataFromJSON } from "./metadata/extractMetadataFromJSON";

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
    const metadata = game
      ? await this.getMetadata(folder, game)
      : { fields: [] };

    const buffer = zip.toBuffer();
    return {
      buffer,
      metadata,
    };
  }

  private async getMetadata(
    folder: { path: string; name: string },
    game: Game
  ) {
    const createdFiles: string[] = [];

    for (const pipelineItem of game.extractionPipeline) {
      if (pipelineItem.type === "sav-to-json") {
        await convertSAVToJSON(
          folder.path,
          pipelineItem.inputFilename,
          pipelineItem.outputFilename
        );
        createdFiles.push(path.join(folder.path, pipelineItem.outputFilename));
      }
    }

    const metadataSchema = game.metadataSchema;

    const json = await fs.readFile(
      path.join(folder.path, metadataSchema.filename),
      {
        encoding: "utf-8",
      }
    );

    const metadata = extractMetadataFromJSON(JSON.parse(json), metadataSchema);

    await Promise.allSettled(createdFiles.map((file) => fs.unlink(file)));

    return metadata;
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
