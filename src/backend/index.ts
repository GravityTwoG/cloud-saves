import { GameSaveAPI } from "./GameSaveAPI";

import { SavesManager } from "./SavesManager";
import { SyncManager } from "./SyncManager";

import { ValueExtractor } from "./game-state-parameters/ValueExtractor";

import { SAVConverter } from "./game-state-parameters/converters/SAVConverter";
import { ColonTextConverter } from "./game-state-parameters/converters/ColonTextConverter";

const converters = {
  "sav-to-json": new SAVConverter(),
  "colon-text-to-json": new ColonTextConverter(),
};

const valueExtractor = new ValueExtractor(converters);
export const savesManager = new SavesManager(valueExtractor);
export const syncManager = new SyncManager(new GameSaveAPI(savesManager));
