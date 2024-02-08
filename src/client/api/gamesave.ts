import { GameSave, GameSaveSync } from "../../types";

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
      savesArray.push(saves[key]);
    }

    return savesArray;
  }

  return [];
}

export async function getUserSave(gameSaveId: string): Promise<GameSave> {
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);
    return saves[gameSaveId];
  }

  throw new Error("User save not found");
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
  const gameSaveId = save.path.split("/").join("-").split(" ").join("_");

  console.log("uploading", save.path, save.name);
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);

    if (saves[gameSaveId]) {
      saves[gameSaveId].archives.push({
        url: save.path,
        id: Math.random().toString(),
        size: 42,
        createdAt: new Date().toLocaleString(),
      });
    } else {
      saves[gameSaveId] = {
        id: gameSaveId,
        gameId: save.path,
        path: save.path,
        name: save.name,
        sync: "every hour",
        archives: [
          {
            url: save.path,
            id: Math.random().toString(),
            size: 42,
            createdAt: new Date().toLocaleString(),
          },
        ],
      };
    }

    localStorage.setItem("saves", JSON.stringify(saves));
  } else {
    localStorage.setItem(
      "saves",
      JSON.stringify({
        [gameSaveId]: {
          id: gameSaveId,
          gameId: save.path,
          path: save.path,
          name: save.name,
          sync: "every hour",
          archives: [
            {
              url: save.path,
              id: Math.random().toString(),
              size: 42,
              createdAt: new Date().toLocaleString(),
            },
          ],
        },
      })
    );
  }
}

export async function setupSync(settings: {
  gameSaveId: string;
  sync: GameSaveSync;
}) {
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);
    saves[settings.gameSaveId].sync = settings.sync;
    localStorage.setItem("saves", JSON.stringify(saves));
  }
}

export async function downloadSave(path: string) {
  const response = await window.electronAPI.downloadAndExtractSave(path);

  return response;
}

export async function deleteSave(gameSaveId: string): Promise<void> {
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);
    delete saves[gameSaveId];
    localStorage.setItem("saves", JSON.stringify(saves));
  }
}

export async function deleteGameSaveArchive(
  gameSaveArchiveId: string
): Promise<void> {
  const savesJSON = localStorage.getItem("saves");

  if (savesJSON) {
    const saves = JSON.parse(savesJSON);

    for (const gameSaveId in saves) {
      if (saves[gameSaveId].archives) {
        saves[gameSaveId].archives = saves[gameSaveId].archives.filter(
          (item: GameSave["archives"][0]) => item.id !== gameSaveArchiveId
        );
      }
    }

    localStorage.setItem("saves", JSON.stringify(saves));
  }
}
