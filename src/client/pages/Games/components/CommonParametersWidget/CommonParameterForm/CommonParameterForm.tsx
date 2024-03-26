import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import classes from "./form.module.scss";

import { CommonParameter } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";

import { Input } from "@/client/ui/atoms/Input/Input";
import { Button } from "@/client/ui/atoms/Button/Button";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";
import { AsyncEntitySelect } from "@/client/ui/atoms/Select/AsyncSelect/AsyncEntitySelect";

type FormData = {
  type: { id: string; type: string };
  label: string;
  description: string;
};

export type CommonParameterFormProps = {
  onSubmit: (parameter: {
    type: { id: string; type: string };
    label: string;
    description: string;
  }) => Promise<void>;
  defaultValue?: CommonParameter;
  resetOnSubmit?: boolean;
};

export const CommonParameterForm = ({
  resetOnSubmit = true,
  ...props
}: CommonParameterFormProps) => {
  const { parameterTypesAPI } = useAPIContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>({
    defaultValues: {
      type: props.defaultValue?.type || { id: "", type: "" },
      label: props.defaultValue?.label,
      description: props.defaultValue?.description,
    },
  });

  const onSubmit = async (data: FormData) => {
    await props.onSubmit({
      type: data.type,
      label: data.label,
      description: data.description,
    });
    if (resetOnSubmit) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.Form}>
      <Input
        {...register("label", {
          required: t("common-parameter-label-required"),
        })}
        placeholder={t("common-parameter-label")}
      />
      {errors.label && <ErrorText>{errors.label.message}</ErrorText>}

      <Input
        {...register("description")}
        placeholder={t("common-parameter-description")}
      />

      {errors.description && (
        <ErrorText>{errors.description.message}</ErrorText>
      )}

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <AsyncEntitySelect
            onChange={(value) => {
              field.onChange({
                id: value.value,
                type: value.label,
              });
            }}
            placeholder={t("parameter-type")}
            loadOptions={async (input) => {
              const types = await parameterTypesAPI.getTypes({
                searchQuery: input,
                pageNumber: 1,
                pageSize: 25,
              });
              return types.items.map((type) => ({
                label: type.type,
                value: type.id,
              }));
            }}
            onBlur={() => field.onBlur()}
            option={{ label: field.value.type, value: field.value.id }}
          />
        )}
      />
      {errors.type && <ErrorText>{errors.type.message}</ErrorText>}

      {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

      <Button type="submit">{t("save")}</Button>
    </form>
  );
};
