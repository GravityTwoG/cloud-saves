import { User } from "@/types";
import { fetcher } from "./fetcher";
import {
  ChangePasswordCredentials,
  IAuthAPI,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "./IAuthAPI";

export class AuthAPI implements IAuthAPI {
  register = (credentials: RegisterCredentials): Promise<User> => {
    return fetcher.post<User>("/auth/register", { body: credentials });
  };

  login = (credentials: LoginCredentials): Promise<User> => {
    return fetcher.post<User>("/auth/login", { body: credentials });
  };

  getCurrentUser = (): Promise<User> => {
    return fetcher.get<User>("/auth/me");
  };

  changePassword = (credentials: ChangePasswordCredentials): Promise<void> => {
    return fetcher.post("/auth/change-password", { body: credentials });
  };

  requestPasswordReset = (email: string): Promise<void> => {
    return fetcher.post("/auth/request-password-reset", { body: { email } });
  };

  resetPassword = (credentials: ResetPasswordCredentials): Promise<void> => {
    return fetcher.post("/auth/reset-password", { body: credentials });
  };

  logout = async (): Promise<void> => {
    await fetcher.post("/auth/logout");
  };
}
