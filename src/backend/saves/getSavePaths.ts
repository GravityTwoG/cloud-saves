import fs from "fs";
import os from "os";

export async function getSavePaths(paths: string[]): Promise<string[]> {
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
