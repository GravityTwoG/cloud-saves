import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import classes from "./game-form.module.scss";

import { Game } from "@/types";
import { AddGameDTO } from "@/client/api/interfaces/IGameAPI";
import { useAPIContext } from "@/client/contexts/APIContext";
import { useGameForm } from "./useGameForm";

import { Controller } from "react-hook-form";
import { Button } from "@/client/ui/atoms/Button";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";
import { Input } from "@/client/ui/atoms/Input";
import { Paper } from "@/client/ui/atoms/Paper";
import { Select } from "@/client/ui/atoms/Select/Select";
import { Paragraph } from "@/client/ui/atoms/Typography";
import { AsyncEntitySelect } from "@/client/ui/atoms/Select/AsyncSelect/AsyncEntitySelect";
import { ImageInputField, InputField } from "@/client/ui/molecules/Field";

export type GameFormProps = {
  game?: Game;
  onSubmit: (data: AddGameDTO) => void;
};

export const GameForm = (props: GameFormProps) => {
  const { commonParametersAPI, parameterTypesAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "components.GameForm" });
  const {
    register,
    handleSubmit,
    errors,
    imagePreview,
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
  } = useGameForm({ defaultValue: props.game });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <Paper>
        <InputField
          label={t("game-name")}
          type="text"
          placeholder={t("enter-game-name")}
          autoFocus
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

        <Controller
          name={`image`}
          control={control}
          render={({ field: imageField }) => (
            <ImageInputField
              label={t("game-image")}
              placeholder={t("upload-image")}
              onFileChange={(image) => imageField.onChange(image)}
              src={imagePreview || props.game?.imageURL || undefined}
            />
          )}
        />
        {errors.image && <ErrorText>{errors.image.message}</ErrorText>}
      </Paper>

      <Paper className="my-4">
        <Paragraph className={classes.Label}>{t("save-paths")}</Paragraph>
        {pathFields.map((field, index) => (
          <div key={field.id} className={clsx(classes.PathItem, "mb-2")}>
            <Input {...register(`paths.${index}.path`)} />
            <Button
              color="danger"
              onClick={() => removePath(index)}
              className="ml-1"
            >
              {t("remove-path")}
            </Button>
          </div>
        ))}
        <div className={classes.AddGameButtons}>
          <Button onClick={() => appendPath({ id: "", path: "" })}>
            {t("add-path")}
          </Button>
        </div>
        {errors.paths && errors.paths.root && (
          <ErrorText>{errors.paths.root.message}</ErrorText>
        )}
      </Paper>

      <Paper className="my-4">
        <Paragraph className={classes.Label}>
          {t("extraction-pipeline")}
        </Paragraph>
        {extractionPipelineFields.map((field, index) => (
          <div key={field.id} className={clsx(classes.PipelineItem, "mb-2")}>
            <Input
              {...register(`extractionPipeline.${index}.inputFilename`)}
              placeholder={t("input-filename")}
            />
            <Select
              {...register(`extractionPipeline.${index}.type`)}
              options={pipelineItemTypes}
              className="ml-1"
            />
            <Input
              {...register(`extractionPipeline.${index}.outputFilename`)}
              placeholder={t("output-filename")}
              className="ml-1"
            />
            <Button
              color="danger"
              onClick={() => removeExtractionPipeline(index)}
              className="ml-1"
            >
              {t("remove-extraction-pipeline")}
            </Button>
          </div>
        ))}
        <div className={classes.AddGameButtons}>
          <Button
            onClick={() =>
              appendExtractionPipeline({
                id: "",
                inputFilename: "",
                type: "sav-to-json",
                outputFilename: "",
              })
            }
          >
            {t("add-pipeline-item")}
          </Button>
        </div>
        {errors.extractionPipeline && errors.extractionPipeline.root && (
          <ErrorText>{errors.extractionPipeline.root.message}</ErrorText>
        )}
        {errors.extractionPipeline?.map
          ? errors.extractionPipeline.map((error, idx) => (
              <ErrorText key={idx}>{error?.message}</ErrorText>
            ))
          : null}
      </Paper>

      <Paper className="my-4">
        <InputField
          label={t("parameters-schema-filename")}
          {...register("gameStateParameters.filename")}
          placeholder={t("parameters-schema-filename-0")}
        />
        {errors.gameStateParameters?.filename &&
          errors.gameStateParameters.filename && (
            <ErrorText>{errors.gameStateParameters.filename.message}</ErrorText>
          )}
      </Paper>

      <Paper>
        <Paragraph className={classes.Label}>
          {t("parameters-schema-fields")}
        </Paragraph>
        {gameStateParameters.map((field, index) => (
          <div key={field.id} className={clsx(classes.SchemaField, "mt-4")}>
            <Input
              {...register(`gameStateParameters.parameters.${index}.key`)}
              placeholder={t("parameter-key")}
            />
            <Controller
              name={`gameStateParameters.parameters.${index}.type`}
              control={control}
              render={({ field: selectField }) => (
                <AsyncEntitySelect
                  option={{
                    label: selectField.value.type,
                    value: selectField.value.id,
                  }}
                  onChange={(value) =>
                    selectField.onChange({
                      type: value.label,
                      id: value.value,
                    })
                  }
                  name={selectField.name}
                  placeholder={t("parameter-type")}
                  loadOptions={async (input) => {
                    const types = await parameterTypesAPI.getTypes({
                      searchQuery: input,
                      pageNumber: 1,
                      pageSize: 25,
                    });
                    return types.items.map((type) => ({
                      value: type.id.toString(),
                      label: type.type,
                    }));
                  }}
                />
              )}
            />
            <Controller
              name={`gameStateParameters.parameters.${index}.commonParameter`}
              control={control}
              render={({ field: selectField }) => (
                <AsyncEntitySelect
                  onChange={(value) => {
                    selectField.onChange({
                      label: value.label,
                      id: value.value,
                    });
                  }}
                  onBlur={() => selectField.onBlur()}
                  option={{
                    label: selectField.value.label,
                    value: selectField.value.id,
                  }}
                  name={selectField.name}
                  placeholder={t("common-parameter")}
                  loadOptions={async (query) => {
                    const parameters = await commonParametersAPI.getParameters({
                      searchQuery: query,
                      pageNumber: 1,
                      pageSize: 25,
                    });
                    return parameters.items.map((parameter) => ({
                      value: parameter.id.toString(),
                      label: parameter.label,
                    }));
                  }}
                />
              )}
            />
            <Input
              {...register(`gameStateParameters.parameters.${index}.label`)}
              placeholder={t("parameter-label")}
            />
            <Input
              {...register(
                `gameStateParameters.parameters.${index}.description`,
              )}
              placeholder={t("parameter-description")}
            />
            <Button
              color="danger"
              onClick={() => removeGameStateParameter(index)}
            >
              {t("remove-parameter")}
            </Button>
          </div>
        ))}
        <div className={clsx(classes.AddGameButtons, "mt-2")}>
          <Button
            onClick={() =>
              appendGameStateParameter({
                id: "",
                key: "",
                type: {
                  id: "",
                  type: "",
                },
                commonParameter: { label: "-", id: "" },
                label: "",
                description: "",
              })
            }
          >
            {t("add-schema-field")}
          </Button>
        </div>
        {errors.gameStateParameters && errors.gameStateParameters.root && (
          <ErrorText>{errors.gameStateParameters.root.message}</ErrorText>
        )}

        {errors.gameStateParameters?.parameters?.map
          ? errors.gameStateParameters.parameters.map((error, idx) => (
              <ErrorText key={idx}>{error?.message}</ErrorText>
            ))
          : null}
      </Paper>

      <div className={clsx(classes.AddGameButtons, "mt-4")}>
        <Button variant="CTA" type="submit">
          {t("add-game-submit")}
        </Button>
      </div>
    </form>
  );
};
