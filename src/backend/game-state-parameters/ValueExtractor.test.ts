import { expect, test } from "vitest";
import { ValueExtractor } from "./ValueExtractor";

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
