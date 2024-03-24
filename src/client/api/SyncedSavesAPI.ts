import { GameState } from "@/types";

export class SyncedStatesAPI {
  getSyncedStates = async (): Promise<GameState[]> => {
    const statesJSON = localStorage.getItem("saves");

    if (statesJSON) {
      const states = JSON.parse(statesJSON);

      const statesArray: GameState[] = [];

      for (const key in states) {
        statesArray.push(states[key]);
      }

      return statesArray;
    }

    return [];
  };
}
