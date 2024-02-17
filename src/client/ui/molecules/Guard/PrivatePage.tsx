import { ReactNode } from "react";
import { Redirect } from "wouter";

import classes from "./private-page.module.scss";

import { UserRole } from "@/types";
import { useAuthContext } from "@/client/contexts/AuthContext";
import { paths } from "@/client/config/routes";

import { H1 } from "../../atoms/Typography";
import { Container } from "../../atoms/Container/Container";

type PrivatePageProps = {
  forRoles: UserRole[];
  children: ReactNode;
};

export const PrivatePage = (props: PrivatePageProps) => {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated && props.forRoles.length === 0) {
    return props.children;
  }

  const hasAllowedRole = props.forRoles.some((role) => role === user.role);
  if (isAuthenticated && hasAllowedRole) {
    return props.children;
  }

  if (isAuthenticated && !hasAllowedRole) {
    return (
      <Container className={classes.PrivatePage}>
        <H1>You don't have access to this page</H1>
      </Container>
    );
  }

  return <Redirect to={paths.login({})} />;
};
