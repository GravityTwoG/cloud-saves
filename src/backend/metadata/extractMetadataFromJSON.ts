import { JSONType, Metadata, MetadataSchema } from "@/types";

export function extractMetadataFromJSON(
  input: JSONType,
  schema: MetadataSchema
): Metadata {
  const metadata: Metadata = { fields: [] };

  for (const field of schema.fields) {
    const value = readByKey(field.key, input);

    if (!isObject(value) && !Array.isArray(value) && value !== null) {
      metadata.fields.push({
        value: value,
        type: field.type,
        description: field.description,
        label: field.label,
      });
    }
  }

  return metadata;
}

function isObject(value: unknown): value is JSONType {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

function readByKey(
  key: string,
  input: JSONType
): string | number | boolean | null | JSONType | JSONType[] {
  const keys = key.split(".");

  const res = keys.reduce((object, cur) => {
    if (object !== null && isObject(object)) {
      return object[cur];
    }
    return null;
  }, input as string | number | boolean | null | JSONType | JSONType[]);

  return res;
}
