import { forwardRef, useId } from "react";

import { ImageInput, ImageInputProps } from "@/client/ui/atoms/Input";
import { Field } from "./Field";

export type ImageInputFieldProps = {
  label: string;
} & ImageInputProps;

export const ImageInputField = forwardRef<
  HTMLInputElement,
  ImageInputFieldProps
>(({ label, ...props }, ref) => {
  const internalId = useId();
  const id = props.id || internalId;

  return (
    <Field label={label} htmlFor={id}>
      <ImageInput {...props} id={id} ref={ref} />
    </Field>
  );
});
