import { GameSave, GameSaveSync } from "@/types";
import { ipcMain } from "electron";
import { getModifiedAtMs } from "./fs/getModifiedAtMs";
import { GameSaveAPI } from "./GameSaveAPI";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const MIN_SYNC_PERIOD_MS = 1000 * 60;

export class SyncManager {
  private intervalId: NodeJS.Timeout | null = null;
  private gameSaveAPI: GameSaveAPI;

  constructor(gameSaveAPI: GameSaveAPI) {
    this.gameSaveAPI = gameSaveAPI;
  }

  init(onGetSyncedSaves: () => void) {
    this.intervalId = setInterval(() => {
      onGetSyncedSaves();
    }, MIN_SYNC_PERIOD_MS);

    let isSyncing = false;
    ipcMain.handle("sendSyncedSaves", async (_, gameSaves: GameSave[]) => {
      if (isSyncing) {
        return;
      }

      isSyncing = true;
      await this.uploadSynced(gameSaves);
      await this.downloadSynced(gameSaves);
      isSyncing = false;
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    ipcMain.removeAllListeners("sendSyncedSaves");
  }

  private async uploadSynced(gameSaves: GameSave[]) {
    for (const gameSave of gameSaves) {
      try {
        const lastUploadMs = new Date(gameSave.uploadedAt).getTime();
        const currentTimeMs = new Date().getTime();
        const periodMs = this.getPeriodInMs(gameSave.sync);

        console.log(
          "lastUpload",
          lastUploadMs,
          "currentTime",
          currentTimeMs,
          "period",
          periodMs
        );

        if (currentTimeMs - lastUploadMs > periodMs && periodMs > 0) {
          console.log("Uploading save", gameSave.path);

          await this.gameSaveAPI.uploadSave(gameSave);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private async downloadSynced(gameSaves: GameSave[]) {
    for (const gameSave of gameSaves) {
      const lastUploadMs = new Date(gameSave.uploadedAt).getTime();
      const modifiedAtMs = await getModifiedAtMs(gameSave.path);

      try {
        if (lastUploadMs > modifiedAtMs) {
          console.log("Downloading save", gameSave.path);
          await this.gameSaveAPI.downloadSave(gameSave);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private getPeriodInMs(sync: GameSaveSync) {
    switch (sync) {
      case GameSaveSync.NO:
        return -1;
      case GameSaveSync.EVERY_HOUR:
        return HOUR;
      case GameSaveSync.EVERY_DAY:
        return 24 * HOUR;
      case GameSaveSync.EVERY_WEEK:
        return 24 * 7 * HOUR;
      case GameSaveSync.EVERY_MONTH:
        return 24 * 30 * HOUR;
    }
  }
}
