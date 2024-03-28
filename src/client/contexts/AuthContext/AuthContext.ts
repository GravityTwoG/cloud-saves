import { createContext } from "react";

import { User, UserRole } from "@/types";
import {
  ChangePasswordCredentials,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "@/client/api/interfaces/IAuthAPI";

export const emptyUser: User = {
  id: "$USER_ID$",
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
