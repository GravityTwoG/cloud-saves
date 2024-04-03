import { BrowserWindow } from "electron";
import electronDl from "electron-dl";

export async function downloadToFolder(
  sourceURL: string,
  targetFolder: string,
  targetFilename: string,
  openFolderWhenDone?: boolean
): Promise<void> {
  const win = BrowserWindow.getAllWindows();
  if (!win.length) {
    return Promise.reject("No focused window");
  }

  await electronDl.download(win[0], sourceURL, {
    saveAs: false,
    directory: targetFolder,
    filename: targetFilename,
    overwrite: true,
    openFolderWhenDone: openFolderWhenDone,
  });
}
