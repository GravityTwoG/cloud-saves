import fs from "fs/promises";
import path from "path";
import AdmZip from "adm-zip";
import { Game } from "@/types";
import { extractMetadataFromJSON } from "./extract";
import { convert } from "./convertToJSON";

export async function uploadSave(
  folder: { path: string; name: string },
  game?: Game
) {
  const zip = new AdmZip();

  const isDirectory = (await fs.lstat(folder.path)).isDirectory();

  if (isDirectory) {
    await zip.addLocalFolderPromise(folder.path, {});
  } else {
    zip.addLocalFile(folder.path);
  }
  // await zip.writeZipPromise(`${path}.zip`);
  const metadata = game ? await getMetadata(folder, game) : { fields: [] };

  const buffer = zip.toBuffer();
  return {
    buffer,
    metadata,
  };
}

async function getMetadata(folder: { path: string; name: string }, game: Game) {
  const createdFiles: string[] = [];

  for (const pipelineItem of game.extractionPipeline) {
    if (pipelineItem.type === "sav-to-json") {
      await convert(
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
