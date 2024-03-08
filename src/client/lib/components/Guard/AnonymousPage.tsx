import { ReactNode } from "react";
import { Redirect } from "wouter";

import classes from "./page-guard.module.scss";

import { paths } from "@/client/config/paths";
import { AuthStatus } from "@/client/contexts/AuthContext/AuthContext";
import { useAuthContext } from "@/client/contexts/AuthContext/useAuthContext";

import { Spinner } from "@/client/ui/atoms/Spinner";
import { Container } from "@/client/ui/atoms/Container/Container";
import { UserRole } from "@/types";

export const AnonymousPage = ({ children }: { children: ReactNode }) => {
  const { authStatus, user } = useAuthContext();

  if (authStatus === AuthStatus.ANONYMOUS) {
    return children;
  }

  if (authStatus === AuthStatus.AUTHENTICATED && user.role === UserRole.USER) {
    return <Redirect to={paths.mySaves({})} />;
  }
  if (authStatus === AuthStatus.AUTHENTICATED && user.role === UserRole.ADMIN) {
    return <Redirect to={paths.games({})} />;
  }

  return (
    <Container className={classes.PageGuard}>
      <Spinner className={classes.Spinner} />
    </Container>
  );
};
