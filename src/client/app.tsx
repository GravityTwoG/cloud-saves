import { createRoot } from "react-dom/client";

import "./ui/styles/theme.css";
import "./styles/utility.css";

import { api } from "./contexts/APIContext/APIContext";

import { ReactApplication } from "./ReactApplication";
import { initI18n } from "./locales";
import { GameState } from "@/types";

function bootstrap() {
  initI18n();

  window.electronAPI.onGetSyncedSaves(async () => {
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

    window.electronAPI.sendSyncedSaves(states);
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
