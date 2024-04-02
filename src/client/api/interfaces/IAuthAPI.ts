import { User } from "@/types";

export type LoginDTO = {
  username: string;
  password: string;
};

export type RegisterDTO = {
  email: string;
  username: string;
  password: string;
};

export type ChangePasswordDTO = {
  oldPassword: string;
  newPassword: string;
};

export type ResetPasswordDTO = {
  token: string;
  newPassword: string;
};

export interface IAuthAPI {
  register(credentials: RegisterDTO): Promise<User>;

  login(credentials: LoginDTO): Promise<User>;

  getCurrentUser(): Promise<User>;

  changePassword(credentials: ChangePasswordDTO): Promise<void>;

  requestPasswordReset(email: string): Promise<void>;

  resetPassword(credentials: ResetPasswordDTO): Promise<void>;

  logout(): Promise<void>;
}
