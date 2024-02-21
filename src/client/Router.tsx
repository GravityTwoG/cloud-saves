import { Route, Switch, Router as Wouter } from "wouter";
import { useHashLocation } from "./useHashLocation";

import { RouteAccess, routes } from "./config/routes";

import { PrivatePage } from "./ui/molecules/Guard/PrivatePage";
import { AnonymousPage } from "./ui/molecules/Guard/AnonymousPage";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { DeepLinkHandler } from "./DeepLinkHandler";
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";

export const Router = () => {
  return (
    <Wouter hook={useHashLocation}>
      <DeepLinkHandler />

      <MainLayout>
        <Switch>
          {routes.map((route) => {
            if (route.access === RouteAccess.ANONYMOUS) {
              return (
                <Route key={route.path} path={route.path}>
                  <AnonymousPage>
                    <route.component />
                  </AnonymousPage>
                </Route>
              );
            }

            if (route.access === RouteAccess.AUTHENTICATED) {
              return (
                <Route key={route.path} path={route.path}>
                  <PrivatePage forRoles={route.forRoles}>
                    <route.component />
                  </PrivatePage>
                </Route>
              );
            }

            return (
              <Route key={route.path} path={route.path}>
                <route.component />
              </Route>
            );
          })}

          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </MainLayout>
    </Wouter>
  );
};
