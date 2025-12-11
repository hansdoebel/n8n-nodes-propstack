import { describe, it, expect, mock as createMock } from "bun:test";
import { contactsCreate } from "../../../../nodes/Propstack/v1/resources/contacts/create";
import { contactsGet } from "../../../../nodes/Propstack/v1/resources/contacts/get";
import { contactsGetAll } from "../../../../nodes/Propstack/v1/resources/contacts/getAll";
import { contactsUpdate } from "../../../../nodes/Propstack/v1/resources/contacts/update";
import { contactsDelete } from "../../../../nodes/Propstack/v1/resources/contacts/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("contacts", () => {
  describe("create", () => {
    it("sends POST to /v1/contacts with client body", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            first_name: "John",
            last_name: "Doe",
            email: "john@example.com",
          },
        },
        httpResponse: { id: 1, first_name: "John", last_name: "Doe" },
      });

      const result = await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/contacts");
      expect(opts.body).toEqual({
        client: {
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
        },
      });
      expect(result).toHaveLength(1);
      expect(result[0].json.id).toBe(1);
    });

    it("handles empty additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { additionalFields: {} },
        httpResponse: { id: 2 },
      });

      const result = await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body).toEqual({ client: {} });
      expect(result).toHaveLength(1);
    });

    it("splits group_ids into array", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: { group_ids: "1, 2, 3" },
        },
        httpResponse: { id: 3 },
      });

      await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.group_ids).toEqual(["1", "2", "3"]);
    });

    it("parses custom fields JSON", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            partial_custom_fields: '{"field1": "value1"}',
          },
        },
        httpResponse: { id: 4 },
      });

      await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.partial_custom_fields).toEqual({ field1: "value1" });
    });

    it("passes through invalid JSON for custom fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            partial_custom_fields: "not-json",
          },
        },
        httpResponse: { id: 5 },
      });

      await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.partial_custom_fields).toBe("not-json");
    });

    it("skips empty string fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: { first_name: "Jane", email: "" },
        },
        httpResponse: { id: 6 },
      });

      await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.first_name).toBe("Jane");
      expect(opts.body.client.email).toBeUndefined();
    });

    it("includes GDPR status", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: { gdpr_status: 1 },
        },
        httpResponse: { id: 7 },
      });

      await contactsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.gdpr_status).toBe(1);
    });
  });

  describe("get", () => {
    it("sends GET to /v1/contacts/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: { value: "123" },
          additionalFields: {},
        },
        httpResponse: { id: 123, first_name: "John" },
      });

      const result = await contactsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/contacts/123");
      expect(result[0].json.id).toBe(123);
    });

    it("passes expand and include options", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: "42",
          additionalFields: {
            expand: true,
            include_children: true,
            include_documents: true,
            include_relationships: true,
            include_owned_properties: true,
          },
        },
        httpResponse: { id: 42 },
      });

      await contactsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.expand).toBe(true);
      expect(opts.qs.include_children).toBe(true);
      expect(opts.qs.include_documents).toBe(true);
      expect(opts.qs.include_relationships).toBe(true);
      expect(opts.qs.include_owned_properties).toBe(true);
    });

    it("works with string id directly", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: "99",
          additionalFields: {},
        },
        httpResponse: { id: 99 },
      });

      await contactsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.url).toBe("/v1/contacts/99");
    });
  });

  describe("getAll", () => {
    it("returns limited results when returnAll is false", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 25,
          additionalFields: {},
        },
        httpResponse: [{ id: 1 }, { id: 2 }],
      });

      const result = await contactsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/contacts");
      expect(opts.qs.per_page).toBe(25);
      expect(opts.qs.page).toBe(1);
      expect(result).toHaveLength(2);
    });

    it("paginates when returnAll is true", async () => {
      const httpRequest = createMock()
        .mockResolvedValueOnce(Array.from({ length: 100 }, (_, i) => ({ id: i + 1 })))
        .mockResolvedValueOnce([{ id: 101 }, { id: 102 }]);

      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: true,
          limit: 50,
          additionalFields: {},
        },
        httpResponse: [],
      });
      (mock.helpers as Record<string, unknown>).httpRequest = httpRequest;

      const result = await contactsGetAll.call(mock);

      expect(httpRequest).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(102);
    });

    it("passes filter parameters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          additionalFields: {
            q: "search term",
            email: "test@test.com",
            phone_number: "123",
            sort_by: "last_name",
            order: "asc",
            expand: true,
            archived: 1,
            gdpr_status: 2,
          },
        },
        httpResponse: [],
      });

      await contactsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.q).toBe("search term");
      expect(opts.qs.email).toBe("test@test.com");
      expect(opts.qs.phone_number).toBe("123");
      expect(opts.qs.sort_by).toBe("last_name");
      expect(opts.qs.order).toBe("asc");
      expect(opts.qs.expand).toBe(true);
      expect(opts.qs.archived).toBe(1);
      expect(opts.qs.gdpr_status).toBe(2);
    });

    it("splits comma-separated group, status, and sources", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          additionalFields: {
            group: "1, 2, 3",
            status: "active, inactive",
            sources: "web, import",
          },
        },
        httpResponse: [],
      });

      await contactsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.group).toEqual(["1", "2", "3"]);
      expect(opts.qs.status).toEqual(["active", "inactive"]);
      expect(opts.qs.sources).toEqual(["web", "import"]);
    });

    it("uses custom page parameter", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          additionalFields: { page: 3 },
        },
        httpResponse: [],
      });

      await contactsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.page).toBe(3);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/contacts/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: { value: "100" },
          additionalFields: { first_name: "Updated" },
        },
        httpResponse: { id: 100, first_name: "Updated" },
      });

      const result = await contactsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/contacts/100");
      expect(opts.body).toEqual({ client: { first_name: "Updated" } });
      expect(result[0].json.first_name).toBe("Updated");
    });

    it("handles group management fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: "50",
          additionalFields: {
            group_ids: "1,2",
            add_group_ids: "3, 4",
            sub_group_ids: "5",
          },
        },
        httpResponse: { id: 50 },
      });

      await contactsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.group_ids).toEqual(["1", "2"]);
      expect(opts.body.client.add_group_ids).toEqual(["3", "4"]);
      expect(opts.body.client.sub_group_ids).toEqual(["5"]);
    });

    it("parses custom fields JSON on update", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: "50",
          additionalFields: {
            partial_custom_fields: '{"key": "val"}',
          },
        },
        httpResponse: { id: 50 },
      });

      await contactsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.client.partial_custom_fields).toEqual({ key: "val" });
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/contacts/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          contactId: { value: "200" },
        },
        httpResponse: { success: true },
      });

      const result = await contactsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/contacts/200");
      expect(result).toHaveLength(1);
    });
  });
});
