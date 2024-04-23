import { useHashLocation } from "./useHashLocation";

import { RouteAccess, routes } from "@/client/config/routes";

import { Route, Switch, Router as Wouter } from "wouter";
import { AppErrorBoundary } from "@/client/ui/molecules/AppErrorBoundary";
import { PrivatePage } from "@/client/lib/components/Guard/PrivatePage";
import { AnonymousPage } from "@/client/lib/components/Guard/AnonymousPage";
import { MainLayout } from "@/client/layouts/MainLayout/MainLayout";
import { NotFoundPage } from "@/client/pages/NotFound/NotFoundPage";

export const Router = () => {
  return (
    <Wouter hook={useHashLocation}>
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
