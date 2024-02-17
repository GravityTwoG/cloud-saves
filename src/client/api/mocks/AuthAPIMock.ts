import { User, UserRole } from "@/types";
import { IAuthAPI, LoginCredentials, RegisterCredentials } from "../IAuthAPI";

export class AuthAPIMock implements IAuthAPI {
  register = async (credentials: RegisterCredentials): Promise<User> => {
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
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated || isAuthenticated === "false") {
      throw new Error("Not authenticated");
    }

    const user = JSON.parse(localStorage.getItem("user") || "");
    return user;
  };

  logout = async (): Promise<void> => {
    localStorage.setItem("isAuthenticated", "false");
  };
}
