import fs from "fs";
import path from "path";
import { dialog, ipcMain } from "electron";

export function setupIPC() {
  ipcMain.handle("showFolderDialog", async () => {
    const obj = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (obj.canceled) {
      return null;
    }

    const folder = obj.filePaths[0];

    const files = fs
      .readdirSync(folder, { withFileTypes: true })
      .map((dirent) => {
        const absolutefilepath = folder + "/" + dirent.name;
        const stats: fs.Stats = fs.statSync(absolutefilepath);
        return {
          name: path.basename(absolutefilepath),
          size: stats.size,
          mtime: stats.mtime,
        };
      });

    return { folder, files };
  });
}
