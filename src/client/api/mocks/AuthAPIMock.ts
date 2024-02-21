import { User, UserRole } from "@/types";
import {
  ChangePasswordCredentials,
  IAuthAPI,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "../interfaces/IAuthAPI";

export class AuthAPIMock implements IAuthAPI {
  private sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  register = async (credentials: RegisterCredentials): Promise<User> => {
    await this.sleep(500);
    const userJSON = localStorage.getItem("user");
    if (userJSON) {
      const user = JSON.parse(userJSON);

      if (user.email === credentials.email) {
        throw new Error("User already exists");
      }
    }

    const user = { ...credentials, role: UserRole.USER };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(user));

    return {
      email: user.email,
      username: user.username,
      role: user.role,
    };
  };

  login = async (credentials: LoginCredentials): Promise<User> => {
    await this.sleep(500);
    const userJSON = localStorage.getItem("user");

    if (userJSON) {
      const user = JSON.parse(userJSON);
      if (
        user.username != credentials.username ||
        user.password != credentials.password
      ) {
        throw new Error("User not found");
      }

      localStorage.setItem("isAuthenticated", "true");
      return {
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } else {
      throw new Error("User not found");
    }
  };

  getCurrentUser = async (): Promise<User> => {
    await this.sleep(500);
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated || isAuthenticated === "false") {
      throw new Error("Not authenticated");
    }

    const user = JSON.parse(localStorage.getItem("user") || "");
    return user;
  };

  changePassword = async (
    credentials: ChangePasswordCredentials
  ): Promise<void> => {
    await this.sleep(500);
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated || isAuthenticated === "false") {
      throw new Error("Not authenticated");
    }

    const user = JSON.parse(localStorage.getItem("user") || "");
    if (user.password === credentials.oldPassword) {
      user.password = credentials.newPassword;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  requestPasswordReset = async (email: string): Promise<void> => {
    await this.sleep(500);
    const user = JSON.parse(localStorage.getItem("user") || "");
    if (user.email !== email) {
      throw new Error("User not found");
    }
  };

  resetPassword = async (
    credentials: ResetPasswordCredentials
  ): Promise<void> => {
    await this.sleep(500);
    const user = JSON.parse(localStorage.getItem("user") || "");
    if (user.blablabla === credentials.token) {
      user.password = credentials.newPassword;
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  logout = async (): Promise<void> => {
    localStorage.setItem("isAuthenticated", "false");
  };
}
