import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { navigate } from "@/client/useHashLocation";

import { paths } from "@/client/config/routes";

import { User, UserRole } from "@/types";
import {
  ChangePasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "@/client/api/interfaces/IAuthAPI";
import { useAPIContext } from "./APIContext";

const emptyUser: User = {
  email: "$EMAIL$",
  username: "$NAME$",
  role: UserRole.USER,
};

export enum AuthStatus {
  INITIAL = "INITIAL",
  PENDING = "PENDING",
  ANONYMOUS = "ANONYMOUS",
  AUTHENTICATED = "AUTHENTICATED",
}

interface AuthContext {
  authStatus: AuthStatus;
  user: User;

  register: (credentials: RegisterCredentials) => Promise<void>;

  login: (credentials: LoginCredentials) => Promise<void>;

  changePassword: (credentials: ChangePasswordCredentials) => Promise<void>;

  requestPasswordReset: (email: string) => Promise<void>;

  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  authStatus: AuthStatus.INITIAL,
  user: emptyUser,
  register: async () => {},
  login: async () => {},
  changePassword: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = (props: { children: ReactNode }) => {
  const { authAPI } = useAPIContext();
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.INITIAL);
  const [user, setUser] = useState<AuthContext["user"]>(emptyUser);

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

export const useAuthContext = () => {
  return useContext(AuthContext);
};
