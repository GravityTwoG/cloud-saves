import { GameState } from "@/types";
import { LocalStorage } from "./mocks/LocalStorage";

const ls = new LocalStorage("game_states_");

export class SyncedStatesAPI {
  getSyncedStates = async (): Promise<GameState[]> => {
    try {
      const states = ls.getItem<Record<string, GameState>>("saves");

      const statesArray: GameState[] = [];

      for (const key in states) {
        statesArray.push(states[key]);
      }

      return statesArray;
    } catch (e) {
      return [];
    }
  };
}
