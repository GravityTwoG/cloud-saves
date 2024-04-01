import { User, UserRole } from "@/types";
import {
  ChangePasswordDTO,
  IAuthAPI,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
} from "../interfaces/IAuthAPI";
import { ApiError } from "../ApiError";
import { LocalStorage } from "./LocalStorage";

const ls = new LocalStorage("users_mock");

export class AuthAPIMock implements IAuthAPI {
  private sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  register = async (credentials: RegisterDTO): Promise<User> => {
    await this.sleep(500);
    const user = {
      ...credentials,
      role: UserRole.USER,
      isBlocked: false,
      id: Math.random().toString(),
    };

    try {
      const users = ls.getItem<User[]>("users");

      const userExists = !!users.find(
        (user: User) =>
          user.email === credentials.email ||
          user.username === credentials.username
      );

      if (userExists) {
        throw new ApiError("User already exists");
      }

      users.push(user);

      ls.setItem("users", users);
    } catch (error) {
      const admin = {
        email: "admin@example.com",
        username: "admin",
        password: "12121212",
        role: UserRole.ADMIN,
        isBlocked: false,
        id: Math.random().toString(),
      };
      ls.setItem("users", [user, admin]);
    }

    ls.setItem("isAuthenticated", "true");
    ls.setItem("user", user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  };

  login = async (credentials: LoginDTO): Promise<User> => {
    await this.sleep(500);
    try {
      const users = ls.getItem<(User & { password: string })[]>("users");
      const user = users.find(
        (user) =>
          user.username === credentials.username &&
          user.password === credentials.password
      );

      if (!user) {
        throw new ApiError("User not found");
      }

      ls.setItem("isAuthenticated", "true");
      ls.setItem("user", user);
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch (error) {
      throw new ApiError("User not found");
    }
  };

  getCurrentUser = async (): Promise<User> => {
    await this.sleep(500);
    const isAuthenticated = ls.getItem<string>("isAuthenticated");

    if (!isAuthenticated || isAuthenticated === "false") {
      throw new ApiError("Not authenticated");
    }

    const user = ls.getItem<User>("user");
    return user;
  };

  changePassword = async (credentials: ChangePasswordDTO): Promise<void> => {
    await this.sleep(500);
    console.log("changePassword", credentials);
    throw new ApiError("Not implemented");
  };

  requestPasswordReset = async (email: string): Promise<void> => {
    await this.sleep(500);
    console.log("requestPasswordReset", email);

    throw new ApiError("Not implemented");
  };

  resetPassword = async (credentials: ResetPasswordDTO): Promise<void> => {
    await this.sleep(500);
    console.log("resetPassword", credentials);

    throw new ApiError("Not implemented");
  };

  logout = async (): Promise<void> => {
    ls.setItem("isAuthenticated", "false");
    ls.setItem("user", "");
  };
}
