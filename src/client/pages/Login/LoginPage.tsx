import { useTranslation } from "react-i18next";

import classes from "./login-page.module.scss";

import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

export const LoginPage = () => {
  const { login } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.login" });

  const formConfig = {
    username: {
      type: "string",
      placeholder: t("form.USERNAME_PLACEHOLDER"),
      label: t("form.USERNAME_LABEL"),
      required: t("form.USERNAME_REQUIRED"),
    },
    password: {
      type: "password",
      placeholder: t("form.PASSWORD_PLACEHOLDER"),
      label: t("form.PASSWORD_LABEL"),
      required: t("form.PASSWORD_REQUIRED"),
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
      return t("form.ERROR_MESSAGE");
    }
  };

  return (
    <Container className={classes.LoginPage}>
      <section>
        <H1 className="tac">{t("form.TITLE")}</H1>
        <Form
          config={formConfig}
          onSubmit={onSubmit}
          submitText={t("form.SUBMIT_BUTTON")}
        />

        <Paragraph>
          {t("PROMPT_TO_SIGN_UP")}{" "}
          <CommonLink href={paths.register({})}>
            {t("LINK_TO_SIGN_UP")}{" "}
          </CommonLink>
          <CommonLink href={paths.requestPasswordReset({})}>
            {t("LINK_TO_FORGOT_PASSWORD")}
          </CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
