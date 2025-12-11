import { describe, it, expect, mock as createMock } from "bun:test";
import {
  createMockExecuteFunctions,
  getHttpRequestOptions,
} from "../testHelpers";
import { clientsGet } from "../../../../nodes/Propstack/v2/resources/clients/get";
import { clientsGetAll } from "../../../../nodes/Propstack/v2/resources/clients/getAll";
import { clientsCreate } from "../../../../nodes/Propstack/v2/resources/clients/create";
import { clientsUpdate } from "../../../../nodes/Propstack/v2/resources/clients/update";
import { clientsDelete } from "../../../../nodes/Propstack/v2/resources/clients/delete";
import { clientsScroll } from "../../../../nodes/Propstack/v2/resources/clients/scroll";
import { clientsGetDeleted } from "../../../../nodes/Propstack/v2/resources/clients/getDeleted";

describe("clients resource", () => {
  describe("get", () => {
    it("sends GET to /v2/clients/123", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { clientId: "123" },
        httpResponse: { id: 123, first_name: "John" },
      });
      const result = await clientsGet.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/clients/123");
      expect(result[0].json.id).toBe(123);
    });

    it("works with resource locator object", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { clientId: { value: "123" } },
        httpResponse: { id: 123, first_name: "John" },
      });
      const result = await clientsGet.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/clients/123");
      expect(result[0].json.id).toBe(123);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v2/clients with qs params", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 25,
          filters: { q: "test" },
        },
        httpResponse: [{ id: 1, first_name: "Test" }],
      });
      const result = await clientsGetAll.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/clients");
      expect(opts.qs.per).toBe(25);
      expect(opts.qs.q).toBe("test");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("create", () => {
    it("sends POST to /v2/clients with body fields", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            first_name: "John",
            last_name: "Doe",
            group_ids: "1,2",
            partial_custom_fields: '{"key":"val"}',
          },
        },
        httpResponse: { id: 1, first_name: "John", last_name: "Doe" },
      });
      const result = await clientsCreate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/clients");
      expect(opts.body.first_name).toBe("John");
      expect(opts.body.last_name).toBe("Doe");
      expect(opts.body.group_ids).toEqual(["1", "2"]);
      expect(opts.body.partial_custom_fields).toEqual({ key: "val" });
      expect(result[0].json.id).toBe(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/clients/123 with body", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          clientId: "123",
          additionalFields: { first_name: "Jane" },
        },
        httpResponse: { id: 123, first_name: "Jane" },
      });
      const result = await clientsUpdate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/clients/123");
      expect(opts.body.first_name).toBe("Jane");
      expect(result[0].json.first_name).toBe("Jane");
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/clients/123", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { clientId: "123" },
        httpResponse: {},
      });
      const result = await clientsDelete.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/clients/123");
      expect(result[0].json.deleted).toBe(true);
    });
  });

  describe("scroll", () => {
    it("sends GET to /v2/clients/scroll with qs", async () => {
      const httpMock = createMock()
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([]);
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          filters: { updated_at_from: "2024-01-01" },
        },
        httpResponse: [],
      });
      (ctx.helpers as Record<string, unknown>).httpRequest = httpMock;
      const result = await clientsScroll.call(ctx);
      const opts = httpMock.mock.calls[0][0];
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/clients/scroll");
      expect(opts.qs.updated_at_from).toBe("2024-01-01");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getDeleted", () => {
    it("sends GET to /v2/clients/deleted with qs", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 10,
          filters: {},
        },
        httpResponse: [{ id: 1, deleted: true }],
      });
      const result = await clientsGetDeleted.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/clients/deleted");
      expect(opts.qs.per).toBe(10);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
