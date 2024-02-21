import { ReactNode } from "react";
import { Redirect } from "wouter";

import classes from "./page-guard.module.scss";

import { paths } from "@/client/config/routes";
import { AuthStatus, useAuthContext } from "@/client/contexts/AuthContext";

import { Spinner } from "@/client/ui/atoms/Spinner";
import { Container } from "@/client/ui/atoms/Container/Container";

export const AnonymousPage = ({ children }: { children: ReactNode }) => {
  const { authStatus } = useAuthContext();

  if (authStatus === AuthStatus.ANONYMOUS) {
    return children;
  }

  if (authStatus === AuthStatus.AUTHENTICATED) {
    return <Redirect to={paths.profile({})} />;
  }

  return (
    <Container className={classes.PageGuard}>
      <Spinner className={classes.Spinner} />
    </Container>
  );
};
