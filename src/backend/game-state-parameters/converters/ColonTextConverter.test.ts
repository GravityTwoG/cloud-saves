import { afterAll, beforeAll, describe, expect, test } from "vitest";
import mock from "mock-fs";
import fs from "fs/promises";
import path from "path";

import { ColonTextConverter } from "./ColonTextConverter";

describe("convert colon text to json", () => {
  const folderPath = "C:/saves/Cyberpunk 2077/AutoSave-0";
  const txtFilename = "metadata.9.txt";
  beforeAll(() => {
    mock({
      [folderPath]: {
        [txtFilename]: `Play_time:4\nVersion:1\nGender:Male`,
      },
    });
  });

  afterAll(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    mock.restore();
  });

  test("convert colon text to json", async () => {
    const converter = new ColonTextConverter();
    const jsonFilename = "metadata.9.txt.json";
    await converter.convert(folderPath, txtFilename, jsonFilename);

    const actualJSON = await fs.readFile(path.join(folderPath, jsonFilename), {
      encoding: "utf-8",
    });
    expect(JSON.parse(actualJSON)).toStrictEqual(
      JSON.parse(`{
        "Play_time":"4",
        "Version":"1",
        "Gender":"Male"
      }`),
    );
  });
});
