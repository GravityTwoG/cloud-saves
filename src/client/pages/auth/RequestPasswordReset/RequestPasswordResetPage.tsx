import { useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./request-password-reset-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Paper } from "@/client/ui/atoms/Paper";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

export const RequestPasswordResetPage = () => {
  const { requestPasswordReset } = useAuthContext();
  const { t } = useTranslation(undefined, {
    keyPrefix: "pages.requestPasswordReset",
  });

  const formConfig = {
    email: {
      type: "string",
      placeholder: t("form.email-placeholder"),
      label: t("form.email-label"),
      required: t("form.email-is-required"),
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
      return t("form.error-message");
    }
  };

  if (emailSent) {
    return (
      <Container className={classes.ResetPasswordPage}>
        <section>
          <H1 className="tac">{t("form.title")}</H1>

          <Paper>
            <Paragraph>{t("email-sent")}</Paragraph>
            <Paragraph>{t("prompt-to-check-email")}</Paragraph>
          </Paper>
        </section>
      </Container>
    );
  }

  return (
    <Container className={classes.ResetPasswordPage}>
      <section>
        <H1 className="tac">{t("form.title")}</H1>

        <Paper>
          <Form
            config={formConfig}
            onSubmit={onSubmit}
            className={classes.Form}
          />

          <Paragraph>
            {t("prompt-to-sign-up")}{" "}
            <CommonLink href={paths.register({})}>
              {t("link-to-sign-up")}
            </CommonLink>
          </Paragraph>
        </Paper>
      </section>
    </Container>
  );
};
