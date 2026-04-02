import type { IDataObject } from "n8n-workflow";
import { extractResourceLocatorValue, buildQs, propstackRequest } from "../../../nodes/Propstack/v1/helpers";
import { createMockExecuteFunctions, createMockLoadOptionsFunctions, getHttpRequestOptions } from "./testHelpers";

describe("extractResourceLocatorValue", () => {
  it("extracts value from resource locator object", () => {
    expect(extractResourceLocatorValue({ value: "12345" })).toBe("12345");
  });

  it("extracts value from resource locator with mode", () => {
    expect(extractResourceLocatorValue({ mode: "id", value: "99" })).toBe("99");
  });

  it("returns string directly when given a string", () => {
    expect(extractResourceLocatorValue("42")).toBe("42");
  });

  it("returns string for number input", () => {
    expect(extractResourceLocatorValue(123)).toBe("123");
  });

  it("returns empty string for null", () => {
    expect(extractResourceLocatorValue(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(extractResourceLocatorValue(undefined)).toBe("");
  });

  it("returns empty string for object with undefined value", () => {
    expect(extractResourceLocatorValue({ value: undefined })).toBe("");
  });

  it("returns empty string for object with no value property", () => {
    expect(extractResourceLocatorValue({ mode: "list" })).toBe("");
  });

  it("converts numeric value in object to string", () => {
    expect(extractResourceLocatorValue({ value: 456 })).toBe("456");
  });
});

describe("buildQs", () => {
  it("returns empty object for null additional", () => {
    expect(buildQs(null as unknown as IDataObject, {})).toEqual({});
  });

  it("maps simple string field", () => {
    const result = buildQs({ email: "test@test.com" }, { email: "email" });
    expect(result).toEqual({ email: "test@test.com" });
  });

  it("skips undefined fields", () => {
    const result = buildQs({ email: undefined }, { email: "email" });
    expect(result).toEqual({});
  });

  it("skips empty string fields", () => {
    const result = buildQs({ email: "" }, { email: "email" });
    expect(result).toEqual({});
  });

  it("maps boolean fields", () => {
    const result = buildQs({ expand: true }, { expand: "expand" });
    expect(result).toEqual({ expand: true });
  });

  it("maps boolean false value", () => {
    const result = buildQs({ expand: false }, { expand: "expand" });
    expect(result).toEqual({ expand: false });
  });

  it("joins arrays with commas", () => {
    const result = buildQs({ ids: ["1", "2", "3"] }, { ids: "group_ids" });
    expect(result).toEqual({ group_ids: "1,2,3" });
  });

  it("skips empty arrays", () => {
    const result = buildQs({ ids: [] }, { ids: "group_ids" });
    expect(result).toEqual({});
  });

  it("handles function mapping", () => {
    const mapping = {
      sort: (v: unknown) => ["sort_by", v] as [string, unknown],
    };
    const result = buildQs({ sort: "name" }, mapping);
    expect(result).toEqual({ sort_by: "name" });
  });

  it("skips when function returns undefined", () => {
    const mapping = {
      sort: () => undefined,
    };
    const result = buildQs({ sort: "name" }, mapping);
    expect(result).toEqual({});
  });

  it("handles multiple fields", () => {
    const result = buildQs(
      { email: "a@b.com", phone: "123", name: "" },
      { email: "email", phone: "phone_number", name: "name" },
    );
    expect(result).toEqual({ email: "a@b.com", phone_number: "123" });
  });

  it("maps number fields", () => {
    const result = buildQs({ page: 2 }, { page: "page" });
    expect(result).toEqual({ page: 2 });
  });
});

describe("propstackRequest", () => {
  it("makes request with correct headers and base URL", async () => {
    const mock = createMockExecuteFunctions({
      httpResponse: { id: 1 },
    });

    await propstackRequest.call(mock, {
      method: "GET",
      url: "/v1/contacts",
    });

    const opts = getHttpRequestOptions(mock);
    expect(opts.baseURL).toBe("https://api.propstack.de");
    expect(opts.headers["X-API-KEY"]).toBe("test-api-token");
    expect(opts.headers.Accept).toBe("application/json");
    expect(opts.headers["Content-Type"]).toBe("application/json");
    expect(opts.method).toBe("GET");
    expect(opts.url).toBe("/v1/contacts");
  });

  it("merges custom headers", async () => {
    const mock = createMockExecuteFunctions({
      httpResponse: {},
    });

    await propstackRequest.call(mock, {
      method: "POST",
      url: "/v1/contacts",
      headers: { "X-Custom": "value" },
    });

    const opts = getHttpRequestOptions(mock);
    expect(opts.headers["X-Custom"]).toBe("value");
    expect(opts.headers["X-API-KEY"]).toBe("test-api-token");
  });

  it("throws error when API token is missing", async () => {
    const mock = createMockExecuteFunctions({
      credentials: { apiToken: "" },
    });

    await expect(propstackRequest.call(mock, { method: "GET", url: "/v1/contacts" }))
      .rejects.toThrow("propstackApi apiToken is required");
  });

  it("throws error when credentials have no apiToken", async () => {
    const mock = createMockExecuteFunctions({
      credentials: {},
    });

    await expect(propstackRequest.call(mock, {}))
      .rejects.toThrow("propstackApi apiToken is required");
  });

  it("passes body for POST requests", async () => {
    const mock = createMockExecuteFunctions({
      httpResponse: { id: 1 },
    });

    await propstackRequest.call(mock, {
      method: "POST",
      url: "/v1/contacts",
      body: { client: { first_name: "John" } },
    });

    const opts = getHttpRequestOptions(mock);
    expect(opts.body).toEqual({ client: { first_name: "John" } });
  });

  it("passes query string parameters", async () => {
    const mock = createMockExecuteFunctions({
      httpResponse: [],
    });

    await propstackRequest.call(mock, {
      method: "GET",
      url: "/v1/contacts",
      qs: { page: 1, per: 100 },
    });

    const opts = getHttpRequestOptions(mock);
    expect(opts.qs).toEqual({ page: 1, per: 100 });
  });

  it("works with ILoadOptionsFunctions context", async () => {
    const mock = createMockLoadOptionsFunctions({
      httpResponse: [{ id: 1, name: "Test" }],
    });

    const result = await propstackRequest.call(mock, {
      method: "GET",
      url: "/v1/contacts",
    });

    expect(result).toEqual([{ id: 1, name: "Test" }]);
  });

  it("uses default empty options", async () => {
    const mock = createMockExecuteFunctions({
      httpResponse: {},
    });

    await propstackRequest.call(mock);

    const opts = getHttpRequestOptions(mock);
    expect(opts.baseURL).toBe("https://api.propstack.de");
    expect(opts.headers["X-API-KEY"]).toBe("test-api-token");
  });
});
