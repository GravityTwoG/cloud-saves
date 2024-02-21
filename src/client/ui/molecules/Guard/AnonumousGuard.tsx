import { ReactNode } from "react";
import { AuthStatus, useAuthContext } from "@/client/contexts/AuthContext";

export const AnonymousGuard = ({ children }: { children: ReactNode }) => {
  const { authStatus } = useAuthContext();

  if (authStatus === AuthStatus.ANONYMOUS) {
    return children;
  }

  return null;
};
