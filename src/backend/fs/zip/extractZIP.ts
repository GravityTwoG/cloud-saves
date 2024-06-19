import AdmZip from "adm-zip";

export function extractZIP(filePath: string) {
  const zip = new AdmZip(filePath);
  const extractedFolderName = filePath.replace(".zip", ".extracted");
  zip.extractAllTo(extractedFolderName, true);

  return extractedFolderName;
}
