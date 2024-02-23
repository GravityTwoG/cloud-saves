import { User, UserRole } from "@/types";
import {
  ChangePasswordCredentials,
  IAuthAPI,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordCredentials,
} from "../interfaces/IAuthAPI";
import { ApiError } from "../ApiError";

export class AuthAPIMock implements IAuthAPI {
  private sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  register = async (credentials: RegisterCredentials): Promise<User> => {
    await this.sleep(500);
    const user = { ...credentials, role: UserRole.USER };

    const usersJSON = localStorage.getItem("users");
    if (usersJSON) {
      const users = JSON.parse(usersJSON);
      const userExists = !!users.find(
        (user: User) =>
          user.email === credentials.email ||
          user.username === credentials.username
      );

      if (userExists) {
        throw new ApiError("User already exists");
      }

      users.push(user);

      localStorage.setItem("users", JSON.stringify(users));
    } else {
      const admin = {
        email: "admin@example.com",
        username: "admin",
        password: "12121212",
        role: UserRole.ADMIN,
      };
      localStorage.setItem("users", JSON.stringify([user, admin]));
    }

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
    const usersJSON = localStorage.getItem("users");

    if (usersJSON) {
      const users = JSON.parse(usersJSON);
      const user = users.find(
        (user: User & { password: string }) =>
          user.username === credentials.username &&
          user.password === credentials.password
      );

      if (!user) {
        throw new ApiError("User not found");
      }

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));
      return {
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } else {
      throw new ApiError("User not found");
    }
  };

  getCurrentUser = async (): Promise<User> => {
    await this.sleep(500);
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated || isAuthenticated === "false") {
      throw new ApiError("Not authenticated");
    }

    const user = JSON.parse(localStorage.getItem("user") || "");
    return user;
  };

  changePassword = async (
    credentials: ChangePasswordCredentials
  ): Promise<void> => {
    await this.sleep(500);
    console.log("changePassword", credentials);
    throw new ApiError("Not implemented");
  };

  requestPasswordReset = async (email: string): Promise<void> => {
    await this.sleep(500);
    console.log("requestPasswordReset", email);

    throw new ApiError("Not implemented");
  };

  resetPassword = async (
    credentials: ResetPasswordCredentials
  ): Promise<void> => {
    await this.sleep(500);
    console.log("resetPassword", credentials);

    throw new ApiError("Not implemented");
  };

  logout = async (): Promise<void> => {
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("user", "");
  };
}
