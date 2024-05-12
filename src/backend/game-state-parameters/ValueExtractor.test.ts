import { afterAll, beforeAll, describe, expect, test } from "vitest";
import mock from "mock-fs";
import { ValueExtractor } from "./ValueExtractor";
import { ColonTextConverter } from "./converters/ColonTextConverter";

test("isArrayIndex a.b.c", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("a.b.c");

  expect(result).toStrictEqual(false);
});

test("isArrayIndex [1]", () => {
  const extractor = new ValueExtractor({});

  for (let i = 0; i < 10; i++) {
    const result = extractor.isArrayIndex(`[${i}]`);
    expect(result).toStrictEqual(true);
  }
});

test("isArrayIndex [1.1]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("[1.1]");

  expect(result).toStrictEqual(false);
});

test("isArrayIndex []", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("[]");

  expect(result).toStrictEqual(false);
});

test("isArrayIndex [1", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("[1");

  expect(result).toStrictEqual(false);
});

test("isArrayIndex [*]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("[*]");

  expect(result).toStrictEqual(true);
});

test("isArrayIndex [**]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("[**]");

  expect(result).toStrictEqual(false);
});

test("isArrayIndex [*", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.isArrayIndex("[*");

  expect(result).toStrictEqual(false);
});

test("readByKey a", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a", { a: 4 });

  expect(result).toStrictEqual("4");
});

test("readByKey a.b", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a.b", { a: { b: 3 } });

  expect(result).toStrictEqual("3");
});

test("readByKey a.b.c", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a.b.c", { a: { b: { c: 12 } } });

  expect(result).toStrictEqual("12");
});

test("readByKey a.b.[0]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a.b.[0]", { a: { b: [1, 2, 3] } });

  expect(result).toStrictEqual("1");
});

test("readByKey a.b.[1]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a.b.[1]", { a: { b: [1, 2, 3] } });

  expect(result).toStrictEqual("2");
});

test("readByKey a.b.[999]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a.b.[999]", { a: { b: [1, 2, 3] } });

  expect(result).toStrictEqual(null);
});

test("readByKey a.b.[*]", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.readByKey("a.b.[*]", { a: { b: [1, 2, 3] } });

  expect(result).toStrictEqual(["1", "2", "3"]);
});

const typeStub = {
  id: "1",
  type: "time_seconds",
};
const commonParameterStub = {
  id: "1",
  type: typeStub,
  label: "Play time",
  description: "",
};

test("extractValues", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.extractValues(
    { Data: { metadata: { playTime: 4 } } },
    [
      {
        id: "1",
        key: "Data.metadata.playTime",
        type: typeStub,
        commonParameter: commonParameterStub,
        label: "Play time",
        description: "",
      },
    ],
  );

  expect(result).toStrictEqual([{ gameStateParameterId: "1", value: "4" }]);
});

test("extractValues array", () => {
  const extractor = new ValueExtractor({});

  const result = extractor.extractValues({ parameters: [{ playTime: 4 }] }, [
    {
      id: "2",
      key: "parameters.[0].playTime",
      type: typeStub,
      commonParameter: commonParameterStub,
      label: "Play time",
      description: "",
    },
  ]);

  expect(result).toStrictEqual([{ gameStateParameterId: "2", value: "4" }]);
});

describe("extract from file", () => {
  const folderPath = "/saves/Cyberpunk 2077/AutoSave-0";
  const jsonFilename = "metadata.9.json";
  const txtFilename = "metadata.9.txt";
  beforeAll(() => {
    mock({
      [folderPath]: {
        [jsonFilename]: `{ "Data": { "metadata": { "playTime": 4 } } }`,
        [txtFilename]: `Play_time:4`,
      },
    });
  });

  afterAll(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    mock.restore();
  });

  test("extract from json file", async () => {
    const extractor = new ValueExtractor({});

    const result = await extractor.extract(folderPath, {
      id: "1",
      description: "",
      extractionPipeline: [],
      gameStateParameters: {
        filename: jsonFilename,
        parameters: [
          {
            id: "1",
            key: "Data.metadata.playTime",
            type: typeStub,
            commonParameter: commonParameterStub,
            label: "Play time",
            description: "",
          },
        ],
      },
      imageURL: "",
      name: "Cyberpunk 2077",
      paths: [],
    });

    expect(result).toStrictEqual([{ gameStateParameterId: "1", value: "4" }]);
  });

  test("convert txt and extract from json file", async () => {
    const extractor = new ValueExtractor({
      "colon-text-to-json": new ColonTextConverter(),
    });

    const result = await extractor.extract(folderPath, {
      id: "1",
      description: "",
      extractionPipeline: [
        {
          type: "colon-text-to-json",
          inputFilename: txtFilename,
          outputFilename: "metadata.9.txt.json",
        },
      ],
      gameStateParameters: {
        filename: "metadata.9.txt.json",
        parameters: [
          {
            id: "1",
            key: "Play_time",
            type: typeStub,
            commonParameter: commonParameterStub,
            label: "Play time",
            description: "",
          },
        ],
      },
      imageURL: "",
      name: "Cyberpunk 2077",
      paths: [],
    });

    expect(result).toStrictEqual([{ gameStateParameterId: "1", value: "4" }]);
  });
});
