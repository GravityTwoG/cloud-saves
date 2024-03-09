import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Game } from "@/types";
import { useFilePreview } from "@/client/lib/hooks/useFilePreview";
import {
  GameFormData,
  gameStateParameterTypes,
  pipelineItemTypes,
} from "../utils";

type UseGameFormArgs = {
  defaultValue?: Game;
};

export const useGameForm = (args: UseGameFormArgs) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<GameFormData>({
    defaultValues: {
      name: args.defaultValue?.name,
      description: args.defaultValue?.description,
      paths: args.defaultValue?.paths.map((path) => ({ path })) || [],
      extractionPipeline: args.defaultValue?.extractionPipeline || [],
      gameStateParameters: args.defaultValue?.gameStateParameters || {
        fields: [],
      },
    },
  });

  const [icon] = watch(["icon"]);
  const [iconPreview] = useFilePreview(icon);

  const {
    fields: pathFields,
    append: appendPath,
    remove: removePath,
  } = useFieldArray({
    control,
    name: "paths",
    rules: {
      required: {
        value: true,
        message: "Paths are required",
      },
      minLength: {
        value: 1,
        message: "At least one path is required",
      },
      validate: {
        noDuplicates: (paths) => {
          const uniquePaths = new Set(paths);
          return uniquePaths.size === paths.length || "Paths must be unique";
        },
        notEmptyValue: (paths) => {
          return (
            paths.every((path) => path.path.length > 0) ||
            "Path must not be empty"
          );
        },
      },
    },
  });

  const {
    fields: extractionPipelineFields,
    append: appendExtractionPipeline,
    remove: removeExtractionPipeline,
  } = useFieldArray({
    control,
    name: "extractionPipeline",
    rules: {
      validate: {
        notEmptyValues: (fields) => {
          return fields.every(
            (field) =>
              (field.inputFilename && field.outputFilename && field.type) ||
              "Field must not be empty"
          );
        },
      },
    },
  });

  const {
    fields: gameStateParameters,
    append: appendGameStateParameter,
    remove: removeGameStateParameter,
  } = useFieldArray({
    control,
    name: "gameStateParameters.fields",
    rules: {
      required: {
        value: true,
        message: "Parameters schema is required",
      },
      validate: {
        notEmptyValues: (fields) => {
          return (
            fields.every(
              (field) =>
                field.key.length > 0 &&
                field.type.length > 0 &&
                field.label.length > 0
            ) || "Field must not be empty"
          );
        },
      },
    },
  });

  useEffect(() => {
    if (args.defaultValue) return;

    appendPath({ path: "" });
    appendExtractionPipeline({
      inputFilename: "",
      type: "sav-to-json",
      outputFilename: "",
    });
    appendGameStateParameter({
      key: "",
      type: "string",
      description: "",
      label: "",
    });
  }, []);

  return {
    register,
    handleSubmit,
    errors,
    iconPreview,
    pathFields,
    appendPath,
    removePath,
    extractionPipelineFields,
    appendExtractionPipeline,
    removeExtractionPipeline,
    pipelineItemTypes,
    gameStateParameters,
    appendGameStateParameter,
    removeGameStateParameter,
    gameStateParameterTypes,
  };
};
