import path from "path";
import fs from "fs/promises";

import { Game, GameStateParameters, GameStateValues, JSONType } from "@/types";

import { Converter } from "./converters/Converter";

export class ValueExtractor {
  private readonly converters: Record<string, Converter> = {};

  constructor(converters: Record<string, Converter>) {
    this.converters = converters;
  }

  async extract(folder: { path: string; name: string }, game: Game) {
    const createdFiles: string[] = [];

    for (const pipelineItem of game.extractionPipeline) {
      if (this.converters[pipelineItem.type]) {
        await this.converters["sav-to-json"].convert(
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

    const gameStateValues = this.extractValues(
      JSON.parse(json),
      gameStateParameters
    );

    await Promise.allSettled(createdFiles.map((file) => fs.unlink(file)));

    return gameStateValues;
  }

  private extractValues(
    input: JSONType,
    schema: GameStateParameters
  ): GameStateValues {
    const gameStateValues: GameStateValues = { fields: [] };

    for (const field of schema.fields) {
      const value = this.readByKey(field.key, input);

      if (!isObject(value) && !Array.isArray(value) && value !== null) {
        gameStateValues.fields.push({
          value: value,
          type: field.type,
          description: field.description,
          label: field.label,
        });
      }
    }

    return gameStateValues;
  }

  private readByKey(
    key: string,
    input: JSONType
  ): string | number | boolean | null | JSONType | JSONType[] {
    const keys = key.split(".");

    const res = keys.reduce((object, cur) => {
      if (object !== null && isObject(object)) {
        return object[cur];
      }
      return null;
    }, input as string | number | boolean | null | JSONType | JSONType[]);

    return res;
  }
}

function isObject(value: unknown): value is JSONType {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
