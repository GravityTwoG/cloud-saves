import { Game } from "@/types";

import classes from "./game-form.module.scss";

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
        label="Game Name"
        type="text"
        placeholder="Enter game name"
        {...register("name", { required: "Game name is required" })}
      />
      {errors.name && <ErrorText>{errors.name.message}</ErrorText>}

      <InputField
        label="Game Description"
        type="text"
        placeholder="Enter game description"
        {...register("description")}
      />
      {errors.description && (
        <ErrorText>{errors.description.message}</ErrorText>
      )}

      <InputField
        label="Icon"
        type="file"
        placeholder="Upload image"
        {...register("icon")}
      />
      {iconPreview && (
        <img src={iconPreview} alt="Icon" className={classes.ImagePreview} />
      )}
      {errors.icon && <ErrorText>{errors.icon.message}</ErrorText>}

      <Field label="Save Paths">
        {pathFields.map((field, index) => (
          <div key={field.id} className={classes.PathItem}>
            <Input {...register(`paths.${index}.path`)} />
            <Button color="danger" onClick={() => removePath(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button onClick={() => appendPath({ path: "" })}>Add path</Button>
      </Field>
      {errors.paths && errors.paths.root && (
        <ErrorText>{errors.paths.root.message}</ErrorText>
      )}

      <Field label="Extraction Pipeline">
        {extractionPipelineFields.map((field, index) => (
          <div key={field.id} className={classes.PipelineItem}>
            <Input
              {...register(`extractionPipeline.${index}.inputFilename`)}
              placeholder="Input filename"
            />
            <Select
              {...register(`extractionPipeline.${index}.type`)}
              options={pipelineItemTypes}
            />
            <Input
              {...register(`extractionPipeline.${index}.outputFilename`)}
              placeholder="Output filename"
            />
            <Button
              color="danger"
              onClick={() => removeExtractionPipeline(index)}
            >
              Remove
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
          Add pipeline item
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
        label="Parameters Schema filename"
        {...register("gameStateParameters.filename")}
        placeholder="Parameters Schema filename"
      />
      {errors.gameStateParameters?.filename &&
        errors.gameStateParameters.filename && (
          <ErrorText>{errors.gameStateParameters.filename.message}</ErrorText>
        )}

      <Field label="Parameters Schema fields">
        {gameStateParameters.map((field, index) => (
          <div key={field.id} className={classes.SchemaField}>
            <Input
              {...register(`gameStateParameters.fields.${index}.key`)}
              placeholder="Key"
            />
            <Select
              {...register(`gameStateParameters.fields.${index}.type`)}
              options={gameStateParameterTypes}
            />
            <Input
              {...register(`gameStateParameters.fields.${index}.label`)}
              placeholder="Label"
            />
            <Input
              {...register(`gameStateParameters.fields.${index}.description`)}
              placeholder="Description"
            />
            <Button
              color="danger"
              onClick={() => removeGameStateParameter(index)}
            >
              Remove
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
          Add Schema field
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
        <CTAButton type="submit">Submit</CTAButton>
      </div>
    </form>
  );
};
