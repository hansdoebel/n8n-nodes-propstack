import { API_ENDPOINTS } from "../../../nodes/Propstack/v1/constants";

/**
 * Returns the API token from the environment, or skips the test suite if not set.
 */
export function getApiToken(): string {
  const token = process.env.PROPSTACK_V1_API_TOKEN;
  if (!token) {
    throw new Error(
      "PROPSTACK_V1_API_TOKEN env var is required for integration tests. " +
        "Copy .env.example to .env and set your token.",
    );
  }
  return token;
}

/**
 * Make authenticated requests to the Propstack API.
 */
export async function apiRequest(opts: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: Record<string, unknown>;
  qs?: Record<string, string | number | boolean>;
}): Promise<unknown> {
  const token = getApiToken();
  const url = new URL(opts.path, API_ENDPOINTS.BASE_URL);

  if (opts.qs) {
    for (const [key, value] of Object.entries(opts.qs)) {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    "X-API-KEY": token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(url.toString(), {
    method: opts.method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${opts.method} ${opts.path} failed (${response.status}): ${text}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

/**
 * Wraps describe() to skip the entire suite when no API token is available.
 */
export const describeIf = (condition: boolean) =>
  condition ? describe : describe.skip;

export const hasApiToken = !!process.env.PROPSTACK_V1_API_TOKEN;
