import fs from "fs/promises";

export async function getModifiedAtMs(filePath: string) {
  const stats = await fs.stat(filePath);
  return stats.mtimeMs;
}
