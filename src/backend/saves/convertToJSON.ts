import child_process from "child_process";
import fs from "fs/promises";

import { decompressSAV } from "./decompressSAV";

const UESAVE_TYPE_MAPS = [
  ".worldSaveData.CharacterSaveParameterMap.Key=Struct",
  ".worldSaveData.FoliageGridSaveDataMap.Key=Struct",
  ".worldSaveData.FoliageGridSaveDataMap.ModelMap.InstanceDataMap.Key=Struct",
  ".worldSaveData.MapObjectSpawnerInStageSaveData.Key=Struct",
  ".worldSaveData.ItemContainerSaveData.Key=Struct",
  ".worldSaveData.CharacterContainerSaveData.Key=Struct",
];

async function readFile(save_path: string, file: string) {
  const data = await fs.readFile(save_path + "/" + file);
  const uncompressed_data = await decompressSAV(data, file);

  if (uncompressed_data != null) {
    console.log(`File ${file} uncompressed successfully`);
    return uncompressed_data;
  }
  console.log(`File ${file} failed to decompress`);

  console.log("Reading raw data");
  return data;
}

async function convert(uesave_path: string, save_path: string, file: string) {
  const uncompressed_data = await readFile(save_path, file);

  // Save the uncompressed file
  // await fs.writeFile(save_path + "/" + file + ".gvas", uncompressed_data);

  try {
    const path = uesave_path.split("\\");
    const uesave_cwd = path.slice(0, path.length - 1).join("\\");
    const command = path[path.length - 1];
    const args = uesave_params(
      save_path + "/" + file + ".json",
      UESAVE_TYPE_MAPS
    );

    // Convert to json with uesave
    console.log("Converting to JSON", file);
    const status = await child_process.spawnSync(command, args, {
      input: uncompressed_data,
      cwd: uesave_cwd,
    });

    if (status.status !== 0) {
      throw status.stderr;
    }
    console.log(`File ${file} converted to JSON successfully`);
  } catch (error) {
    if (error instanceof Buffer) {
      console.log(error.toString());
    } else {
      console.log(error);
    }
    console.log(`uesave.exe failed to convert ${file}`);
  }
}

function uesave_params(out_path: string, uesave_type_maps: string[]) {
  const args = ["to-json", "--output", out_path];
  for (const map_type of uesave_type_maps) {
    args.push("--type");
    args.push(`${map_type}`);
  }

  return args;
}

async function main() {
  if (process.argv.length < 3) {
    process.exit(1);
  }

  const uesave_path = process.argv[2];
  const save_path = process.argv[3];

  const files = (await fs.readdir(save_path, { recursive: true })).filter(
    (fn) => fn.endsWith(".sav") && fn !== "Level.sav"
  );

  await Promise.all(files.map((file) => convert(uesave_path, save_path, file)));
}

main();
