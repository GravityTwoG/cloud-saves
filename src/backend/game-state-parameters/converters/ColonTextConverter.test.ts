import { afterAll, beforeAll, describe, expect, test } from "vitest";
import mock from "mock-fs";
import fs from "fs/promises";
import path from "path";

import { ColonTextConverter } from "./ColonTextConverter";

describe("convert colon text to json", () => {
  const folderPath = "/saves/Cyberpunk 2077/AutoSave-0";
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
    await converter.convert(folderPath, txtFilename, "metadata.9.txt.json");

    const json = await fs.readFile(
      path.join(folderPath, "metadata.9.txt.json"),
      {
        encoding: "utf-8",
      },
    );
    expect(json).toStrictEqual(
      `{"Play_time":"4","Version":"1","Gender":"Male"}`,
    );
  });
});
