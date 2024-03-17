import { useTranslation } from "react-i18next";

import classes from "./game-form.module.scss";

import { Game } from "@/types";
import { GameFormData } from "../utils";
import { useGameForm } from "./useGameForm";

import { CTAButton } from "@/client/ui/atoms/Button/CTAButton";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";
import { Button } from "@/client/ui/atoms/Button/Button";
import { Input } from "@/client/ui/atoms/Input/Input";
import { Select } from "@/client/ui/atoms/Select/Select";
import { Field, InputField } from "@/client/ui/molecules/Field";

export type GameFormProps = {
  game?: Game;
  onSubmit: (data: GameFormData) => void;
};

export const GameForm = (props: GameFormProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "forms.gameForm" });
  const {
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
  } = useGameForm({ defaultValue: props.game });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <InputField
        label={t("game-name")}
        type="text"
        placeholder={t("enter-game-name")}
        {...register("name", { required: t("game-name-is-required") })}
      />
      {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

      <InputField
        label={t("game-description")}
        type="text"
        placeholder={t("enter-game-description")}
        {...register("description")}
      />
      {errors.description && (
        <ErrorText>{errors.description.message}</ErrorText>
      )}

      <InputField
        label={t("game-icon")}
        type="file"
        placeholder={t("upload-image")}
        {...register("icon")}
      />
      {iconPreview && (
        <img
          src={iconPreview}
          alt={t("game-icon")}
          className={classes.ImagePreview}
        />
      )}
      {errors.icon && <ErrorText>{errors.icon.message}</ErrorText>}

      <Field label={t("save-paths")}>
        {pathFields.map((field, index) => (
          <div key={field.id} className={classes.PathItem}>
            <Input {...register(`paths.${index}.path`)} />
            <Button color="danger" onClick={() => removePath(index)}>
              {t("remove-path")}{" "}
            </Button>
          </div>
        ))}
        <Button onClick={() => appendPath({ path: "" })}>
          {t("add-path")}
        </Button>
      </Field>
      {errors.paths && errors.paths.root && (
        <ErrorText>{errors.paths.root.message}</ErrorText>
      )}

      <Field label={t("extraction-pipeline")}>
        {extractionPipelineFields.map((field, index) => (
          <div key={field.id} className={classes.PipelineItem}>
            <Input
              {...register(`extractionPipeline.${index}.inputFilename`)}
              placeholder={t("input-filename")}
            />
            <Select
              {...register(`extractionPipeline.${index}.type`)}
              options={pipelineItemTypes}
            />
            <Input
              {...register(`extractionPipeline.${index}.outputFilename`)}
              placeholder={t("output-filename")}
            />
            <Button
              color="danger"
              onClick={() => removeExtractionPipeline(index)}
            >
              {t("remove-extraction-pipeline")}
            </Button>
          </div>
        ))}
        <Button
          onClick={() =>
            appendExtractionPipeline({
              inputFilename: "",
              type: "sav-to-json",
              outputFilename: "",
            })
          }
        >
          {t("add-pipeline-item")}{" "}
        </Button>
      </Field>
      {errors.extractionPipeline && errors.extractionPipeline.root && (
        <ErrorText>{errors.extractionPipeline.root.message}</ErrorText>
      )}
      {errors.extractionPipeline?.map
        ? errors.extractionPipeline.map((error, idx) => (
            <ErrorText key={idx}>{error?.message}</ErrorText>
          ))
        : null}

      <InputField
        label={t("parameters-schema-filename")}
        {...register("gameStateParameters.filename")}
        placeholder={t("parameters-schema-filename-0")}
      />
      {errors.gameStateParameters?.filename &&
        errors.gameStateParameters.filename && (
          <ErrorText>{errors.gameStateParameters.filename.message}</ErrorText>
        )}

      <Field label={t("parameters-schema-fields")}>
        {gameStateParameters.map((field, index) => (
          <div key={field.id} className={classes.SchemaField}>
            <Input
              {...register(`gameStateParameters.fields.${index}.key`)}
              placeholder={t("parameter-key")}
            />
            <Select
              {...register(`gameStateParameters.fields.${index}.type`)}
              options={gameStateParameterTypes}
            />
            <Input
              {...register(`gameStateParameters.fields.${index}.label`)}
              placehparameter-label={t("parameter-label")}
            />
            <Input
              {...register(`gameStateParameters.fields.${index}.description`)}
              parameter-descriptionlder={t("parameter-description")}
            />
            <Button
              color="danger"
              onClick={() => removeGameStateParameter(index)}
              remove-parameter
            >
              {t("remove-parameter")}
            </Button>
          </div>
        ))}
        <Button
          onClick={() =>
            appendGameStateParameter({
              key: "",
              type: "string",
              label: "",
              description: "",
            })
          }
        >
          {t("add-schema-field")}{" "}
        </Button>
      </Field>
      {errors.gameStateParameters && errors.gameStateParameters.root && (
        <ErrorText>{errors.gameStateParameters.root.message}</ErrorText>
      )}

      {errors.gameStateParameters?.fields?.map
        ? errors.gameStateParameters.fields.map((error, idx) => (
            <ErrorText key={idx}>{error?.message}</ErrorText>
          ))
        : null}

      <div className={classes.AddGameButtons}>
        <CTAButton type="submit">{t("add-game-submit")}</CTAButton>
      </div>
    </form>
  );
};
