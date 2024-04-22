import path from "path";
import fs from "fs";
import readline from "readline/promises";
import { FileConverter } from "./FileConverter";

// converts text files in format like below (key and value seperated by :) to json
// key1:value1
export class ColonTextConverter implements FileConverter {
  async convert(
    folderPath: string,
    inputFilename: string,
    outputFilename: string,
  ) {
    const inputFilePath = path.join(folderPath, inputFilename);
    const outputFilePath = path.join(folderPath, outputFilename);

    const lineReader = readline.createInterface({
      input: fs.createReadStream(inputFilePath, { encoding: "utf-8" }),
      crlfDelay: Infinity,
    });

    const json: Record<string, string> = {};

    for await (const line of lineReader) {
      const parts = line.split(":");
      const key = parts[0];
      const value = parts.slice(1).join("");
      json[key] = value;
    }

    await fs.promises.writeFile(outputFilePath, JSON.stringify(json));
  }
}
