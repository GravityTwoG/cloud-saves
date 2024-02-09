import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { navigate } from "wouter/use-location";

import { paths } from "@/client/config/routes";

import { User } from "@/types";
import { LoginCredentials, RegisterCredentials } from "@/client/api/IAuthAPI";
import { useAPIContext } from "./APIContext";

interface AuthContext {
  isAuthenticated: boolean;
  user: User;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
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
  const { authAPI } = useAPIContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContext["user"]>({
    email: "$EMAIL$",
    username: "$NAME$",
  });

  useEffect(() => {
    authAPI
      .getCurrentUser()
      .then((user) => {
        setUser(user);
        setIsAuthenticated(true);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const user = await authAPI.login(credentials);

    setUser(user);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const user = await authAPI.register(credentials);

    setUser(user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout();
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
