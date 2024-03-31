import fs from "fs/promises";
import path from "path";
import { isSystemError } from "./utils";

async function tryToMkdir(path: string): Promise<void> {
  try {
    await fs.mkdir(path);
  } catch (error) {
    if (isSystemError(error) && error.code !== "EEXIST") {
      throw error;
    }
  }
}

async function moveFolderRecursive(
  sourceDir: string,
  targetDir: string
): Promise<void> {
  const files = await fs.readdir(sourceDir);

  await Promise.all(
    files.map(async (file) => {
      const oldPath = path.join(sourceDir, file);
      const newPath = path.join(targetDir, file);
      const stat = await fs.lstat(oldPath);

      if (stat.isDirectory()) {
        await tryToMkdir(newPath);
        await moveFolderRecursive(oldPath, targetDir);
      } else if (stat.isFile()) {
        await fs.rename(oldPath, newPath);
      }
    })
  );
}

export async function moveFolder(
  sourceDir: string,
  targetDir: string
): Promise<void> {
  const sourceStat = await fs.lstat(sourceDir);

  if (sourceStat.isDirectory()) {
    await tryToMkdir(targetDir);
  }

  await moveFolderRecursive(sourceDir, targetDir);
}
