import { GameSaveAPI } from "./GameSaveAPI";
import { SavesManager } from "./SavesManager";
import { SyncManager } from "./SyncManager";

export const savesManager = new SavesManager();
export const syncManager = new SyncManager(new GameSaveAPI(savesManager));
