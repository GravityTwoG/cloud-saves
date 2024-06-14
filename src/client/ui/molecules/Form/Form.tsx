import React, { ReactNode, useState } from "react";
import { clsx } from "clsx";

import classes from "./form.module.scss";

import {
  Control,
  Controller,
  DefaultValues,
  Message,
  Path,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { Button } from "@/client/ui/atoms/Button";
import { Input } from "@/client/ui/atoms/Input";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";
import { AsyncEntitySelect } from "@/client/ui/atoms/Select/AsyncSelect/AsyncEntitySelect";
import { Field as FormField } from "../Field";

export type ComboboxOption = {
  label: string;
  value: string;
};

export type SimpleField = {
  type: "string" | "number" | "date" | "password";
  placeholder?: string;
  defaultValue?: string;
  label?: string;
  required?: boolean | string;
};

export type ComboBoxField = {
  type: "combobox";
  placeholder?: string;
  defaultValue?: ComboboxOption;
  label?: string;
  loadOptions: (inputValue: string) => Promise<ComboboxOption[]>;
  required?: boolean | string;
};

export type FormConfig = {
  [key: string]: SimpleField | ComboBoxField;
};

export type FormData<C = FormConfig> = {
  [key in keyof C]: C[key] extends ComboBoxField ? ComboboxOption : string;
};

export type FormProps<C = FormConfig> = {
  title?: string;
  config: C;
  defaultValues?: FormData<C>;
  onSubmit: (formData: FormData<C>) => Promise<Message | null>;
  submitText?: ReactNode;
  actions?: React.ReactNode;
  className?: string;
  submitButtonVariant?: "CTA" | "primary";
};

export function Form<C extends FormConfig>(props: FormProps<C>) {
  const [formData, setFormData] = useState<FormData<C>>(() =>
    props.defaultValues
      ? props.defaultValues
      : extractDefaultValues(props.config),
  );

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getFieldState,
    setError,
    control,
  } = useForm<FormData<C>>({
    defaultValues: formData as DefaultValues<FormData<C>>,
  });

  const onSubmit = handleSubmit(async (fields) => {
    try {
      setIsLoading(true);
      const error = await props.onSubmit(trimAllStrings(fields));

      if (error != null) {
        setError("root", { message: error });
        return;
      }

      setFormData(extractDefaultValues(props.config));
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  const root = getFieldState("root" as Path<FormData<C>>);

  return (
    <form onSubmit={onSubmit} className={clsx(classes.Form, props.className)}>
      {props.title && <h3>{props.title}</h3>}
      {Object.keys(props.config).map((field) => (
        <Field
          key={field}
          config={props.config}
          fieldName={field}
          register={register}
          control={control}
          error={
            (errors[field] !== undefined
              ? errors[field]!.message
              : undefined) as Message
          }
        />
      ))}
      {root.error && (
        <ErrorText className={classes.FormError}>
          {typeof root.error.message === "string" && root.error.message}
        </ErrorText>
      )}

      <div className={classes.FormActions}>
        <Button
          type="submit"
          className={classes.SubmitButton}
          isLoading={isLoading}
          variant={props.submitButtonVariant || "CTA"}
        >
          {props.submitText || "Submit"}
        </Button>
        {props.actions}
      </div>
    </form>
  );
}

function extractDefaultValues<C extends FormConfig>(config: C) {
  const fieldNames = Object.keys(config);

  return fieldNames.reduce((acc, field) => {
    if (config[field].type === "combobox") {
      return {
        ...acc,
        [field]: config[field].defaultValue || {
          label: "-",
          value: "",
        },
      };
    }

    return {
      ...acc,
      [field]: config[field].defaultValue || "",
    };
  }, {}) as FormData<C>;
}

type FieldProps<C extends FormConfig> = {
  config: C;
  fieldName: string;
  register: UseFormRegister<FormData<C>>;
  error: Message;
  control: Control<FormData<C>>;
};

function Field<C extends FormConfig>(props: FieldProps<C>) {
  const { config, fieldName } = props;

  const field = config[fieldName];

  if (field.type === "combobox") {
    return (
      <FormField
        label={field.label || ""}
        key={fieldName}
        className={classes.Field}
      >
        <Controller
          control={props.control}
          name={fieldName as Path<FormData<C>>}
          render={({ field: selectField }) => (
            <AsyncEntitySelect
              name={selectField.name}
              option={selectField.value as ComboboxOption}
              onBlur={selectField.onBlur}
              onChange={(value) => selectField.onChange(value)}
              loadOptions={field.loadOptions}
            />
          )}
        />
        <ErrorText className={classes.FieldError}>{props.error}</ErrorText>
      </FormField>
    );
  }

  if (!field.label) {
    return (
      <div key={fieldName} className={classes.Field}>
        <Input
          type={field.type}
          id={fieldName}
          // onChange={(e) => handleChange(e.target.value, fieldName)}
          placeholder={field.placeholder}
          {...props.register(fieldName as Path<FormData<C>>, {
            required: field.required,
          })}
        />
        <ErrorText className={classes.FieldError}>{props.error}</ErrorText>
      </div>
    );
  }

  return (
    <FormField label={field.label} className={classes.Field}>
      <Input
        type={field.type}
        id={fieldName}
        placeholder={field.placeholder}
        {...props.register(fieldName as Path<FormData<C>>, {
          required: field.required,
        })}
      />
      <ErrorText className={classes.FieldError}>{props.error}</ErrorText>
    </FormField>
  );
}

function trimAllStrings<D extends FormData>(config: D): D {
  return Object.keys(config).reduce((acc, field) => {
    if (typeof config[field] === "string") {
      return {
        ...acc,
        [field]: config[field].trim(),
      };
    }

    return {
      ...acc,
      [field]: config[field],
    };
  }, {}) as D;
}
