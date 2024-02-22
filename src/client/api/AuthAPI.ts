import { User, UserRole } from "@/types";
import { fetcher } from "./fetcher";
import {
  ChangePasswordCredentials,
  IAuthAPI,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "./interfaces/IAuthAPI";

const roleMap = {
  ROLE_USER: UserRole.USER,
  ROLE_ADMIN: UserRole.ADMIN,
} as const;

type ServerUser = {
  email: string;
  username: string;
  role: {
    id: number;
    name: keyof typeof roleMap;
  };
};

export class AuthAPI implements IAuthAPI {
  register = async (credentials: RegisterCredentials): Promise<User> => {
    await fetcher.post<ServerUser>("/auth/registration", {
      body: credentials,
    });

    return this.login(credentials);
  };

  login = async (credentials: LoginCredentials): Promise<User> => {
    const user = await fetcher.post<ServerUser>("/auth/login", {
      body: credentials,
    });

    return { ...user, role: roleMap[user.role.name] };
  };

  getCurrentUser = async (): Promise<User> => {
    const user = await fetcher.get<ServerUser>("/auth/me");

    return { ...user, role: roleMap[user.role.name] };
  };

  changePassword = (credentials: ChangePasswordCredentials): Promise<void> => {
    return fetcher.post("/auth/change-password", { body: credentials });
  };

  requestPasswordReset = (email: string): Promise<void> => {
    return fetcher.post("/auth/recover-password", { body: { email } });
  };

  resetPassword = (credentials: ResetPasswordCredentials): Promise<void> => {
    return fetcher.post("/auth/reset-password", { body: credentials });
  };

  logout = async (): Promise<void> => {
    return;
    await fetcher.post("/auth/logout");
  };
}
