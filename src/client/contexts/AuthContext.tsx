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
} from "@/client/api/IAuthAPI";
import { useAPIContext } from "./APIContext";

const emptyUser: User = {
  email: "$EMAIL$",
  username: "$NAME$",
  role: UserRole.USER,
};

interface AuthContext {
  isAuthenticated: boolean;
  user: User;

  register: (credentials: RegisterCredentials) => Promise<void>;

  login: (credentials: LoginCredentials) => Promise<void>;

  changePassword: (credentials: ChangePasswordCredentials) => Promise<void>;

  requestPasswordReset: (email: string) => Promise<void>;

  resetPassword: (credentials: ResetPasswordCredentials) => Promise<void>;

  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContext["user"]>(emptyUser);

  useEffect(() => {
    authAPI
      .getCurrentUser()
      .then((user) => {
        setUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const user = await authAPI.register(credentials);

    setUser(user);
    setIsAuthenticated(true);
  }, []);
  const login = useCallback(async (credentials: LoginCredentials) => {
    const user = await authAPI.login(credentials);

    setUser(user);
    setIsAuthenticated(true);
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
    setIsAuthenticated(false);
    setUser(emptyUser);
    navigate(paths.login({}));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
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
