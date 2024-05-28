import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import classes from "./graphic-form.module.scss";

import { CommonGraphic } from "@/types";
import { useAPIContext } from "@/client/contexts/APIContext";

import { Form } from "@/client/ui/molecules/Form/Form";

export type GraphicFormProps = {
  defaultValue?: CommonGraphic;
  onSubmit: (graphic: CommonGraphic) => Promise<null | string>;
};

export const GraphicForm = (props: GraphicFormProps) => {
  const { commonParametersAPI } = useAPIContext();
  const { t } = useTranslation(undefined, {
    keyPrefix: "components.GraphicForm",
  });

  const formConfig = {
    visualType: {
      type: "combobox",
      label: t("graphic-type"),
      required: true,
      loadOptions: async () => {
        return [
          {
            label: "Histogram",
            value: "histogram",
          },
          {
            label: "Pie chart",
            value: "pie_chart",
          },
        ];
      },
    },
    commonParameter: {
      type: "combobox",
      label: t("common-parameter"),
      required: true,
      loadOptions: async (searchQuery: string) => {
        const parameters = await commonParametersAPI.getParameters({
          searchQuery,
          pageNumber: 1,
          pageSize: 12,
        });

        return parameters.items.map((p) => ({
          label: p.label,
          value: p.id,
        }));
      },
    },
  } as const;

  const defaultValue = props.defaultValue
    ? {
        visualType: {
          value: props.defaultValue.visualType,
          label: props.defaultValue.visualType,
        },
        commonParameter: {
          value: props.defaultValue.commonParameter.id,
          label: props.defaultValue.commonParameter.label,
        },
      }
    : undefined;

  return (
    <Form
      config={formConfig}
      onSubmit={(data) =>
        props.onSubmit({
          id: "",
          visualType: data.visualType.value,
          commonParameter: {
            id: data.commonParameter.value,
            description: "",
            label: "",
            type: {
              id: "",
              type: "",
            },
          },
        })
      }
      defaultValues={defaultValue}
      className={clsx(classes.Form)}
      submitText={t("save")}
    />
  );
};
