import fs from "fs";
import path from "path";

export function getFolderInfo(folderPath: string) {
  const files = fs
    .readdirSync(folderPath, { withFileTypes: true })
    .map((dirent) => {
      const absolutefilepath = path.join(folderPath, dirent.name);
      const stats: fs.Stats = fs.statSync(absolutefilepath);
      return {
        name: path.basename(absolutefilepath),
        path: absolutefilepath,
        size: stats.size,
        mtime: stats.mtime,
        type: dirent.isDirectory() ? "folder" : "file",
      };
    });

  return { folder: folderPath, files };
}
