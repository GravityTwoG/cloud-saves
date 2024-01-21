import { GameSave } from "../types";

export async function getSavePaths(): Promise<string[]> {
  const paths = [
    "C:/Users/%USERNAME%/Documents",
    "C:/Users/%USERNAME%/Documents/My Games",
    "C:/Users/%USERNAME%/Documents/Saved Games",
  ];

  const response = await window.electronAPI.getSavePaths(paths);
  return response.data || [];
}

export async function isSavePaths(
  paths: string[]
): Promise<{ path: string; isSavePath: boolean }[]> {
  return paths.map((path) => {
    return {
      path,
      isSavePath: true,
    };
  });
}

export async function getFolderInfo(folderPath: string) {
  const response = await window.electronAPI.getFolderInfo(folderPath);
  return response;
}

export async function showFolderDialog() {
  const response = await window.electronAPI.showFolderDialog();
  return response;
}

export async function getUserSaves(): Promise<GameSave[]> {
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);

    const savesArray: GameSave[] = [];

    for (const key in saves) {
      savesArray.push({
        gameId: key,
        path: saves[key].path,
        syncEnabled: saves[key].syncEnabled,
        size: 42,
        createdAt: new Date(),
      });
    }

    return savesArray;
  }

  return [];
}

export async function getSharedSaves(): Promise<GameSave[]> {
  return [];
}

export async function getGlobalSaves(): Promise<GameSave[]> {
  return [];
}

export async function uploadSave(save: {
  path: string;
  name: string;
}): Promise<void> {
  const response = await window.electronAPI.uploadSave(save);
  console.log(response);

  console.log("uploading", save.path, save.name);
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);
    saves[save.path] = {
      path: save.path,
      name: save.name,
      syncEnabled: false,
    };
    localStorage.setItem("saves", JSON.stringify(saves));
  } else {
    localStorage.setItem(
      "saves",
      JSON.stringify({
        [save.path]: { path: save.path, name: save.name, syncEnabled: false },
      })
    );
  }
}

export async function toggleSync(path: string, enabled: boolean) {
  console.log("toggleSync", path, enabled);

  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);
    saves[path].syncEnabled = enabled;
    localStorage.setItem("saves", JSON.stringify(saves));
  }
}

export async function downloadSave(path: string) {
  const response = await window.electronAPI.downloadAndExtractSave(path);

  return response;
}

export async function deleteSave(path: string): Promise<void> {
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);
    delete saves[path];
    localStorage.setItem("saves", JSON.stringify(saves));
  }
}
