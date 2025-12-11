import { mock } from "bun:test";
import type {
  IDataObject,
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INode,
} from "n8n-workflow";

export function createMockExecuteFunctions(opts: {
  nodeParameters?: Record<string, unknown>;
  credentials?: Record<string, unknown>;
  httpResponse?: unknown;
}): IExecuteFunctions {
  const {
    nodeParameters = {},
    credentials = { apiToken: "test-api-token" },
    httpResponse = {},
  } = opts;

  const helpers = {
    httpRequest: mock().mockResolvedValue(httpResponse),
    returnJsonArray: mock((data: IDataObject | IDataObject[]) => {
      const items = Array.isArray(data) ? data : [data];
      return items.map((json) => ({ json, pairedItem: { item: 0 } }));
    }),
  };

  const ctx = {
    getNodeParameter: mock((name: string, _index: number, fallback?: unknown) => {
      if (name in nodeParameters) return nodeParameters[name];
      return fallback;
    }),
    getCredentials: mock().mockResolvedValue(credentials),
    getNode: mock().mockReturnValue({ name: "Propstack" } as INode),
    helpers,
  } as unknown as IExecuteFunctions;

  return ctx;
}

export function createMockLoadOptionsFunctions(opts: {
  credentials?: Record<string, unknown>;
  httpResponse?: unknown;
}): ILoadOptionsFunctions {
  const {
    credentials = { apiToken: "test-api-token" },
    httpResponse = [],
  } = opts;

  const helpers = {
    httpRequest: mock().mockResolvedValue(httpResponse),
  };

  const ctx = {
    getCredentials: mock().mockResolvedValue(credentials),
    helpers,
  } as unknown as ILoadOptionsFunctions;

  return ctx;
}

export function getHttpRequestOptions(ctx: IExecuteFunctions | ILoadOptionsFunctions) {
  return (ctx.helpers.httpRequest as ReturnType<typeof mock>).mock.calls[0]?.[0];
}

export function getAllHttpRequestCalls(ctx: IExecuteFunctions | ILoadOptionsFunctions) {
  return (ctx.helpers.httpRequest as ReturnType<typeof mock>).mock.calls.map(
    (call: unknown[]) => call[0],
  );
}
