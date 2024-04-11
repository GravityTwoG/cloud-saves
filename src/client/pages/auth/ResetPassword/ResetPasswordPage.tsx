import { useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./reset-password-page.module.scss";

import { useSearchParams } from "@/client/app/useHashLocation";
import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";
import { Paper } from "@/client/ui/atoms/Paper";
import { CommonLink } from "@/client/ui/atoms/Link/CommonLink";

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.resetPassword" });

  const formConfig = {
    password: {
      type: "password",
      placeholder: t("form.password-placeholder"),
      label: t("form.password-label"),
      required: t("form.password-is-required"),
    },
    confirmPassword: {
      type: "password",
      placeholder: t("form.confirm-password-placeholder"),
      label: t("form.confirm-password-label"),
      required: t("form.confirm-password-is-required"),
    },
  } satisfies FormConfig;
  const [passwordResetted, setPasswordResetted] = useState(false);

  const params = useSearchParams();

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      if (data.password !== data.confirmPassword) {
        return t("form.passwords-do-not-match");
      }

      await resetPassword({
        token: params.token,
        newPassword: data.password,
      });

      setPasswordResetted(true);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return t("form.error-message");
    }
  };

  if (passwordResetted) {
    return (
      <Container className={classes.ResetPasswordPage}>
        <section>
          <H1 className="tac">{t("form.title")}</H1>

          <Paper>
            <Paragraph>
              {t("password-resetted")}{" "}
              <CommonLink href={paths.login({})}>
                {t("link-to-sign-in")}
              </CommonLink>
            </Paragraph>
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
            submitText={t("form.submit-button")}
            className={classes.Form}
          />
        </Paper>
      </section>
    </Container>
  );
};
