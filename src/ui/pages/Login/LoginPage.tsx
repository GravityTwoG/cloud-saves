import classes from "./login-page.module.scss";

import { paths } from "../../config/routes";

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
  },
  password: {
    type: "password",
    placeholder: "Enter password",
    label: "Password",
  },
} satisfies FormConfig;

export const LoginPage = () => {
  const onSubmit = async (data: FormData<typeof formConfig>) => {
    console.log(data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
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
