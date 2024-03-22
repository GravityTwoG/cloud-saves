import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import classes from "./form.module.scss";

import { CommonParameter } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";

import { Select } from "@/client/ui/atoms/Select/Select";
import { Input } from "@/client/ui/atoms/Input/Input";
import { Button } from "@/client/ui/atoms/Button/Button";
import { ErrorText } from "@/client/ui/atoms/ErrorText/ErrorText";

type FormData = {
  typeId: string;
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
  } = useForm<FormData>({
    defaultValues: {
      typeId: props.defaultValue?.type.id,
      label: props.defaultValue?.label,
      description: props.defaultValue?.description,
    },
  });

  const [selectKey, setSelectKey] = useState(0);
  const [options, setOptions] = useState<{ name: string; value: string }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const options = await parameterTypesAPI.getTypes({
          pageNumber: 1,
          pageSize: 24,
          searchQuery: "",
        });
        setOptions(
          options.items.map((option) => ({
            value: option.id,
            name: option.type,
          }))
        );
        setSelectKey((key) => (key == 0 ? 1 : 0));
      } catch (error) {
        console.error(error);
      }
    }
    load();
  }, []);

  const onSubmit = async (data: FormData) => {
    await props.onSubmit({
      type: { id: data.typeId, type: "" },
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

      <Select key={selectKey} {...register("typeId")} options={options} />
      {errors.typeId && <ErrorText>{errors.typeId.message}</ErrorText>}

      {errors.root && <ErrorText>{errors.root.message}</ErrorText>}

      <Button type="submit">{t("save")}</Button>
    </form>
  );
};
