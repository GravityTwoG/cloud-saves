import { AuthStatus } from "@/client/contexts/AuthContext/AuthContext";
import { useAuthContext } from "@/client/contexts/AuthContext/useAuthContext";
import { UserRole } from "@/types";

export type AuthGuardProps = {
  forRoles: UserRole[];
  children: React.ReactNode;
};

export const AuthGuard = ({ children, forRoles }: AuthGuardProps) => {
  const { authStatus, user } = useAuthContext();

  const isAuthenticated = authStatus === AuthStatus.AUTHENTICATED;
  const rolesNotSpecified = forRoles.length === 0;
  if (isAuthenticated && rolesNotSpecified) {
    return children;
  }

  const hasAllowedRole = forRoles.some((role) => role === user.role);
  if (isAuthenticated && hasAllowedRole) {
    return children;
  }

  return null;
};
