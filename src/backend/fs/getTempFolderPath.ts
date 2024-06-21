import os from "os";
import path from "path";

export function getTempFolderPath() {
  const tempPath = os.tmpdir();
  return path.join(tempPath, "cloud-saves");
}
