import { GamePath } from "@/types";
import fs from "fs";
import os from "os";
import path from "path";

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

export async function getSavePaths(paths: GamePath[]): Promise<GamePath[]> {
  const validPaths: GamePath[] = [];

  for (const gamePath of paths) {
    const realPath = replaceShorthands(gamePath.path);

    const isGlob = realPath.includes("*");

    if (fs.existsSync(realPath)) {
      validPaths.push({
        ...gamePath,
        path: realPath,
      });
    } else if (isGlob) {
      try {
        const files = getFiles(realPath);

        for (const file of files) {
          validPaths.push({
            ...gamePath,
            path: file.path,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  return validPaths;
}

export function getFiles(realPath: string) {
  const parts = realPath.split("\\");
  const idx = parts.findIndex((part) => part.includes("*"));
  const parentPath = parts.slice(0, idx).join("\\");
  const pattern = parts.slice(idx, parts.length).join("\\");
  const regex = new RegExp(pattern);

  const files = fs
    .readdirSync(parentPath, { withFileTypes: true })
    .map((dirent) => {
      const absolutefilepath = path.join(parentPath, dirent.name);
      const stats: fs.Stats = fs.statSync(absolutefilepath);
      return {
        name: path.basename(absolutefilepath),
        path: absolutefilepath,
        size: stats.size,
        mtime: stats.mtime,
        type: dirent.isDirectory() ? "folder" : "file",
      };
    })
    .filter((file) => {
      return file.name.match(regex);
    });
  return files;
}
