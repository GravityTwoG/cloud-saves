import { ReactNode } from "react";
import { AuthStatus } from "@/client/contexts/AuthContext/AuthContext";
import { useAuthContext } from "@/client/contexts/AuthContext/useAuthContext";

export const AnonymousGuard = ({ children }: { children: ReactNode }) => {
  const { authStatus } = useAuthContext();

  if (authStatus === AuthStatus.ANONYMOUS) {
    return children;
  }

  return null;
};
