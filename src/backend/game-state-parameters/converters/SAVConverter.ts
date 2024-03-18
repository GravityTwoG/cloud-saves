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

async function readFile(save_path: string, file: string) {
  const filePath = path.join(save_path, file);
  const data = await fs.readFile(filePath);
  const uncompressed_data = await decompressSAV(data, file);

  if (uncompressed_data != null) {
    console.log(`File ${filePath} uncompressed successfully`);
    return uncompressed_data;
  }

  console.log("Reading raw data");
  return data;
}

export class SAVConverter implements FileConverter {
  convert = async function (
    save_path: string,
    inputFilename: string,
    outputFilename: string
  ) {
    const uncompressed_data = await readFile(save_path, inputFilename);

    try {
      const uepath = path.join(__dirname, `./assets/uesave.exe`).split("\\");
      const uesave_cwd = uepath.slice(0, uepath.length - 1).join("\\");
      const command = uepath[uepath.length - 1];
      const args = toUesaveParams(
        path.join(save_path, outputFilename),
        UESAVE_TYPE_MAPS
      );

      // Convert to json with uesave
      console.log("Converting to JSON", inputFilename);
      const status = await child_process.spawnSync(command, args, {
        input: uncompressed_data,
        cwd: uesave_cwd,
      });

      if (status.status !== 0) {
        throw status.stderr;
      }
      console.log(`File ${inputFilename} converted to JSON successfully`);
    } catch (error) {
      console.log(`uesave.exe failed to convert ${inputFilename}`);
      if (error instanceof Buffer) {
        throw new Error(error.toString());
      }
      throw error;
    }
  };
}

function toUesaveParams(out_path: string, uesave_type_maps: string[]) {
  const args = ["to-json", "--output", out_path];
  for (const map_type of uesave_type_maps) {
    args.push("--type");
    args.push(`${map_type}`);
  }

  return args;
}
