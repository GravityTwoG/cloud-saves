import child_process from "child_process";
import fs from "fs/promises";
import path from "path";

import { decompressSAV } from "./decompressSAV";
import { FileConverter } from "./FileConverter";

const UESAVE_TYPE_MAPS = [
  ".worldSaveData.CharacterSaveParameterMap.Key=Struct",
  ".worldSaveData.FoliageGridSaveDataMap.Key=Struct",
  ".worldSaveData.FoliageGridSaveDataMap.ModelMap.InstanceDataMap.Key=Struct",
  ".worldSaveData.MapObjectSpawnerInStageSaveData.Key=Struct",
  ".worldSaveData.ItemContainerSaveData.Key=Struct",
  ".worldSaveData.CharacterContainerSaveData.Key=Struct",
];

export class SAVConverter implements FileConverter {
  convert = async (
    folderPath: string,
    inputFilename: string,
    outputFilename: string,
  ) => {
    try {
      const uncompressed_data = await this.readSAV(folderPath, inputFilename);

      let uePath = [];
      if (import.meta.env.NODE_ENV !== "production") {
        uePath = path
          .join(__dirname, `../../../../public/assets/uesave.exe`)
          .split("\\");
      } else {
        uePath = path.join(__dirname, `./assets/uesave.exe`).split("\\");
      }
      const uesaveFolder = uePath.slice(0, uePath.length - 1).join("\\");
      const command = uePath[uePath.length - 1];
      const args = this.toUEsaveParams(
        path.join(folderPath, outputFilename),
        UESAVE_TYPE_MAPS,
      );

      // Convert to json with uesave
      console.log("Converting to JSON", inputFilename);
      const status = await child_process.spawnSync(command, args, {
        input: uncompressed_data,
        cwd: uesaveFolder,
      });

      if (status.status !== 0) {
        throw status.stderr;
      }
      console.log(`File ${inputFilename} converted to JSON successfully`);
    } catch (error) {
      console.error(`uesave.exe failed to convert ${inputFilename}`);
      if (error instanceof Buffer) {
        throw new Error(error.toString());
      }
      throw error;
    }
  };

  private async readSAV(save_path: string, file: string) {
    const filePath = path.join(save_path, file);
    const data = await fs.readFile(filePath);
    const uncompressedData = await decompressSAV(data, file);

    if (uncompressedData != null) {
      console.log(`File ${filePath} uncompressed successfully`);
      return uncompressedData;
    }

    console.log("Reading raw data");
    return data;
  }

  private toUEsaveParams(outPath: string, uesaveTypeMaps: string[]) {
    const args = ["to-json", "--output", outPath];
    for (const mapType of uesaveTypeMaps) {
      args.push("--type");
      args.push(mapType);
    }

    return args;
  }
}
