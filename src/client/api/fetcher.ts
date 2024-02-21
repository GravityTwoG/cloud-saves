export type MyRequestInit =
  | (Omit<RequestInit, "method" | "body"> & {
      body?: Record<string, unknown> | FormData;
    })
  | undefined;

class Fetcher {
  private readonly baseURL: string;
  private readonly credentials?: RequestCredentials;

  constructor(args: { baseURL: string; credentials?: RequestCredentials }) {
    this.baseURL = args.baseURL;
    this.credentials = args.credentials;
  }

  async get<R>(
    url: string,
    init?: Omit<RequestInit, "method" | "body"> | undefined
  ) {
    const response = await fetch(`${this.baseURL}${url}`, {
      credentials: this.credentials,
      ...init,
    });
    return response.json() as R;
  }

  async post<R>(url: string, init?: MyRequestInit) {
    const { body, ...restInit } = init || {};

    const response = await fetch(`${this.baseURL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: this.toFetchBody(body),
      credentials: this.credentials,
      ...restInit,
    });
    return response.json() as R;
  }

  async put<R>(url: string, init?: MyRequestInit) {
    const { body, ...restInit } = init || {};

    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: this.toFetchBody(body),
      credentials: this.credentials,
      ...restInit,
    });
    return response.json() as R;
  }

  async delete<R>(url: string) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      credentials: this.credentials,
    });
    return response.json() as R;
  }

  private toFetchBody(body?: Record<string, unknown> | FormData) {
    if (body instanceof FormData) {
      return body;
    }

    if (body === undefined) {
      return undefined;
    }

    return JSON.stringify(body);
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

console.log("API_BASE_URL", API_BASE_URL);

export const fetcher = new Fetcher({
  baseURL: API_BASE_URL,
  credentials: "include",
});
