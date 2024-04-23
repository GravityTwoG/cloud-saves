import AdmZip from "adm-zip";
import fs from "fs/promises";

export async function zipFolderOrFile(filePath: string, archivePath: string) {
  const zip = new AdmZip();

  const isDirectory = (await fs.lstat(filePath)).isDirectory();

  if (isDirectory) {
    await zip.addLocalFolderPromise(archivePath, {});
  } else {
    zip.addLocalFile(archivePath);
  }

  return zip;
}
