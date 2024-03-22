import path from "path";
import fs from "fs/promises";

import { Game, GameStateParameters, GameStateValue, JSONType } from "@/types";

import { FileConverter } from "./converters/FileConverter";

export class ValueExtractor {
  private readonly converters: Record<string, FileConverter> = {};

  constructor(converters: Record<string, FileConverter>) {
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
  ): GameStateValue[] {
    const gameStateValues: GameStateValue[] = [];

    for (const field of schema.parameters) {
      const value = this.readByKey(field.key, input);

      if (!isObject(value) && !Array.isArray(value) && value !== null) {
        gameStateValues.push({
          value: value,
          type: field.type.type,
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
  ): string | null | JSONType | JSONType[] {
    const keys = key.split(".");

    const res = keys.reduce((object, cur) => {
      if (object !== null && isObject(object)) {
        return `${object[cur]}`;
      }
      return null;
    }, input as string | null | JSONType | JSONType[]);

    return res;
  }
}

function isObject(value: unknown): value is JSONType {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
