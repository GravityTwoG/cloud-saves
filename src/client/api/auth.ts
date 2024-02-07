import { User } from "../../types";
import { fetcher } from "./fetcher";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

export async function register(
  credentials: RegisterCredentials
): Promise<User> {
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
  return fetcher.post<User>("/auth/register", { body: credentials });
}

export async function login(credentials: LoginCredentials): Promise<User> {
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
      email: credentials.email,
      username: "$USERNAME$",
    };
  } else {
    throw new Error("User not found");
  }

  return fetcher.post<User>("/auth/login", { body: credentials });
}

export async function getCurrentUser(): Promise<User> {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (!isAuthenticated || isAuthenticated === "false") {
    throw new Error("Not authenticated");
  }

  const user = JSON.parse(localStorage.getItem("user") || "");
  return user;

  return fetcher.get<User>("/auth/me");
}

export async function logout(): Promise<void> {
  localStorage.setItem("isAuthenticated", "false");
  return;

  // await fetcher.post("/auth/logout");
}
