import {
  extractResourceLocatorValue,
  buildQs,
  buildBody,
  propstackV2Request,
} from "../../../nodes/Propstack/v2/helpers";
import {
  createMockExecuteFunctions,
  createMockLoadOptionsFunctions,
  getHttpRequestOptions,
} from "./testHelpers";

describe("extractResourceLocatorValue", () => {
  it("returns value from object", () => {
    expect(extractResourceLocatorValue({ value: "123" })).toBe("123");
  });

  it("returns string directly", () => {
    expect(extractResourceLocatorValue("456")).toBe("456");
  });

  it("returns number as string", () => {
    expect(extractResourceLocatorValue(789)).toBe("789");
  });

  it("handles resource locator object", () => {
    expect(extractResourceLocatorValue({ __rl: true, mode: "id", value: "42" })).toBe("42");
  });

  it("handles null", () => {
    expect(extractResourceLocatorValue(null)).toBe("");
  });

  it("handles undefined", () => {
    expect(extractResourceLocatorValue(undefined)).toBe("");
  });
});

describe("buildQs", () => {
  it("maps simple fields", () => {
    expect(buildQs({ q: "test" }, { q: "q" })).toEqual({ q: "test" });
  });

  it("skips undefined/empty", () => {
    expect(buildQs({ q: "" }, { q: "q" })).toEqual({});
  });

  it("handles booleans", () => {
    expect(buildQs({ done: true }, { done: "done" })).toEqual({ done: true });
  });

  it("handles arrays", () => {
    expect(buildQs({ ids: [1, 2, 3] }, { ids: "ids" })).toEqual({ ids: "1,2,3" });
  });

  it("handles function mappings", () => {
    const result = buildQs({ x: "val" }, { x: (v) => ["mapped", v] });
    expect(result).toEqual({ mapped: "val" });
  });
});

describe("propstackV2Request", () => {
  it("sends standard JSON headers", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: { ok: true },
    });
    await propstackV2Request.call(ctx, { method: "GET", url: "/v2/test" });
    const opts = getHttpRequestOptions(ctx);
    expect(opts.headers["Accept"]).toBe("application/json");
    expect(opts.headers["Content-Type"]).toBe("application/json");
  });

  it("uses base URL from constants", async () => {
    const ctx = createMockLoadOptionsFunctions({ httpResponse: {} });
    await propstackV2Request.call(ctx, { method: "GET", url: "/v2/test" });
    const opts = getHttpRequestOptions(ctx);
    expect(opts.baseURL).toBe("https://api.propstack.de");
  });

  it("delegates auth to httpRequestWithAuthentication with propstackV2Api", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: { ok: true },
    });
    await propstackV2Request.call(ctx, { method: "GET", url: "/v2/test" });
    const authMock = ctx.helpers.httpRequestWithAuthentication as unknown as {
      mock: { calls: unknown[][] };
    };
    expect(authMock.mock.calls[0]?.[0]).toBe("propstackV2Api");
  });
});

describe("buildBody", () => {
  it("builds body from additional fields", () => {
    const ctx = createMockExecuteFunctions({
      nodeParameters: {
        additionalFields: {
          name: "test",
          tags: "a,b,c",
          data: '{"k":"v"}',
        },
      },
    });
    const result = buildBody.call(ctx, "additionalFields", ["name"], ["tags"], ["data"]);
    expect(result).toEqual({
      name: "test",
      tags: ["a", "b", "c"],
      data: { k: "v" },
    });
  });
});
