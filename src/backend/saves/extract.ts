import { JSONType, Metadata, MetadataSchema } from "@/types";

export const readByKey = (
  key: string,
  input: JSONType
): string | number | boolean | null | JSONType | JSONType[] => {
  const keys = key.split(".");

  const res = keys.reduce((object, cur) => {
    if (object !== null && isObject(object)) {
      return object[cur];
    }
    return null;
  }, input as string | number | boolean | null | JSONType | JSONType[]);

  return res;
};

export const extractMetadataFromJSON = (
  input: JSONType,
  schema: MetadataSchema
): Metadata => {
  const metadata: Metadata = { fields: [] };

  for (const field of schema.fields) {
    const value = readByKey(field.key, input);

    if (isObject(value)) {
      continue;
    }
    const v = value as string | number | boolean | null;

    if (v !== null) {
      metadata.fields.push({
        value: v,
        type: field.type,
        description: field.description,
        label: field.label,
      });
    }
  }

  return metadata;
};

export function isObject(value: unknown): value is JSONType {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
