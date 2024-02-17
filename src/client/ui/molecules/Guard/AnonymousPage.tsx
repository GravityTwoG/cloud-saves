import { ReactNode } from "react";
import { Redirect } from "wouter";

import { paths } from "@/client/config/routes";
import { useAuthContext } from "@/client/contexts/AuthContext";

export const AnonymousPage = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return children;
  }

  return <Redirect to={paths.profile({})} />;
};
