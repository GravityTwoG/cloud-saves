import { CommonParametersWidget } from "./CommonParametersWidget";
import { useTranslation } from "react-i18next";
import { useModal } from "@/client/ui/hooks/useModal";

export const useCommonParametersModal = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  return useModal({
    children: <CommonParametersWidget />,
    title: t("common-parameters"),
    bodyStyle: { width: "600px", maxWidth: "100%" },
  });
};
