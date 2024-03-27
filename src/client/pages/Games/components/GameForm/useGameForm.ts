import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Game } from "@/types";
import { useFilePreview } from "@/client/ui/hooks/useFilePreview";
import { AddGameDTO } from "@/client/api/interfaces/IGameAPI";

const pipelineItemTypes: { name: string; value: string }[] = [
  { name: "sav-to-json", value: "sav-to-json" },
];

type GameFormData = {
  name: string;
  description: string;
  icon: FileList;
  paths: { id: string; path: string }[];
  extractionPipeline: {
    id: string;
    inputFilename: string;
    type: string;
    outputFilename: string;
  }[];
  gameStateParameters: {
    filename: string;
    parameters: {
      id: string;
      key: string;
      type: { id: string; type: string };
      commonParameter: { label: string; id: string };
      label: string;
      description: string;
    }[];
  };
};

type UseGameFormArgs = {
  defaultValue?: Game;
};

export const useGameForm = (args: UseGameFormArgs) => {
  const { t } = useTranslation(undefined, { keyPrefix: "forms.gameForm" });
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
      paths: args.defaultValue?.paths || [],
      extractionPipeline: args.defaultValue?.extractionPipeline || [],
      gameStateParameters: args.defaultValue?.gameStateParameters || {
        parameters: [],
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
        message: t("paths-are-required"),
      },
      minLength: {
        value: 1,
        message: t("at-least-one-path-is-required"),
      },
      validate: {
        noDuplicates: (paths) => {
          const uniquePaths = new Set(paths);
          return uniquePaths.size === paths.length || t("paths-must-be-unique");
        },
        notEmptyValue: (paths) => {
          return (
            paths.every((path) => path.path.length > 0) ||
            t("path-must-not-be-empty")
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
              t("field-must-not-be-empty")
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
    name: "gameStateParameters.parameters",
    rules: {
      validate: {
        notEmptyValues: (fields) => {
          return (
            fields.every(
              (field) =>
                field.key.length > 0 &&
                field.type.id.length > 0 &&
                field.label.length > 0
            ) || t("field-must-not-be-empty")
          );
        },
      },
    },
  });

  useEffect(() => {
    if (args.defaultValue) return;

    appendPath({ id: "", path: "" });
    appendExtractionPipeline({
      id: "",
      inputFilename: "",
      type: "sav-to-json",
      outputFilename: "",
    });
    appendGameStateParameter({
      id: "",
      key: "",
      type: {
        id: "",
        type: "",
      },
      commonParameter: { label: "-", id: "" },
      description: "",
      label: "",
    });
  }, []);

  return {
    register,
    handleSubmit: (cb: (data: AddGameDTO) => void) =>
      handleSubmit((fields) =>
        cb({
          ...fields,
          icon: fields.icon ? fields.icon[0] : undefined,
          paths: fields.paths.map((path) => ({
            ...path,
            path: path.path.replaceAll(/\//g, "\\"),
          })),
        })
      ),
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
    control,
  };
};
