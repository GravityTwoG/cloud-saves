import React, { forwardRef, useId } from "react";

import { Input, InputProps } from "@/client/ui/atoms/Input";
import { Field } from "./Field";

export type InputFieldProps = {
  label: string;
} & InputProps;

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, ...props }, ref) => {
    const internalId = useId();
    const id = props.id || internalId;

    return (
      <Field label={label} htmlFor={id}>
        <Input {...props} id={id} ref={ref} />
      </Field>
    );
  }
);
