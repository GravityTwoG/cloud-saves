import {
  GameStateParameters,
  GameStateParameterType,
  PipelineItemType,
} from "@/types";

export type GameFormData = {
  name: string;
  description: string;
  icon: FileList;
  paths: { path: string }[];
  extractionPipeline: {
    inputFilename: string;
    type: PipelineItemType;
    outputFilename: string;
  }[];
  gameStateParameters: GameStateParameters;
};

export const pipelineItemTypes: { name: string; value: PipelineItemType }[] = [
  { name: ".sav to .json", value: "sav-to-json" },
];

export const gameStateParameterTypes: {
  name: string;
  value: GameStateParameterType;
}[] = [
  { name: "string", value: "string" },
  { name: "number", value: "number" },
  { name: "seconds", value: "seconds" },
  { name: "boolean", value: "boolean" },
];
