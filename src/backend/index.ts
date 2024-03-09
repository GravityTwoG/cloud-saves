import { GameSaveAPI } from "./GameSaveAPI";
import { SavesManager } from "./SavesManager";
import { SyncManager } from "./SyncManager";
import { ValueExtractor } from "./game-state-parameters/ValueExtractor";
import { SAVtoJSONConverter } from "./game-state-parameters/converters/SAVtoJSONConverter";

const converters = {
  "sav-to-json": new SAVtoJSONConverter(),
};

const valueExtractor = new ValueExtractor(converters);
export const savesManager = new SavesManager(valueExtractor);
export const syncManager = new SyncManager(new GameSaveAPI(savesManager));
