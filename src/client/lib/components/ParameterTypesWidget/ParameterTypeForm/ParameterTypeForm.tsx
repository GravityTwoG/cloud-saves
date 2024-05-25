import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import classes from "./form.module.scss";

import { Input } from "@/client/ui/atoms/Input";
import { Button } from "@/client/ui/atoms/Button";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";

export type ParameterTypeFormProps = {
  onSubmit: (type: string) => Promise<void>;
  defaultValue?: string;
  resetOnSubmit?: boolean;
};

export const ParameterTypeForm = ({
  resetOnSubmit = true,
  ...props
}: ParameterTypeFormProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      type: props.defaultValue || "",
    },
  });

  const onSubmit = async (data: { type: string }) => {
    await props.onSubmit(data.type.trim());
    if (resetOnSubmit) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.Form}>
      <Input
        {...register("type", { required: t("type-is-required") })}
        placeholder={t("type")}
      />
      {errors.type && <ErrorText>{errors.type.message}</ErrorText>}

      <Button type="submit">{t("save")}</Button>
    </form>
  );
};
