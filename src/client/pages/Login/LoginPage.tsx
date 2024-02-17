import { navigate } from "@/client/useHashLocation";

import classes from "./login-page.module.scss";

import { paths } from "../../config/routes";
import { useAuthContext } from "../../contexts/AuthContext";

import { Container } from "@/client/ui/atoms/Container/Container";
import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

const formConfig = {
  username: {
    type: "string",
    placeholder: "Enter username",
    label: "Username",
    required: "Username is required",
  },
  password: {
    type: "password",
    placeholder: "Enter password",
    label: "Password",
    required: "Password is required",
  },
} satisfies FormConfig;

export const LoginPage = () => {
  const { login } = useAuthContext();

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      await login({
        username: data.username,
        password: data.password,
      });
      navigate(paths.profile({}));

      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Error";
    }
  };

  return (
    <Container className={classes.LoginPage}>
      <section>
        <H1 className="tac">Login</H1>
        <Form config={formConfig} onSubmit={onSubmit} />

        <Paragraph>
          Don't have an account?{" "}
          <CommonLink href={paths.register({})}>Register. </CommonLink>
          <CommonLink href={paths.requestPasswordReset({})}>
            Forgot password?
          </CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
