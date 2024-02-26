import { ReactNode, useCallback, useEffect, useState } from "react";

import { navigate } from "@/client/useHashLocation";
import { User } from "@/types";
import { paths } from "@/client/config/routes";

import {
  ChangePasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "@/client/api/interfaces/IAuthAPI";
import { useAPIContext } from "../APIContext/useAPIContext";
import { AuthStatus, emptyUser, AuthContext } from "./AuthContext";

export const AuthContextProvider = (props: { children: ReactNode }) => {
  const { authAPI } = useAPIContext();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.INITIAL);
  const [user, setUser] = useState<User>(emptyUser);

  useEffect(() => {
    setAuthStatus(AuthStatus.PENDING);
    authAPI
      .getCurrentUser()
      .then((user) => {
        setUser(user);
        setAuthStatus(AuthStatus.AUTHENTICATED);
      })
      .catch(() => setAuthStatus(AuthStatus.ANONYMOUS));
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const user = await authAPI.register(credentials);

    setUser(user);
    setAuthStatus(AuthStatus.AUTHENTICATED);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const user = await authAPI.login(credentials);

    setUser(user);
    setAuthStatus(AuthStatus.AUTHENTICATED);
  }, []);

  const changePassword = useCallback(
    async (credentials: ChangePasswordCredentials) => {
      await authAPI.changePassword(credentials);
    },
    []
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    await authAPI.requestPasswordReset(email);
  }, []);

  const resetPassword = useCallback(
    async (credentials: ResetPasswordCredentials) => {
      await authAPI.resetPassword(credentials);
    },
    []
  );

  const logout = useCallback(async () => {
    await authAPI.logout();
    setAuthStatus(AuthStatus.ANONYMOUS);
    setUser(emptyUser);
    navigate(paths.login({}));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        user,
        register,
        login,
        changePassword,
        requestPasswordReset,
        resetPassword,
        logout,
      }}
      {...props}
    />
  );
};
