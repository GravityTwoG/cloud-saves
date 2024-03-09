import path from "path";
import fs from "fs/promises";

import { Game } from "@/types";
import { SAVtoJSONConverter } from "./convertSAVToJSON";
import { extractGameStateValuesFromJSON } from "./extractGameStateValuesFromJSON";

export const converters = {
  "sav-to-json": new SAVtoJSONConverter(),
};

export async function extractGameStateValues(
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

  const gameStateParameters = game.gameStateParameters;

  const json = await fs.readFile(
    path.join(folder.path, gameStateParameters.filename),
    {
      encoding: "utf-8",
    }
  );

  const gameStateValues = extractGameStateValuesFromJSON(
    JSON.parse(json),
    gameStateParameters
  );

  await Promise.allSettled(createdFiles.map((file) => fs.unlink(file)));

  return gameStateValues;
}
