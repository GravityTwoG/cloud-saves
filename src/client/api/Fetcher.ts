import { ApiError } from "./ApiError";

export type MyRequestInit =
  | (Omit<RequestInit, "method" | "body"> & {
      body?: Record<string, unknown> | FormData;
    })
  | undefined;

export class Fetcher {
  private readonly baseURL: string;
  private readonly credentials?: RequestCredentials;
  private onError?: (error: ApiError) => void;

  constructor(args: { baseURL: string; credentials?: RequestCredentials }) {
    this.baseURL = args.baseURL;
    this.credentials = args.credentials;
  }

  setOnError(callback: (error: ApiError) => void) {
    this.onError = callback;
  }

  async get<R>(
    url: string,
    init?: Omit<RequestInit, "method" | "body"> | undefined,
  ) {
    const response = await fetch(`${this.baseURL}${url}`, {
      credentials: this.credentials,

      ...init,
    });

    await this.handleError(response);

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

    await this.handleError(response);

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

    await this.handleError(response);

    return response.json() as R;
  }

  async patch<R>(url: string, init?: MyRequestInit) {
    const { body, ...restInit } = init || {};

    const response = await fetch(`${this.baseURL}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: this.toFetchBody(body),
      credentials: this.credentials,

      ...restInit,
    });

    await this.handleError(response);

    return response.json() as R;
  }

  async delete<R>(url: string) {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: "DELETE",
      credentials: this.credentials,
    });

    await this.handleError(response);

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

  private async handleError(response: Response) {
    if (!response.ok) {
      const error = new ApiError(`${response.status}:${response.statusText}`);

      try {
        const json = await response.json();
        error.message = json.message;
        error.cause = json;
      } catch (error) {
        console.log("response.json() error", error);
      }

      if (this.onError) {
        this.onError(error);
      }

      throw error;
    }
  }
}
