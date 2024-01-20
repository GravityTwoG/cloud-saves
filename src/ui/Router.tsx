import { routes } from "./config/routes";

import { Route, Router as Wouter } from "wouter";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { useAuthContext } from "./contexts/AuthContext";
import { ReactNode } from "react";
import { Paragraph } from "./components/atoms/Typography";

export const Router = () => {
  return (
    <Wouter>
      <MainLayout>
        {routes.map((route) => {
          if (route.access === "authenticated") {
            return (
              <Route key={route.path.pattern} path={route.path.pattern}>
                <PrivatePage>
                  <route.component />
                </PrivatePage>
              </Route>
            );
          }

          if (route.access === "anonymous") {
            return (
              <Route key={route.path.pattern} path={route.path.pattern}>
                <AnonymousPage>
                  <route.component />
                </AnonymousPage>
              </Route>
            );
          }

          return (
            <Route key={route.path.pattern} path={route.path.pattern}>
              <route.component />
            </Route>
          );
        })}
      </MainLayout>
    </Wouter>
  );
};

const PrivatePage = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return children;
  }

  return <Paragraph>You must be logged in to access this page</Paragraph>;
};

const AnonymousPage = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return children;
  }

  return <Paragraph>You are already logged in</Paragraph>;
};
