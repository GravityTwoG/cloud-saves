import path from "path";
import fs from "fs/promises";

import { Game, GameStateParameters, JSONType } from "@/types";

import { FileConverter } from "./converters/FileConverter";

export class ValueExtractor {
  private readonly converters: Record<string, FileConverter> = {};

  constructor(converters: Record<string, FileConverter>) {
    this.converters = converters;
  }

  async extract(filePath: string, game: Game) {
    const createdFiles: string[] = [];

    for (const pipelineItem of game.extractionPipeline) {
      if (this.converters[pipelineItem.type]) {
        await this.converters["sav-to-json"].convert(
          filePath,
          pipelineItem.inputFilename,
          pipelineItem.outputFilename,
        );
        createdFiles.push(path.join(filePath, pipelineItem.outputFilename));
      }
    }

    const gameStateParameters = game.gameStateParameters;

    const json = await fs.readFile(
      path.join(filePath, gameStateParameters.filename),
      {
        encoding: "utf-8",
      },
    );

    const gameStateValues = this.extractValues(
      JSON.parse(json),
      gameStateParameters,
    );

    await Promise.allSettled(createdFiles.map((file) => fs.unlink(file)));

    return gameStateValues;
  }

  private extractValues(
    input: JSONType,
    schema: GameStateParameters,
  ): {
    gameStateParameterId: string;
    value: string;
  }[] {
    const gameStateValues: {
      gameStateParameterId: string;
      value: string;
    }[] = [];

    for (const field of schema.parameters) {
      const value = this.readByKey(field.key, input);

      if (Array.isArray(value)) {
        for (const subValue of value) {
          gameStateValues.push({
            gameStateParameterId: field.id,
            value: subValue,
          });
        }
      }

      if (!isObject(value) && !Array.isArray(value) && value !== null) {
        gameStateValues.push({
          gameStateParameterId: field.id,
          value: value,
        });
      }
    }

    return gameStateValues;
  }

  private readByKey(key: string, input: JSONType): string | string[] | null {
    const keys = key.split(".");
    let currentValue = input;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLastKey = i === keys.length - 1;

      let value = currentValue[key];
      if (this.isArrayIndex(key) && Array.isArray(currentValue)) {
        if (key === "[*]") {
          const values: string[] = [];
          const restKey = keys.slice(i + 1).join(".");
          for (let j = 0; j < currentValue.length; j++) {
            const elem = isLastKey
              ? currentValue[j]
              : this.readByKey(restKey, currentValue[j]);

            if (this.isPrimitiveType(elem) && isLastKey) {
              values.push(elem.toString());
            }
          }
          return values;
        } else {
          const index = parseInt(key.slice(1, -1));
          value = currentValue[index];
        }
      } else if (this.isArrayIndex(key) && !Array.isArray(currentValue)) {
        return null;
      }

      if (this.isPrimitiveType(value) && isLastKey) {
        return value.toString();
      }

      if (
        value === null ||
        value === undefined ||
        !isObject(value) ||
        !Array.isArray(value)
      ) {
        return null;
      }

      currentValue = value;
    }

    return null;
  }

  private isArrayIndex(key: string): boolean {
    return /^\[(\d+)|(\*)\]$/.test(key);
  }

  private isPrimitiveType(value: unknown): value is number | boolean | string {
    return (
      typeof value === "number" ||
      typeof value === "boolean" ||
      typeof value === "string"
    );
  }
}

function isObject(value: unknown): value is JSONType {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
