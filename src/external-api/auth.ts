import { User } from "../types";

export async function register(email: string, password: string): Promise<User> {
  return { email };
}

export async function login(email: string, password: string): Promise<User> {
  return {
    email,
  };
}

export async function logout(): void {}
