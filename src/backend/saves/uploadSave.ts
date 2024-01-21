import fs from "fs";
import AdmZip from "adm-zip";

export async function uploadSave(folder: { path: string; name: string }) {
  const zip = new AdmZip();

  const isDirectory = (await fs.promises.lstat(folder.path)).isDirectory();

  if (isDirectory) {
    await zip.addLocalFolderPromise(folder.path, {});
  } else {
    zip.addLocalFile(folder.path);
  }
  // await zip.writeZipPromise(`${path}.zip`);
  console.log("uploading");
  const buffer = zip.toBuffer();
  return buffer;
}
