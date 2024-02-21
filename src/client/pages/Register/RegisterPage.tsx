import { navigate } from "@/client/useHashLocation";

import classes from "./register-page.module.scss";

import { paths } from "@/client/config/routes";
import { useAuthContext } from "@/client/contexts/AuthContext";

import { H1, Paragraph } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { CommonLink } from "@/client/ui/atoms/NavLink/CommonLink";
import { Form, FormConfig, FormData } from "@/client/ui/molecules/Form/Form";

const formConfig = {
  username: {
    type: "string",
    placeholder: "Enter username",
    label: "Username",
    required: "Username is required",
  },
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
  confirmPassword: {
    type: "password",
    placeholder: "Confirm password",
    label: "Confirm Password",
    required: "Confirm Password is required",
  },
} satisfies FormConfig;

export const RegisterPage = () => {
  const { register } = useAuthContext();

  const onSubmit = async (data: FormData<typeof formConfig>) => {
    try {
      if (data.password !== data.confirmPassword) {
        return "Passwords do not match";
      }

      await register({
        username: data.username,
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
    <Container className={classes.RegisterPage}>
      <section>
        <H1 className="tac">Register</H1>
        <Form config={formConfig} onSubmit={onSubmit} />

        <Paragraph>
          Already have an account?{" "}
          <CommonLink href={paths.login({})}>Login</CommonLink>
        </Paragraph>
      </section>
    </Container>
  );
};
