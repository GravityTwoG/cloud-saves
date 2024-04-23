import { forwardRef, useState } from "react";
import { clsx } from "clsx";

import classes from "./image-input.module.scss";

import { ReactTagProps } from "@/client/ui/types";

export type ImageInputProps = Omit<
  ReactTagProps<"input">,
  "children" | "type" | "onChange" | "value"
> & {
  onFileChange: (file: File | null) => void;
  src?: string;
};

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(
  ({ onFileChange, ...props }, ref) => {
    const [drop, setDrop] = useState(false);

    const onDragLeave = (e: React.DragEvent<HTMLElement>) => {
      if (props.disabled) return;
      e.preventDefault();
      setDrop(false);
    };

    const onDragOver = (e: React.DragEvent<HTMLElement>) => {
      if (props.disabled) return;
      e.preventDefault();
      setDrop(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLElement>) => {
      if (props.disabled) return;
      e.preventDefault();
      if (e.dataTransfer.files[0]) {
        setDrop(false);
        onFileChange(e.dataTransfer.files[0]);
      }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (props.disabled) return;
      if (e.target.files) {
        onFileChange(e.target.files[0]);
      } else {
        onFileChange(null);
      }
    };

    return (
      <label
        className={clsx(
          classes.ImageInput,
          drop && classes.Drop,
          props.src && classes.HasPreview,
        )}
        onDrop={handleDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          {...props}
          type="file"
          ref={ref}
          onChange={onChange}
          accept="image/*"
          className={clsx(classes.Input)}
        />

        {props.src && (
          <img src={props.src} alt="" className={classes.ImagePreview} />
        )}
        <p>Drag and drop an image or click to select one</p>
      </label>
    );
  },
);
