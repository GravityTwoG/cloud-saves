import { StatesManager } from "./StatesManager";
import { SyncManager } from "./SyncManager";

import { ValueExtractor } from "./game-state-parameters/ValueExtractor";

import { SAVConverter } from "./game-state-parameters/converters/SAVConverter";
import { ColonTextConverter } from "./game-state-parameters/converters/ColonTextConverter";

const converters = {
  "sav-to-json": new SAVConverter(),
  "colon-text-to-json": new ColonTextConverter(),
};

const valueExtractor = new ValueExtractor(converters);
export const statesManager = new StatesManager(valueExtractor);
export const syncManager = new SyncManager(statesManager);
