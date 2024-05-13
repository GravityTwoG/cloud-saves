import {
  test,
  _electron as electron,
  ElectronApplication,
  Page,
  expect,
} from "@playwright/test";
import { findLatestBuild, parseElectronApp } from "electron-playwright-helpers";

const existingUser = {
  username: "Username",
  password: "12121212",
};

let electronApp: ElectronApplication;

test.beforeEach(async () => {
  // find the latest build in the out directory
  const latestBuild = findLatestBuild();
  // parse the directory and find paths and other info
  const appInfo = parseElectronApp(latestBuild);
  // set the CI environment variable to true
  process.env.CI = "e2e";
  electronApp = await electron.launch({
    args: [appInfo.main],
    executablePath: appInfo.executable,
  });
  electronApp.on("window", async (page) => {
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
  await electronApp.waitForEvent("window");
});

test.afterEach(async () => {
  await electronApp.evaluate(async (e) => {
    await e.session.defaultSession.clearStorageData();
  });
  await electronApp.close();
});

let page: Page;

test("renders the login page", async () => {
  page = await electronApp.firstWindow();

  await page.waitForSelector("#username");
  await page.waitForSelector("#password");
  await page.waitForSelector("button[type=submit]");

  const usernameInput = await page.$("#username");
  expect(usernameInput).toBeDefined();
  const passwordInput = await page.$("#password");
  expect(passwordInput).toBeDefined();
  const loginButton = await page.$("button[type=submit]");
  expect(loginButton).toBeDefined();
});

test("login with button", async () => {
  page = await electronApp.firstWindow();

  await page.waitForSelector("#username");
  await page.waitForSelector("#password");
  await page.waitForSelector("button[type=submit]");

  const usernameInput = await page.$("#username");
  const passwordInput = await page.$("#password");
  const loginButton = await page.$("button[type=submit]");

  await usernameInput!.fill(existingUser.username);
  await passwordInput!.fill(existingUser.password);
  await loginButton!.click();

  await expect(page).toHaveURL(/\/my-saves/);
});

test("login with enter", async () => {
  page = await electronApp.firstWindow();

  await page.waitForSelector("#username");
  await page.waitForSelector("#password");

  const usernameInput = await page.$("#username");
  const passwordInput = await page.$("#password");

  await usernameInput!.fill(existingUser.username);
  await passwordInput!.fill(existingUser.password);
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/my-saves/);
});
