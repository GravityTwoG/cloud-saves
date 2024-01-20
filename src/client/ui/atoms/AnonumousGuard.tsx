import { ReactNode } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

export const AnonymousGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return;
  }

  return children;
};
