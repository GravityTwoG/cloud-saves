import React, { useState } from "react";

import classes from "./form.module.scss";
import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";

export type ComboboxOption = unknown;

export type SimpleField = {
  type: "string" | "number" | "date" | "password";
  placeholder?: string;
  defaultValue?: string;
  label?: string;
};

export type ComboBoxField = {
  type: "combobox";
  placeholder?: string;
  defaultValue?: ComboboxOption;
  label?: string;
  loadOptions: (inputValue: string) => Promise<ComboboxOption[]>;
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
  onSubmit: (formData: FormData<C>) => Promise<boolean>;
  submitText?: string;
  actions?: React.ReactNode;
  defaultValues?: FormData<C>;
};

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

export function Form<C extends FormConfig>(props: FormProps<C>) {
  const [formData, setFormData] = useState<FormData<C>>(() =>
    props.defaultValues
      ? props.defaultValues
      : extractDefaultValues(props.config)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value: string | ComboboxOption, field: keyof C) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const isOk = await props.onSubmit(formData);

      if (!isOk) {
        return;
      }

      setFormData(extractDefaultValues(props.config));
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={classes.Form}>
      {props.title && <h3>{props.title}</h3>}
      {Object.keys(props.config).map((field) => (
        <Field
          key={field}
          config={props.config}
          fieldName={field}
          formData={formData}
          handleChange={handleChange}
        />
      ))}

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

type FieldProps<C extends FormConfig> = {
  config: C;
  fieldName: string;
  formData: FormData<C>;
  handleChange: (value: string | ComboboxOption, fieldName: keyof C) => void;
};

function Field<C extends FormConfig>(props: FieldProps<C>) {
  const { config, fieldName, formData, handleChange } = props;

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
          value={fieldValue || ""}
          onChange={(e) => handleChange(e.target.value, fieldName)}
          placeholder={field.placeholder}
        />
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
          value={fieldValue || ""}
          onChange={(e) => handleChange(e.target.value, fieldName)}
          placeholder={field.placeholder}
        />
      </label>
    </div>
  );
}
