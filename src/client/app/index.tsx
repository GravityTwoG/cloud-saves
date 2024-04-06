import { createRoot } from "react-dom/client";

import "@/client/ui/styles/theme.css";
import "./styles/utility.css";

import { api } from "@/client/contexts/APIContext/APIContext";

import { initI18n } from "@/client/locales";
import { GameState } from "@/types";
import { ReactApplication } from "./ReactApplication";

function bootstrap() {
  initI18n();

  api.osAPI.onGetSyncedSaves(async () => {
    const statesMap = await api.gameStateAPI.getSyncSettings();
    const states: GameState[] = [];

    for (const gameStateId in statesMap) {
      try {
        const syncSettings = statesMap[gameStateId];
        const state = await api.gameStateAPI.getGameState(gameStateId);
        states.push({
          ...state,
          sync: syncSettings.sync,
        });
      } catch (error) {
        console.error(error);
      }
    }

    api.osAPI.sendSyncedSaves(states);
  });

  const rootElement = document.getElementById("app");

  if (!rootElement) {
    alert("Failed to find the root element");
    return;
  }

  const root = createRoot(rootElement);

  root.render(<ReactApplication />);
}

bootstrap();
