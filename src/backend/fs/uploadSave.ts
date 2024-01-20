import fs from "fs";
import AdmZip from "adm-zip";
import { uploadSave as apiUploadSave } from "../../external-api/saves";

export async function uploadSave(path: string) {
  const zip = new AdmZip();

  const isDirectory = (await fs.promises.lstat(path)).isDirectory();

  if (isDirectory) {
    await zip.addLocalFolderPromise(path, {});
  } else {
    zip.addLocalFile(path);
  }
  // await zip.writeZipPromise(`${path}.zip`);
  const buffer = await zip.toBufferPromise();

  await apiUploadSave(buffer);

  console.log("upload complete");
}
