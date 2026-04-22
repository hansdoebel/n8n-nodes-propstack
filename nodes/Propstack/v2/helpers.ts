import {
  type IDataObject,
  type IExecuteFunctions,
  type IHttpRequestOptions,
  type ILoadOptionsFunctions,
  type INodeExecutionData,
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
import { API_V2_BASE_URL } from "./constants";

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

export async function propstackV2Request(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  options: Partial<IHttpRequestOptions> = {},
) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  const opts: IHttpRequestOptions = {
    baseURL: API_V2_BASE_URL,
    ...options,
    headers,
  } as IHttpRequestOptions;

  try {
    return await this.helpers.httpRequestWithAuthentication.call(this, "propstackV2Api", opts);
  } catch (error) {
    const err = error as { message?: string; httpStatusCode?: number };
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: err.message,
      description: getDescriptionForStatusCode(err.httpStatusCode),
    });
  }
}

export async function paginate(
  this: IExecuteFunctions,
  options: {
    url: string;
    qs?: IDataObject;
    returnAll: boolean;
    limit: number;
    perPage?: number;
  },
): Promise<INodeExecutionData[]> {
  const perPage = options.perPage ?? 100;

  if (!options.returnAll) {
    const qs: IDataObject = { ...options.qs, per: options.limit, page: 1 };
    const response = await propstackV2Request.call(this, {
      method: "GET",
      url: options.url,
      qs,
    });
    const data = Array.isArray(response) ? response : [response];
    return this.helpers.returnJsonArray(data);
  }

  let allResults: IDataObject[] = [];
  let currentPage = 1;
  let total: number | undefined;
  let hasMore = true;

  while (hasMore) {
    const qs: IDataObject = {
      ...options.qs,
      per: perPage,
      page: currentPage,
    };
    if (currentPage === 1) qs.with_total = true;

    const response = await propstackV2Request.call(this, {
      method: "GET",
      url: options.url,
      qs,
    });

    if (currentPage === 1 && response && typeof response === "object" && !Array.isArray(response) && "total" in response) {
      total = response.total as number;
      const data = Array.isArray(response.data) ? response.data : [];
      allResults = allResults.concat(data);
    } else {
      const data = Array.isArray(response) ? response : [response];
      allResults = allResults.concat(data);
    }

    if (total !== undefined) {
      if (allResults.length >= total) hasMore = false;
    } else {
      const lastBatch = Array.isArray(response) ? response : (response?.data ?? [response]);
      if (lastBatch.length < perPage) hasMore = false;
    }

    if (hasMore) currentPage++;
  }

  return this.helpers.returnJsonArray(allResults);
}

export async function scrollAll(
  this: IExecuteFunctions,
  options: {
    url: string;
    qs?: IDataObject;
    perPage?: number;
  },
): Promise<INodeExecutionData[]> {
  const perPage = options.perPage ?? 100;
  let allResults: IDataObject[] = [];
  let scrollId: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const qs: IDataObject = { ...options.qs, per: perPage };
    if (scrollId) qs.scroll_id = scrollId;

    const response = await propstackV2Request.call(this, {
      method: "GET",
      url: options.url,
      qs,
    });

    const data = Array.isArray(response) ? response : (response?.data ?? []);
    if (!data.length) {
      hasMore = false;
      continue;
    }

    allResults = allResults.concat(data);
    scrollId = response?.scroll_id;
    if (!scrollId) hasMore = false;
  }

  return this.helpers.returnJsonArray(allResults);
}

type MappingValue =
  | string
  | ((v: unknown) => [string, unknown] | undefined);

export function buildQs(
  source: IDataObject,
  mapping: Record<string, MappingValue>,
): IDataObject {
  const qs: IDataObject = {};
  if (!source) return qs;

  for (const [field, mapTo] of Object.entries(mapping)) {
    const val = source[field as keyof IDataObject];
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

export function buildBody(
  this: IExecuteFunctions,
  paramName: string,
  directFields?: string[],
  csvFields?: string[],
  jsonFields?: string[],
): IDataObject {
  const body: IDataObject = {};
  const fields = this.getNodeParameter(paramName, 0, {}) as IDataObject;
  if (!fields) return body;

  if (directFields) {
    for (const f of directFields) {
      if (fields[f] !== undefined && fields[f] !== "") {
        body[f] = fields[f];
      }
    }
  }

  if (csvFields) {
    for (const f of csvFields) {
      if (fields[f] && typeof fields[f] === "string") {
        body[f] = (fields[f] as string).split(",").map((s) => s.trim());
      }
    }
  }

  if (jsonFields) {
    for (const f of jsonFields) {
      if (fields[f] && typeof fields[f] === "string") {
        try {
          body[f] = JSON.parse(fields[f] as string);
        } catch {
          body[f] = fields[f];
        }
      }
    }
  }

  return body;
}
