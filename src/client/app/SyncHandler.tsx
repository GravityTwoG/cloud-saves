import { useEffect } from "react";

import { GameState, UserRole } from "@/types";

import { useAPIContext } from "../contexts/APIContext";
import { AuthStatus, useAuthContext } from "../contexts/AuthContext";

export const SyncHandler = () => {
  const { osAPI, gameStateAPI } = useAPIContext();
  const { user, authStatus } = useAuthContext();

  useEffect(() => {
    osAPI.onGetSyncedSaves(async () => {
      if (authStatus !== AuthStatus.AUTHENTICATED) {
        return;
      }
      if (user.role !== UserRole.USER) {
        return;
      }

      const statesMap = gameStateAPI.getSyncSettings();
      const states: GameState[] = [];

      for (const gameStateId in statesMap) {
        try {
          const syncSettings = statesMap[gameStateId];
          if (syncSettings.username !== user.username) {
            continue;
          }

          const state = await gameStateAPI.getGameState(gameStateId);
          states.push({
            ...state,
            sync: syncSettings.sync,
          });
        } catch (error) {
          console.error(error);
        }
      }

      osAPI.sendSyncedSaves(states);
    });
  }, [osAPI, gameStateAPI, user, authStatus]);

  return null;
};
