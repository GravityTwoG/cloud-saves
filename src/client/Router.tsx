import { Route, Switch, Router as Wouter } from "wouter";
import { useHashLocation } from "./useHashLocation";

import { RouteAccess, routes } from "./config/routes";

import { AppErrorBoundary } from "./ui/molecules/AppErrorBoundary";
import { PrivatePage } from "./lib/components/Guard/PrivatePage";
import { AnonymousPage } from "./lib/components/Guard/AnonymousPage";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { DeepLinkHandler } from "./DeepLinkHandler";
import { NotFoundPage } from "./pages/NotFound/NotFoundPage";

export const Router = () => {
  return (
    <Wouter hook={useHashLocation}>
      <DeepLinkHandler />

      <MainLayout>
        <AppErrorBoundary>
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
        </AppErrorBoundary>
      </MainLayout>
    </Wouter>
  );
};
