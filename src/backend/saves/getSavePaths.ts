import fs from "fs";
import os from "os";

const shorthands = [
  {
    shorthand: "%USERPROFILE%",
    replacement: os.homedir(),
  },
];

function replaceShorthands(path: string) {
  for (const shorthand of shorthands) {
    path = path.replace(shorthand.shorthand, shorthand.replacement);
  }
  return path;
}

export async function getSavePaths(paths: string[]): Promise<string[]> {
  const validPaths = [];

  for (const path of paths) {
    const realPath = replaceShorthands(path);
    console.log(realPath);

    if (fs.existsSync(realPath)) {
      validPaths.push(realPath);
    }
  }

  return validPaths;
}
