import { useState } from "react";
import { useTranslation } from "react-i18next";
import classes from "./reset-password-page.module.scss";

import { useSearchParams } from "@/client/useHashLocation";
import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.resetPassword" });

  const formConfig = {
    password: {
      type: "password",
      placeholder: t("form.PASSWORD_PLACEHOLDER"),
      label: t("form.PASSWORD_LABEL"),
      required: t("form.PASSWORD_REQUIRED"),
    },
    confirmPassword: {
      type: "password",
      placeholder: t("form.CONFIRM_PASSWORD_PLACEHOLDER"),
      label: t("form.CONFIRM_PASSWORD_LABEL"),
      required: t("form.CONFIRM_PASSWORD_REQUIRED"),
    },
  } satisfies FormConfig;
  const [passwordResetted, setPasswordResetted] = useState(false);

  const params = useSearchParams();

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      if (data.password !== data.confirmPassword) {
        return t("form.PASSWORDS_DO_NOT_MATCH");
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
      return t("form.ERROR_MESSAGE");
    }
  };

  if (passwordResetted) {
    return (
      <Container className={classes.ResetPasswordPage}>
        <section>
          <H1 className="tac">{t("form.TITLE")}</H1>
          <Paragraph>
            {t("PASSWORD_RESETTED")}{" "}
            <CommonLink href={paths.login({})}>
              {t("LINK_TO_SIGN_IN")}
            </CommonLink>
          </Paragraph>
        </section>
      </Container>
    );
  }

  return (
    <Container className={classes.ResetPasswordPage}>
      <section>
        <H1 className="tac">{t("form.TITLE")}</H1>
        <Form
          config={formConfig}
          onSubmit={onSubmit}
          submitText={t("form.SUBMIT_BUTTON")}
        />
      </section>
    </Container>
  );
};
