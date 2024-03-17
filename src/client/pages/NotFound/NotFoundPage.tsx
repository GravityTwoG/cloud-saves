import { useTranslation } from "react-i18next";

import classes from "./not-found-page.module.scss";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1 } from "@/client/ui/atoms/Typography";

export const NotFoundPage = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "pages.notFound" });
  return (
    <Container className={classes.NotFoundPage}>
      <H1>{t("page-not-found")}</H1>
    </Container>
  );
};
