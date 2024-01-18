import { routes } from "./config/routes";

import { Route, Router as Wouter } from "wouter";
import { MainLayout } from "./layouts/MainLayout/MainLayout";

export const Router = () => {
  return (
    <Wouter>
      <MainLayout>
        {routes.map((route) => (
          <Route key={route.path.pattern} path={route.path.pattern}>
            <route.component />
          </Route>
        ))}
      </MainLayout>
    </Wouter>
  );
};
