import fs from "fs";
import os from "os";
import { getSavePaths as apiGetSavePaths } from "../../external-api/gamepath";

export async function getSavePaths(): Promise<string[]> {
  const paths = apiGetSavePaths();
  const validPaths = [];
  const username = os.userInfo().username;

  for (const path of paths) {
    const includesUsername = path.includes("%USERNAME%");

    let realPath = path;
    if (includesUsername) {
      realPath = path.replaceAll("%USERNAME%", username);
    }

    if (fs.existsSync(realPath)) {
      validPaths.push(realPath);
    }
  }

  return validPaths;
}
