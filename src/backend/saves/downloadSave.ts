import AdmZip from "adm-zip";

export async function downloadSave(url: string) {
  // TODO
  console.log("Downloading save", url);
  return { path: "" };
}

export async function downloadAndExtractSave(url: string) {
  // TODO
  const save = await downloadSave(url);
  // TODO
  extract(save.path);

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
