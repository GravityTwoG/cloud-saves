import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { useAPIContext } from "@/client/contexts/APIContext";
import { useUIContext } from "@/client/contexts/UIContext";
import { useSearchParams } from "@/client/app/useHashLocation";
import { CommonGraphic } from "@/types";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { Preloader } from "@/client/ui/molecules/Preloader";
import { GraphicForm } from "./components/GraphicForm";

export const GraphicPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.graphic" });
  const { t: tCommon } = useTranslation(undefined, { keyPrefix: "common" });
  const { graphicsAPI } = useAPIContext();
  const { notify } = useUIContext();

  const [isLoading, setIsLoading] = useState(false);
  const [graphic, setGraphic] = useState<CommonGraphic | null>(null);
  const graphicId = useSearchParams()["graphicId"];

  useEffect(() => {
    const loadGraphic = async () => {
      try {
        setIsLoading(true);
        const g = await graphicsAPI.getCommonGraphic(graphicId);
        setGraphic(g);
      } catch (e) {
        notify.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadGraphic();
  }, [graphicsAPI, graphicId]);

  if (!graphic && !isLoading) {
    return (
      <Container className="my-4">
        <H1>{tCommon("not-found")}</H1>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <H1>{t("graphic")}</H1>

      <Preloader isLoading={isLoading}>
        {graphic && <GraphicForm defaultValue={graphic} />}
      </Preloader>
    </Container>
  );
};
