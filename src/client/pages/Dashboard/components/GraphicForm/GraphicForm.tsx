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

  const formConfig = {
    visualType: {
      type: "combobox",
      label: "Graphic type",
      required: true,
      loadOptions: async () => {
        return [
          {
            label: "Histogram",
            value: "histogram",
          },
          {
            label: "Pie chart",
            value: "piechart",
          },
        ];
      },
    },
    commonParameter: {
      type: "combobox",
      label: "Common parameter",
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
          value: props.defaultValue.commonParameterId,
          label: props.defaultValue.commonParameterId,
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
          commonParameterId: data.commonParameter.value,
        })
      }
      defaultValues={defaultValue}
      className={clsx(classes.Form)}
    />
  );
};
