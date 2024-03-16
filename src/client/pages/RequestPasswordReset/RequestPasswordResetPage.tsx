import { useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./request-password-reset-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

export const RequestPasswordResetPage = () => {
  const { requestPasswordReset } = useAuthContext();
  const { t } = useTranslation(undefined, {
    keyPrefix: "pages.requestPasswordReset",
  });

  const formConfig = {
    email: {
      type: "string",
      placeholder: t("form.EMAIL_PLACEHOLDER"),
      label: t("form.EMAIL_LABEL"),
      required: t("form.EMAIL_REQUIRED"),
    },
  } satisfies FormConfig;
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      await requestPasswordReset(data.email);

      setEmailSent(true);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return t("form.ERROR_MESSAGE");
    }
  };

  if (emailSent) {
    return (
      <Container className={classes.ResetPasswordPage}>
        <section>
          <H1 className="tac">{t("form.TITLE")}</H1>
          <Paragraph>{t("EMAIL_SENT")}</Paragraph>
          <Paragraph>{t("PROMPT_TO_CHECK_EMAIL")}</Paragraph>
        </section>
      </Container>
    );
  }

  return (
    <Container className={classes.ResetPasswordPage}>
      <section>
        <H1 className="tac">{t("form.TITLE")}</H1>
        <Form config={formConfig} onSubmit={onSubmit} />

        <Paragraph>
          {t("PROMPT_TO_SIGN_UP")}{" "}
          <CommonLink href={paths.register({})}>
            {t("LINK_TO_SIGN_UP")}
          </CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
