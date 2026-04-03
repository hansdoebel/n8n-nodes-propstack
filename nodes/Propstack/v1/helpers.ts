import {
  type IDataObject,
  type IExecuteFunctions,
  type IHookFunctions,
  type IHttpRequestOptions,
  type ILoadOptionsFunctions,
  type JsonObject,
  NodeApiError,
} from "n8n-workflow";

export function simplifyResponse(items: IDataObject[], fields: string[]): IDataObject[] {
  return items.map((item) => {
    const simplified: IDataObject = {};
    for (const field of fields) {
      if (item[field] !== undefined) {
        simplified[field] = item[field];
      }
    }
    return simplified;
  });
}
import { API_ENDPOINTS } from "./constants";

function getDescriptionForStatusCode(statusCode?: number): string | undefined {
  if (!statusCode) return undefined;
  if (statusCode === 401) return "Check that your API key is valid";
  if (statusCode === 403) return "You don't have permission to access this resource";
  if (statusCode === 404) return "The requested resource was not found";
  if (statusCode === 429) return "Rate limit exceeded. Wait before retrying";
  if (statusCode >= 500) return "The Propstack API is experiencing issues. Try again later";
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractResourceLocatorValue(value: any): string {
  if (typeof value === "object" && value !== null) {
    return String(value.value ?? "");
  }
  return String(value ?? "");
}

export async function propstackRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  options: Partial<IHttpRequestOptions> = {},
) {
  const credentials = await this.getCredentials("propstackApi");
  const apiToken = credentials?.apiToken as string;

  if (!apiToken) {
    throw new Error("propstackApi apiToken is required");
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
    "X-API-KEY": apiToken,
  };

  const opts: IHttpRequestOptions = {
    baseURL: API_ENDPOINTS.BASE_URL,
    ...options,
    headers,
  } as IHttpRequestOptions;

  try {
    return await this.helpers.httpRequest!(opts);
  } catch (error) {
    const err = error as { message?: string; httpStatusCode?: number };
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: err.message,
      description: getDescriptionForStatusCode(err.httpStatusCode),
    });
  }
}

type MappingValue =
  | string
  | ((v: unknown) => [string, unknown] | undefined);

export const splitCsvInt =
  (key: string) =>
  (v: unknown): [string, unknown] => [key, (v as string).split(",").map((s) => parseInt(s.trim(), 10))];

export const toInt =
  (key: string) =>
  (v: unknown): [string, unknown] => [key, parseInt(v as string, 10)];

export const splitCsv =
  (key: string) =>
  (v: unknown): [string, unknown] => [key, (v as string).split(",").map((s) => s.trim())];

export const parseJson =
  (key: string) =>
  (v: unknown): [string, unknown] => {
    try {
      return [key, JSON.parse(v as string)];
    } catch {
      return [key, v];
    }
  };

export function buildQs(
  additional: IDataObject,
  mapping: Record<string, MappingValue>,
): IDataObject {
  const qs: IDataObject = {};
  if (!additional) return qs;

  for (const [field, mapTo] of Object.entries(mapping)) {
    const val = additional[field as keyof IDataObject];
    if (val === undefined || val === "") continue;

    if (typeof mapTo === "function") {
      const pair = mapTo(val);
      if (!pair) continue;
      const [k, v] = pair;
      if (v !== undefined) qs[k] = v;
      continue;
    }

    const key = mapTo;
    if (Array.isArray(val)) {
      if (val.length) qs[key] = val.join(",");
      continue;
    }

    if (typeof val === "boolean") {
      qs[key] = val;
      continue;
    }

    qs[key] = val;
  }

  return qs;
}


