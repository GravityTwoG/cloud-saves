import classes from "./request-password-reset-page.module.scss";

import { paths } from "../../config/routes";
import { useAuthContext } from "../../contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";
import { useState } from "react";

const formConfig = {
  email: {
    type: "string",
    placeholder: "Enter email",
    label: "Email",
    required: "Email is required",
  },
} satisfies FormConfig;

export const RequestPasswordResetPage = () => {
  const { requestPasswordReset } = useAuthContext();
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
      return "Error";
    }
  };

  if (emailSent) {
    return (
      <Container className={classes.ResetPasswordPage}>
        <section>
          <H1 className="tac">Reset password</H1>
          <Paragraph>Password reset email sent.</Paragraph>
          <Paragraph>
            Check your email and follow the instructions to reset your password.
          </Paragraph>
        </section>
      </Container>
    );
  }

  return (
    <Container className={classes.ResetPasswordPage}>
      <section>
        <H1 className="tac">Reset password</H1>
        <Form config={formConfig} onSubmit={onSubmit} />

        <Paragraph>
          Don't have an account?{" "}
          <CommonLink href={paths.register({})}>Register</CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
