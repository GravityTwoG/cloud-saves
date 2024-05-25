import { useTranslation } from "react-i18next";

import classes from "./register-page.module.scss";

import { paths } from "@/client/config/paths";
import { ApiError } from "@/client/api/ApiError";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container";
import { CommonLink } from "@/client/ui/atoms/Link/CommonLink";
import { Paper } from "@/client/ui/atoms/Paper";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

export const RegisterPage = () => {
  const { register } = useAuthContext();
  const { t } = useTranslation(undefined, { keyPrefix: "pages.register" });

  const formConfig = {
    username: {
      type: "string",
      placeholder: t("form.username-placeholder"),
      label: t("form.username-label"),
      required: t("form.username-is-required"),
    },
    email: {
      type: "string",
      placeholder: t("form.email-placeholder"),
      label: t("form.email-label"),
      required: t("form.email-is-required"),
    },
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

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      if (data.password !== data.confirmPassword) {
        return t("form.passwords-do-not-match");
      }

      await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        const mainMessage = t(error.message, {
          defaultValue: t("form.registration-failed"),
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

      return t("form.registration-failed");
    }
  };

  return (
    <Container className={classes.RegisterPage}>
      <section>
        <H1 className="tac">{t("form.title")}</H1>

        <div className="tac mb-4">
          <Paragraph>
            {t("prompt-to-sign-in")}{" "}
            <CommonLink href={paths.login({})}>
              {t("link-to-sign-in")}
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
