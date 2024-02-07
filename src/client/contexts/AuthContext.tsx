import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authApi from "../api/auth";

import { User } from "../../types";
import { navigate } from "wouter/use-location";
import { paths } from "../config/routes";

interface AuthContext {
  isAuthenticated: boolean;
  user: User;
  login: (credentials: authApi.LoginCredentials) => Promise<void>;
  register: (credentials: authApi.RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  isAuthenticated: false,
  user: {
    email: "$EMAIL$",
    username: "$NAME$",
  },
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthContextProvider = (props: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContext["user"]>({
    email: "$EMAIL$",
    username: "$NAME$",
  });

  useEffect(() => {
    authApi
      .getCurrentUser()
      .then((user) => {
        setUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const login = useCallback(async (credentials: authApi.LoginCredentials) => {
    const user = await authApi.login(credentials);

    setUser(user);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(
    async (credentials: authApi.RegisterCredentials) => {
      const user = await authApi.register(credentials);

      setUser(user);
      setIsAuthenticated(true);
    },
    []
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setUser({
      email: "$EMAIL$",
      username: "$NAME$",
    });
    navigate(paths.login({}));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
      {...props}
    />
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
