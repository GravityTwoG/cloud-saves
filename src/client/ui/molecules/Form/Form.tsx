import React, { useState } from "react";
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
import { CTAButton } from "@/client/ui/atoms/Button/CTAButton";
import { Button } from "../../atoms/Button/Button";
import { Input } from "@/client/ui/atoms/Input/Input";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";
import { AsyncEntitySelect } from "@/client/ui/atoms/Select/AsyncSelect/AsyncEntitySelect";

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
  submitText?: string;
  actions?: React.ReactNode;
  className?: string;
  submitButtonType?: "CTA" | "common";
};

export function Form<C extends FormConfig>(props: FormProps<C>) {
  const [formData, setFormData] = useState<FormData<C>>(() =>
    props.defaultValues
      ? props.defaultValues
      : extractDefaultValues(props.config)
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
      const error = await props.onSubmit(fields);

      if (error != null) {
        setError("root", { message: error });
        return;
      }

      setFormData(extractDefaultValues(props.config));
      reset();
    } catch (error) {
      console.error(error);
      alert(error);
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

      {root.error && <ErrorText>{root.error.message}</ErrorText>}

      <div className={classes.FormActions}>
        {props.submitButtonType === "common" ? (
          <Button
            type="submit"
            className={classes.SubmitButton}
            isLoading={isLoading}
          >
            {props.submitText || "Submit"}
          </Button>
        ) : (
          <CTAButton
            type="submit"
            className={classes.SubmitButton}
            isLoading={isLoading}
          >
            {props.submitText || "Submit"}
          </CTAButton>
        )}
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
      <div key={fieldName} className={classes.Field}>
        {field.label && (
          <label className={classes.Label} htmlFor={fieldName}>
            <p>{field.label}</p>
          </label>
        )}
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
        {props.error && <ErrorText>{props.error}</ErrorText>}
      </div>
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
        {props.error && <ErrorText>{props.error}</ErrorText>}
      </div>
    );
  }

  return (
    <div key={fieldName} className={classes.Field}>
      <label className={classes.Label} htmlFor={fieldName}>
        <p>{field.label}</p>
        <Input
          type={field.type}
          id={fieldName}
          placeholder={field.placeholder}
          {...props.register(fieldName as Path<FormData<C>>, {
            required: field.required,
          })}
        />
      </label>
      {props.error && <ErrorText>{props.error}</ErrorText>}
    </div>
  );
}
