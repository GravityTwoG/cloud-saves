import { ReactNode } from "react";
import { useAuthContext } from "@/client/contexts/AuthContext";

export const AnonymousGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return;
  }

  return children;
};
