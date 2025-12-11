import {
  searchClients,
  searchProperties,
  searchProjects,
  searchBrokers,
  searchClientProperties,
  searchCustomFields,
  searchSnippets,
  searchRelationships,
} from "../../../nodes/Propstack/v2/listSearch";
import { createMockLoadOptionsFunctions, getHttpRequestOptions } from "./testHelpers";

describe("searchClients", () => {
  it("maps clients to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, first_name: "John", last_name: "Doe" },
        { id: 2, first_name: "Jane" },
      ],
    });
    const result = await searchClients.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "John Doe", value: "1" });
    expect(result.results[1]).toEqual({ name: "Jane", value: "2" });
  });

  it("uses server-side q filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [{ id: 1, first_name: "John", last_name: "Doe" }],
    });
    await searchClients.call(ctx, "john");
    const opts = getHttpRequestOptions(ctx);
    expect(opts.qs.q).toBe("john");
  });
});

describe("searchProperties", () => {
  it("maps properties to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 10, title: "Main Street 5" },
        { id: 20, title: "Park Avenue 12" },
      ],
    });
    const result = await searchProperties.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "Main Street 5", value: "10" });
    expect(result.results[1]).toEqual({ name: "Park Avenue 12", value: "20" });
  });

  it("uses server-side q filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [{ id: 10, title: "Main Street 5" }],
    });
    await searchProperties.call(ctx, "main");
    const opts = getHttpRequestOptions(ctx);
    expect(opts.qs.q).toBe("main");
  });
});

describe("searchProjects", () => {
  it("maps projects to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, name: "Alpha Project" },
        { id: 2, title: "Beta Project" },
      ],
    });
    const result = await searchProjects.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "Alpha Project", value: "1" });
    expect(result.results[1]).toEqual({ name: "Beta Project", value: "2" });
  });

  it("applies client-side filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, name: "Alpha Project" },
        { id: 2, name: "Beta Project" },
      ],
    });
    const result = await searchProjects.call(ctx, "alpha");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({ name: "Alpha Project", value: "1" });
  });
});

describe("searchBrokers", () => {
  it("maps brokers to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, first_name: "Max", last_name: "Broker" },
        { id: 2, first_name: "Anna" },
      ],
    });
    const result = await searchBrokers.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "Max Broker", value: "1" });
    expect(result.results[1]).toEqual({ name: "Anna", value: "2" });
  });

  it("applies client-side filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, first_name: "Max", last_name: "Broker" },
        { id: 2, first_name: "Anna" },
      ],
    });
    const result = await searchBrokers.call(ctx, "max");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({ name: "Max Broker", value: "1" });
  });
});

describe("searchClientProperties", () => {
  it("maps client properties to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        {
          id: 100,
          client: { first_name: "John", last_name: "Doe" },
          property: { title: "Main St 1" },
        },
        {
          id: 200,
          client: { first_name: "Jane" },
          property: {},
        },
      ],
    });
    const result = await searchClientProperties.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({
      name: "Deal #100 - John Doe - Main St 1",
      value: "100",
    });
    expect(result.results[1]).toEqual({
      name: "Deal #200 - Jane",
      value: "200",
    });
  });

  it("applies client-side filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 100, client: { first_name: "John" }, property: {} },
        { id: 200, client: { first_name: "Jane" }, property: {} },
      ],
    });
    const result = await searchClientProperties.call(ctx, "jane");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].value).toBe("200");
  });
});

describe("searchCustomFields", () => {
  it("maps custom fields to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, name: "Color" },
        { id: 2, name: "Size" },
      ],
    });
    const result = await searchCustomFields.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "Color", value: "1" });
    expect(result.results[1]).toEqual({ name: "Size", value: "2" });
  });

  it("applies client-side filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, name: "Color" },
        { id: 2, name: "Size" },
      ],
    });
    const result = await searchCustomFields.call(ctx, "color");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({ name: "Color", value: "1" });
  });
});

describe("searchSnippets", () => {
  it("maps snippets to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, name: "Welcome Email" },
        { id: 2, name: "Follow Up" },
      ],
    });
    const result = await searchSnippets.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "Welcome Email", value: "1" });
    expect(result.results[1]).toEqual({ name: "Follow Up", value: "2" });
  });

  it("applies client-side filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, name: "Welcome Email" },
        { id: 2, name: "Follow Up" },
      ],
    });
    const result = await searchSnippets.call(ctx, "welcome");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({ name: "Welcome Email", value: "1" });
  });
});

describe("searchRelationships", () => {
  it("maps relationships to name/value results", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, internal_name: "Owner" },
        { id: 2, internal_name: "Tenant" },
      ],
    });
    const result = await searchRelationships.call(ctx);
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toEqual({ name: "Owner", value: "1" });
    expect(result.results[1]).toEqual({ name: "Tenant", value: "2" });
  });

  it("applies client-side filter", async () => {
    const ctx = createMockLoadOptionsFunctions({
      httpResponse: [
        { id: 1, internal_name: "Owner" },
        { id: 2, internal_name: "Tenant" },
      ],
    });
    const result = await searchRelationships.call(ctx, "owner");
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toEqual({ name: "Owner", value: "1" });
  });
});
