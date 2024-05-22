import { test, ElectronApplication, Page, expect } from "@playwright/test";

import { existingUser } from "@/client/api/mocks/AuthAPIMock";
import { launchApp, resetApp } from "./utils";

const newUser = {
  username: "newUser",
  email: "newUser@example.com",
  password: "12121212",
};

let electronApp: ElectronApplication;

test.beforeEach(async () => {
  electronApp = await launchApp();
});

test.afterEach(async () => {
  await resetApp(electronApp);
});

let page: Page;

test("register", async () => {
  page = await electronApp.firstWindow();

  await page.click("a[href='/register']");

  await page.waitForSelector("input[name=username]");
  await page.waitForSelector("input[name=email]");
  await page.waitForSelector("input[name=password]");
  await page.waitForSelector("input[name=confirmPassword]");
  await page.waitForSelector("button[type=submit]");

  const usernameInput = await page.$("input[name=username]");
  expect(usernameInput).toBeDefined();
  const emailInput = await page.$("input[name=email]");
  expect(emailInput).toBeDefined();
  const passwordInput = await page.$("input[name=password]");
  expect(passwordInput).toBeDefined();
  const confirmPasswordInput = await page.$("input[name=confirmPassword]");
  expect(confirmPasswordInput).toBeDefined();
  const registerButton = await page.$("button[type=submit]");
  expect(registerButton).toBeDefined();

  await usernameInput!.fill(newUser.username);
  await emailInput!.fill(newUser.email);
  await passwordInput!.fill(newUser.password);
  await confirmPasswordInput!.fill(newUser.password);
  await registerButton!.click();

  await expect(page).toHaveURL(/\/my-saves/);
});

test("register existing user", async () => {
  page = await electronApp.firstWindow();

  await page.click("a[href='/register']");

  await page.waitForSelector("input[name=username]");
  await page.waitForSelector("input[name=email]");
  await page.waitForSelector("input[name=password]");
  await page.waitForSelector("input[name=confirmPassword]");
  await page.waitForSelector("button[type=submit]");

  const usernameInput = await page.$("input[name=username]");
  expect(usernameInput).toBeDefined();
  const emailInput = await page.$("input[name=email]");
  expect(emailInput).toBeDefined();
  const passwordInput = await page.$("input[name=password]");
  expect(passwordInput).toBeDefined();
  const confirmPasswordInput = await page.$("input[name=confirmPassword]");
  expect(confirmPasswordInput).toBeDefined();
  const registerButton = await page.$("button[type=submit]");
  expect(registerButton).toBeDefined();

  await usernameInput!.fill(existingUser.username);
  await emailInput!.fill(existingUser.email);
  await passwordInput!.fill(existingUser.password);
  await confirmPasswordInput!.fill(existingUser.password);
  await registerButton!.click();

  await page.waitForTimeout(1000);

  expect(await page.content()).toContain("User already exists");
});
