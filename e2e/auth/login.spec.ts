import { test, ElectronApplication, Page, expect } from "@playwright/test";

import { existingUser } from "@/client/api/mocks/AuthAPIMock";
import { launchApp, resetApp } from "./utils";

let electronApp: ElectronApplication;

test.beforeEach(async () => {
  electronApp = await launchApp();
});

test.afterEach(async () => {
  await resetApp(electronApp);
});

let page: Page;

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
