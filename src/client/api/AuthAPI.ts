import { User, UserRole } from "@/types";
import { Fetcher } from "./Fetcher";
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
  role: keyof typeof roleMap;
};

export class AuthAPI implements IAuthAPI {
  private readonly fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  register = async (credentials: RegisterCredentials): Promise<User> => {
    await this.fetcher.post<ServerUser>("/auth/registration", {
      body: credentials,
    });

    return this.login(credentials);
  };

  login = async (credentials: LoginCredentials): Promise<User> => {
    const user = await this.fetcher.post<ServerUser>("/auth/login", {
      body: credentials,
    });

    return { ...user, role: roleMap[user.role] };
  };

  getCurrentUser = async (): Promise<User> => {
    const user = await this.fetcher.get<ServerUser>("/auth/me");

    return { ...user, role: roleMap[user.role] };
  };

  changePassword = (credentials: ChangePasswordCredentials): Promise<void> => {
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

  resetPassword = (credentials: ResetPasswordCredentials): Promise<void> => {
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
