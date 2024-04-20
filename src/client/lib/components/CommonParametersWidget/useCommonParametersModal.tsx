import { useTranslation } from "react-i18next";

import { useModal } from "@/client/ui/hooks/useModal";
import { CommonParametersWidget } from "./CommonParametersWidget";

export const useCommonParametersModal = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.games" });

  return useModal({
    children: <CommonParametersWidget />,
    title: t("common-parameters"),
    bodyStyle: { width: "600px", maxWidth: "100%" },
  });
};
