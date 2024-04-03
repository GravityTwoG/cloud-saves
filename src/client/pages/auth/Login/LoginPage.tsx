import { useTranslation } from "react-i18next";

import classes from "./login-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.login" });

  const formConfig = {
    username: {
      type: "string",
      placeholder: t("form.username-placeholder"),
      label: t("form.username-label"),
      required: t("form.username-is-required"),
    },
    password: {
      type: "password",
      placeholder: t("form.password-placeholder"),
      label: t("form.password-label"),
      required: t("form.password-is-required"),
    },
  } satisfies FormConfig;

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      await login({
        username: data.username,
        password: data.password,
      });

      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return t("form.error-message");
    }
  };

  return (
    <Container className={classes.LoginPage}>
      <section>
        <H1 className="tac">{t("form.title")}</H1>
        <Form
          config={formConfig}
          onSubmit={onSubmit}
          submitText={t("form.submit-button")}
        />

        <Paragraph>
          {t("prompt-to-sign-up")}{" "}
          <CommonLink href={paths.register({})}>
            {t("link-to-sign-up")}{" "}
          </CommonLink>
          <CommonLink href={paths.requestPasswordReset({})}>
            {t("link-to-forgot-pasword")}
          </CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
