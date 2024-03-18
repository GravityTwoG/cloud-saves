import { createRoot } from "react-dom/client";

import "./ui/styles/theme.css";
import "./styles/utility.css";

import { SyncedSavesAPI } from "./api/SyncedSavesAPI";

import { ReactApplication } from "./ReactApplication";
import { initI18n } from "./locales";

function bootstrap() {
  initI18n();

  const syncedSavesAPI = new SyncedSavesAPI();

  window.electronAPI.onGetSyncedSaves(async () => {
    const saves = await syncedSavesAPI.getSyncedSaves();
    window.electronAPI.sendSyncedSaves(saves);
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
