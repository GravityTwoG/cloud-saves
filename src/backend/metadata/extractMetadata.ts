import path from "path";
import fs from "fs/promises";

import { Game } from "@/types";
import { SAVtoJSONConverter } from "./convertSAVToJSON";
import { extractMetadataFromJSON } from "./extractMetadataFromJSON";

export const converters = {
  "sav-to-json": new SAVtoJSONConverter(),
};

export async function extractMetadata(
  folder: { path: string; name: string },
  game: Game
) {
  const createdFiles: string[] = [];

  for (const pipelineItem of game.extractionPipeline) {
    if (converters[pipelineItem.type]) {
      await converters["sav-to-json"].convert(
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
