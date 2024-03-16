import { useTranslation } from "react-i18next";

import classes from "./register-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

export const RegisterPage = () => {
  const { register } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.register" });

  const formConfig = {
    username: {
      type: "string",
      placeholder: t("form.USERNAME_PLACEHOLDER"),
      label: t("form.USERNAME_LABEL"),
      required: t("form.USERNAME_REQUIRED"),
    },
    email: {
      type: "string",
      placeholder: t("form.EMAIL_PLACEHOLDER"),
      label: t("form.EMAIL_LABEL"),
      required: t("form.EMAIL_REQUIRED"),
    },
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

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      if (data.password !== data.confirmPassword) {
        return t("form.PASSWORDS_DO_NOT_MATCH");
      }

      await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return t("form.ERROR_MESSAGE");
    }
  };

  return (
    <Container className={classes.RegisterPage}>
      <section>
        <H1 className="tac">{t("form.TITLE")}</H1>
        <Form
          config={formConfig}
          onSubmit={onSubmit}
          submitText={t("form.SUBMIT_BUTTON")}
        />

        <Paragraph>
          {t("PROMPT_TO_SIGN_IN")}{" "}
          <CommonLink href={paths.login({})}>{t("LINK_TO_SIGN_IN")}</CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
