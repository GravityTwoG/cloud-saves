import { User, UserRole } from "@/types";
import { Fetcher } from "./Fetcher";
import {
  ChangePasswordDTO,
  IAuthAPI,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from "./interfaces/IAuthAPI";

export const roleMap = {
  ROLE_USER: UserRole.USER,
  ROLE_ADMIN: UserRole.ADMIN,
} as const;

export type ServerUser = {
  email: string;
  username: string;
  role: keyof typeof roleMap;
};

export class AuthAPI implements IAuthAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  onUnauthorized = (callback: () => void) => {
    this.fetcher.setOnError((error) => {
      if (error.message?.includes("401")) {
        callback();
      }
    });
  };

  register = async (credentials: RegisterDTO): Promise<User> => {
    await this.fetcher.post<ServerUser>("/auth/registration", {
      body: credentials,
    });

    return this.login({
      username: credentials.username,
      password: credentials.password,
    });
  };

  login = async (credentials: LoginDTO): Promise<User> => {
    const user = await this.fetcher.post<ServerUser>("/auth/login", {
      body: credentials,
    });

    return { ...user, role: roleMap[user.role], id: "TODO" };
  };

  getCurrentUser = async (): Promise<User> => {
    const user = await this.fetcher.get<ServerUser>("/auth/me");

    return { ...user, role: roleMap[user.role], id: "TODO" };
  };

  changePassword = (credentials: ChangePasswordDTO): Promise<void> => {
    return this.fetcher.post("/auth/auth-change-password", {
      body: {
        oldPassword: credentials.oldPassword,
        password: credentials.newPassword,
        repeatedPassword: credentials.newPassword,
      },
    });
  };

  requestPasswordReset = (email: string): Promise<void> => {
    return this.fetcher.post("/auth/recover-password", { body: { email } });
  };

  resetPassword = (credentials: ResetPasswordDTO): Promise<void> => {
    return this.fetcher.post("/auth/change-password", {
      body: {
        token: credentials.token,
        password: credentials.newPassword,
        repeatedPassword: credentials.newPassword,
      },
    });
  };

  logout = async (): Promise<void> => {
    try {
      await this.fetcher.post("/auth/logout");
    } catch (e) {
      if (
        e instanceof SyntaxError &&
        e.message === "Unexpected end of JSON input"
      ) {
        return;
      }

      throw e;
    }
  };
}
