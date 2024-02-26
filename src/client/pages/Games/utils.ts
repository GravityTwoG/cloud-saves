import { MetadataSchema, MetadataType, PipelineItemType } from "@/types";

export type GameFormData = {
  name: string;
  icon: FileList;
  paths: { path: string }[];
  extractionPipeline: {
    inputFilename: string;
    type: PipelineItemType;
    outputFilename: string;
  }[];
  metadataSchema: MetadataSchema;
};

export const pipelineItemTypes: { name: string; value: PipelineItemType }[] = [
  { name: ".sav to .json", value: "sav-to-json" },
];

export const metadataSchemaFieldTypes: { name: string; value: MetadataType }[] =
  [
    { name: "string", value: "string" },
    { name: "number", value: "number" },
    { name: "seconds", value: "seconds" },
    { name: "boolean", value: "boolean" },
  ];
