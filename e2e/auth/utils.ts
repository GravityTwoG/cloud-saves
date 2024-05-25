import { ElectronApplication, _electron as electron } from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

export const launchApp = async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild();
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = "e2e";
  const electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
  electronApp?.on("window", async (page) => {
    const filename = page.url()?.split("/").pop();
    console.log(`Window opened: ${filename}`);

    // capture errors
    page.on("pageerror", (error) => {
      console.error(error);
    });
    // capture console messages
    page.on("console", (msg) => {
      console.log(msg.text());
    });
  });
  await electronApp?.waitForEvent("window");

  return electronApp;
};

export const resetApp = async (electronApp: ElectronApplication) => {
  await electronApp.evaluate(async (e) => {
    await e.session.defaultSession.clearStorageData();
  });
  await electronApp.close();
};
