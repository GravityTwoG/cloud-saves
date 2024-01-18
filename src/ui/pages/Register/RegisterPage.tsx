import classes from "./register-page.module.scss";

import { paths } from "../../config/routes";

import { H1, Paragraph } from "../../components/atoms/Typography";
import { Container } from "../../components/atoms/Container/Container";
import { CommonLink } from "../../components/atoms/NavLink/CommonLink";
import {
  Form,
  FormConfig,
  FormData,
} from "../../components/molecules/Form/Form";

const formConfig = {
  username: {
    type: "string",
    placeholder: "Enter username",
    label: "Username",
  },
  email: {
    type: "string",
    placeholder: "Enter email",
    label: "Email",
  },
  password: {
    type: "password",
    placeholder: "Enter password",
    label: "Password",
  },
  confirmPassword: {
    type: "password",
    placeholder: "Confirm password",
    label: "Confirm Password",
  },
} satisfies FormConfig;

export const RegisterPage = () => {
  const onSubmit = async (data: FormData<typeof formConfig>) => {
    console.log(data);
    return false;
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
