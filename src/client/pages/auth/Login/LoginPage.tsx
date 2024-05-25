import { useTranslation } from "react-i18next";

import classes from "./login-page.module.scss";

import { paths } from "@/client/config/paths";
import { ApiError } from "@/client/api/ApiError";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/Link/CommonLink";
import { Paper } from "@/client/ui/atoms/Paper";
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
      if (error instanceof ApiError) {
        const mainMessage = t(error.message, {
          defaultValue: t("form.error-message"),
        });

        if (error.errors) {
          return (
            `${mainMessage} ` +
            error.errors
              .map((err) => `${t(`form.${err}`, { defaultValue: err })}`)
              .join(" ")
          );
        }

        return mainMessage;
      }
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

        <div className="tac mb-4">
          <Paragraph>
            {t("prompt-to-sign-up")}{" "}
            <CommonLink href={paths.register({})}>
              {t("link-to-sign-up")}{" "}
            </CommonLink>
            <CommonLink href={paths.requestPasswordReset({})}>
              {t("link-to-forgot-pasword")}
            </CommonLink>
          </Paragraph>
        </div>

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
