import { createRoot } from "react-dom/client";

import "./ui/styles/theme.css";
import "./styles/utility.css";

import { SyncedStatesAPI } from "./api/SyncedSavesAPI";

import { ReactApplication } from "./ReactApplication";
import { initI18n } from "./locales";

function bootstrap() {
  initI18n();

  const syncedStatesAPI = new SyncedStatesAPI();

  window.electronAPI.onGetSyncedSaves(async () => {
    const states = await syncedStatesAPI.getSyncedStates();
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
