import { User } from "@/types";
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

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(credentials));

    return { email: credentials.email, username: credentials.username };
  };
  login = async (credentials: LoginCredentials): Promise<User> => {
    const userJSON = localStorage.getItem("user");

    if (userJSON) {
      const user = JSON.parse(userJSON);
      if (
        user.email != credentials.email ||
        user.password != credentials.password
      ) {
        throw new Error("User not found");
      }

      localStorage.setItem("isAuthenticated", "true");
      return {
        email: user.email,
        username: user.username,
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
