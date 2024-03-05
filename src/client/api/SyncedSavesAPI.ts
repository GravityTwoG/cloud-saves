import { GameSave } from "@/types";

export class SyncedSavesAPI {
  getSyncedSaves = async (): Promise<GameSave[]> => {
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
  };
}
