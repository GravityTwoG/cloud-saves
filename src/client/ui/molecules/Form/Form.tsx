import React, { useState } from "react";

import classes from "./form.module.scss";

import {
  DefaultValues,
  Message,
  Path,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { ErrorText } from "../../atoms/ErrorText/ErrorText";

export type ComboboxOption = unknown;

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

  const handleChange = (value: string | ComboboxOption, field: keyof C) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const root = getFieldState("root" as Path<FormData<C>>);

  return (
    <form onSubmit={onSubmit} className={classes.Form}>
      {props.title && <h3>{props.title}</h3>}
      {Object.keys(props.config).map((field) => (
        <Field
          key={field}
          config={props.config}
          fieldName={field}
          formData={formData}
          handleChange={handleChange}
          register={register}
          error={
            (errors[field] !== undefined
              ? errors[field]!.message
              : undefined) as Message
          }
        />
      ))}

      {root.error && <ErrorText>{root.error.message}</ErrorText>}

      <div className={classes.FormActions}>
        <Button
          type="submit"
          className={classes.SubmitButton}
          isLoading={isLoading}
        >
          {props.submitText || "Подтвердить"}
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
        [field]: config[field].defaultValue || null,
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
  formData: FormData<C>;
  handleChange: (value: string | ComboboxOption, fieldName: keyof C) => void;
  register: UseFormRegister<FormData<C>>;
  error: Message;
};

function Field<C extends FormConfig>(props: FieldProps<C>) {
  const { config, fieldName, formData } = props;

  const field = config[fieldName];
  const fieldValue = formData[fieldName];

  if (field.type === "combobox" && typeof fieldValue !== "string") {
    return (
      <div key={fieldName} className={classes.Field}>
        {field.label && (
          <label className={classes.Label} htmlFor={fieldName}>
            <p>{field.label}</p>
          </label>
        )}
        {/* <EntitySelect
          loadOptions={field.loadOptions}
          option={fieldValue}
          onChange={(e) => handleChange(e, fieldName)}
          id={fieldName}
        /> */}
        {props.error && <ErrorText>{props.error}</ErrorText>}
      </div>
    );
  }

  if (typeof fieldValue !== "string") {
    return null;
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
