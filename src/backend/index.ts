import { Fetcher } from "@/client/api/Fetcher";

import { StatesManager } from "./StatesManager";
import { SyncManager } from "./SyncManager";

import { ValueExtractor } from "./game-state-parameters/ValueExtractor";

import { SAVConverter } from "./game-state-parameters/converters/SAVConverter";
import { ColonTextConverter } from "./game-state-parameters/converters/ColonTextConverter";
export { electronAPI } from "./electron-api";

const converters = {
  "sav-to-json": new SAVConverter(),
  "colon-text-to-json": new ColonTextConverter(),
};

const valueExtractor = new ValueExtractor(converters);

const fetcher = new Fetcher({ baseURL: import.meta.env.VITE_API_BASE_URL });

export const statesManager = new StatesManager(valueExtractor, fetcher);
export const syncManager = new SyncManager(statesManager);
