import { useAuthContext } from "@/client/contexts/AuthContext";
import { UserRole } from "@/types";

export type AuthGuardProps = {
  forRoles: UserRole[];
  children: React.ReactNode;
};

export const AuthGuard = ({ children, forRoles }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAuthContext();

  if (isAuthenticated && forRoles.length === 0) {
    return children;
  }

  const hasAllowedRole = forRoles.some((role) => role === user.role);
  if (isAuthenticated && hasAllowedRole) {
    return children;
  }

  return null;
};
