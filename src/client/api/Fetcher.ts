import { ApiError } from "./ApiError";

export type MyRequestInit =
  | (Omit<RequestInit, "method" | "body"> & {
      body?: Record<string, unknown> | FormData;
    })
  | undefined;

export class Fetcher {
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

    this.handleError(response);

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

    this.handleError(response);

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

    this.handleError(response);

    return response.json() as R;
  }

  async delete<R>(url: string) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      credentials: this.credentials,
    });

    this.handleError(response);

    return response.json() as R;
  }

  getBaseURL() {
    return this.baseURL;
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

  private handleError(response: Response) {
    if (!response.ok) {
      throw new ApiError(`${response.status}:${response.statusText}`);
    }
  }
}
