import { User } from "@/types";

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

export type ChangePasswordCredentials = {
  oldPassword: string;
  newPassword: string;
};

export type ResetPasswordCredentials = {
  token: string;
  newPassword: string;
};

export interface IAuthAPI {
  register(credentials: RegisterCredentials): Promise<User>;

  login(credentials: LoginCredentials): Promise<User>;

  getCurrentUser(): Promise<User>;

  changePassword(credentials: ChangePasswordCredentials): Promise<void>;

  requestPasswordReset(email: string): Promise<void>;

  resetPassword(credentials: ResetPasswordCredentials): Promise<void>;

  logout(): Promise<void>;
}
