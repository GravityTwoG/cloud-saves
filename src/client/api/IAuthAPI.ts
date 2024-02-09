import { User } from "@/types";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

export interface IAuthAPI {
  register(credentials: RegisterCredentials): Promise<User>;
  login(credentials: LoginCredentials): Promise<User>;
  getCurrentUser(): Promise<User>;
  logout(): Promise<void>;
}
