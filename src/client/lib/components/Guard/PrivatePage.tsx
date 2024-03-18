import { ReactNode } from "react";
import { Redirect } from "wouter";

import classes from "./page-guard.module.scss";

import { UserRole } from "@/types";
import { AuthStatus, useAuthContext } from "@/client/contexts/AuthContext";
import { paths } from "@/client/config/paths";

import { H1 } from "@/client/ui/atoms/Typography";
import { Container } from "@/client/ui/atoms/Container/Container";
import { Spinner } from "@/client/ui/atoms/Spinner";

type PrivatePageProps = {
  forRoles: UserRole[];
  children: ReactNode;
};

export const PrivatePage = (props: PrivatePageProps) => {
  const { authStatus, user } = useAuthContext();

  const isAuthenticated = authStatus === AuthStatus.AUTHENTICATED;
  const rolesNotSpecified = props.forRoles.length === 0;
  if (isAuthenticated && rolesNotSpecified) {
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

  if (authStatus === AuthStatus.ANONYMOUS) {
    return <Redirect to={paths.login({})} />;
  }

  return (
    <Container className={classes.PageGuard}>
      <Spinner className={classes.Spinner} />
    </Container>
  );
};
