import classes from "./login-page.module.scss";

import { navigate } from "wouter/use-location";
import { paths } from "../../config/routes";
import { useAuthContext } from "../../contexts/AuthContext";

import { Container } from "../../components/atoms/Container/Container";
import { H1, Paragraph } from "../../components/atoms/Typography";
import { CommonLink } from "../../components/atoms/NavLink/CommonLink";
import {
  Form,
  FormConfig,
  FormData,
} from "../../components/molecules/Form/Form";

const formConfig = {
  email: {
    type: "string",
    placeholder: "Enter email",
    label: "Email",
    required: "Email is required",
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
        email: data.email,
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
          <CommonLink href={paths.register({})}>Register</CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
