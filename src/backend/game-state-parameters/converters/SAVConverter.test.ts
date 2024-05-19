import { afterAll, describe, expect, test } from "vitest";
import fs from "fs/promises";
import path from "path";

import { SAVConverter } from "./SAVConverter";

// We cannot use mock-fs here because we spawning new process of uesave.exe application and
// mock-fs mocks only file system of the current Node.js process.
describe("convert .sav to json", () => {
  const folderPath = path.join(__dirname, "./testdata");
  const savFilename = "SaveSlot.sav";
  const actualJSONFilename = "testSaveSlot.sav.json";
  const expectedJSONFilename = "SaveSlot.sav.json";

  afterAll(async () => {
    await fs.unlink(path.join(folderPath, actualJSONFilename));
  });

  test("convert .sav to json", async () => {
    const converter = new SAVConverter();
    await converter.convert(folderPath, savFilename, actualJSONFilename);

    const actualJSON = await fs.readFile(
      path.join(folderPath, actualJSONFilename),
      {
        encoding: "utf-8",
      },
    );
    const expectedJSON = await fs.readFile(
      path.join(folderPath, expectedJSONFilename),
      { encoding: "utf-8" },
    );
    expect(JSON.parse(actualJSON)).toStrictEqual(JSON.parse(expectedJSON));
  });
});
