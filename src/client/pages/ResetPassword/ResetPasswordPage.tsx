import { useState } from "react";
import classes from "./reset-password-page.module.scss";

import { useSearchParams } from "@/client/useHashLocation";
import { paths } from "@/client/config/paths";
import { useAuthContext } from "@/client/contexts/AuthContext/useAuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";

const formConfig = {
  password: {
    type: "password",
    placeholder: "Enter password",
    label: "Password",
    required: "Password is required",
  },
  confirmPassword: {
    type: "password",
    placeholder: "Enter password",
    label: "Confirm password",
    required: "Confirm password is required",
  },
} satisfies FormConfig;

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuthContext();
  const [passwordResetted, setPasswordResetted] = useState(false);

  const params = useSearchParams();

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      if (data.password !== data.confirmPassword) {
        return "Passwords do not match";
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
      return "Error";
    }
  };

  if (passwordResetted) {
    return (
      <Container className={classes.ResetPasswordPage}>
        <section>
          <H1 className="tac">Reset password</H1>
          <Paragraph>
            Password has been reset.{" "}
            <CommonLink href={paths.login({})}>Login</CommonLink>
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
      </section>
    </Container>
  );
};
