import AdmZip from "adm-zip";

export async function downloadSave(archiveURL: string) {
  // TODO
  console.log("Downloading save", archiveURL);
  return { path: "" };
}

export async function downloadAndExtractSave(archiveURL: string, path: string) {
  // TODO
  const save = await downloadSave(archiveURL);
  // TODO
  extract(save.path);

  console.log("Extracted to", path);

  return save;
}

export function extract(filePath: string) {
  const zip = new AdmZip(filePath);

  const zipEntries = zip.getEntries();

  for (const entry of zipEntries) {
    console.log(entry.entryName);
  }

  zip.extractAllTo(filePath.replace(".zip", ".extracted"));

  // TODO
}
