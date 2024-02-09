import { User } from "../../types";
import { IAuthAPI } from "./IAuthAPI";
import { fetcher } from "./fetcher";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

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

  logout = async (): Promise<void> => {
    await fetcher.post("/auth/logout");
  };
}
