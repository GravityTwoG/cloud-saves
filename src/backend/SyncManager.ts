import { ipcMain } from "electron";

import { GameState, GameStateSync } from "@/types";
import { getModifiedAtMs } from "./fs/getModifiedAtMs";
import { StatesManager } from "./StatesManager";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const MIN_SYNC_PERIOD_MS = 1000 * 60;

export class SyncManager {
  private intervalId: NodeJS.Timeout | null = null;
  private statesManager: StatesManager;

  constructor(statesManager: StatesManager) {
    this.statesManager = statesManager;
  }

  init(onGetSyncedStates: () => void) {
    this.intervalId = setInterval(() => {
      onGetSyncedStates();
    }, MIN_SYNC_PERIOD_MS);

    let isSyncing = false;
    ipcMain.handle("sendSyncedStates", async (_, gameStates: GameState[]) => {
      if (isSyncing) {
        return;
      }

      isSyncing = true;
      await this.uploadSynced(gameStates);
      await this.downloadSynced(gameStates);
      isSyncing = false;
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    ipcMain.removeAllListeners("sendSyncedStates");
  }

  private async uploadSynced(gameStates: GameState[]) {
    for (const gameState of gameStates) {
      try {
        const lastUploadMs = new Date(gameState.uploadedAt).getTime();
        const currentTimeMs = new Date().getTime();
        const periodMs = this.getPeriodInMs(gameState.sync);

        console.log("lastUpload", lastUploadMs, "currentTime", currentTimeMs);

        if (currentTimeMs - lastUploadMs > periodMs && periodMs > 0) {
          console.log("Uploading state", gameState.localPath);
          await this.statesManager.reuploadState(gameState);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    }
  }

  private async downloadSynced(gameStates: GameState[]) {
    for (const gameState of gameStates) {
      const lastUploadMs = new Date(gameState.uploadedAt).getTime();
      const modifiedAtMs = await getModifiedAtMs(gameState.localPath);

      try {
        if (lastUploadMs > modifiedAtMs) {
          console.log("Downloading state", gameState.localPath);
          await this.statesManager.downloadState(gameState);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    }
  }

  private getPeriodInMs(sync: GameStateSync) {
    switch (sync) {
      case GameStateSync.NO:
        return -1;
      case GameStateSync.EVERY_HOUR:
        return HOUR;
      case GameStateSync.EVERY_DAY:
        return 24 * HOUR;
      case GameStateSync.EVERY_WEEK:
        return 24 * 7 * HOUR;
      case GameStateSync.EVERY_MONTH:
        return 24 * 30 * HOUR;
    }
  }
}
