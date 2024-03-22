import { ParameterTypesWidget } from "./ParameterTypesWidget";
import { useTranslation } from "react-i18next";
import { useModal } from "@/client/lib/hooks/useModal";

export const useParameterTypesModal = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  return useModal({
    children: <ParameterTypesWidget />,
    title: t("parameter-types"),
    bodyStyle: { width: "600px", maxWidth: "100%" },
  });
};
