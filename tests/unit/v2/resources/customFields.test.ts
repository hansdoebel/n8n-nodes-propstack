import { customFieldsGet } from "../../../../nodes/Propstack/v2/resources/customFields/get";
import { customFieldsGetAll } from "../../../../nodes/Propstack/v2/resources/customFields/getAll";
import { customFieldsCreate } from "../../../../nodes/Propstack/v2/resources/customFields/create";
import { customFieldsUpdate } from "../../../../nodes/Propstack/v2/resources/customFields/update";
import { customFieldsDelete } from "../../../../nodes/Propstack/v2/resources/customFields/delete";
import { customFieldsCreateOption } from "../../../../nodes/Propstack/v2/resources/customFields/createOption";
import { customFieldsDeleteOption } from "../../../../nodes/Propstack/v2/resources/customFields/deleteOption";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("customFields", () => {
  describe("get", () => {
    it("sends GET to /v2/custom_fields/5", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { customFieldId: "5" },
        httpResponse: { id: 5 },
      });

      const result = await customFieldsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/custom_fields/5");
      expect(result).toHaveLength(1);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v2/custom_fields with filters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          filters: { entity: "for_clients" },
        },
        httpResponse: [{ id: 1 }],
      });

      await customFieldsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/custom_fields");
      expect(opts.qs.entity).toBe("for_clients");
    });
  });

  describe("create", () => {
    it("sends POST to /v2/custom_fields with required and additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          customFieldGroupId: "10",
          fieldName: "Rating",
          additionalFields: { field_type: "number" },
        },
        httpResponse: { id: 1 },
      });

      const result = await customFieldsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/custom_fields");
      expect(opts.body.custom_field_group_id).toBe("10");
      expect(opts.body.name).toBe("Rating");
      expect(opts.body.field_type).toBe("number");
      expect(result).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/custom_fields/5 with update fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          customFieldId: "5",
          additionalFields: { name: "New Name" },
        },
        httpResponse: { id: 5 },
      });

      const result = await customFieldsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/custom_fields/5");
      expect(opts.body.name).toBe("New Name");
      expect(result).toHaveLength(1);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/custom_fields/5", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { customFieldId: "5" },
        httpResponse: {},
      });

      const result = await customFieldsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/custom_fields/5");
      expect(result).toHaveLength(1);
      expect(result[0].json.deleted).toBe(true);
    });
  });

  describe("createOption", () => {
    it("sends POST to /v2/custom_fields/5/custom_options", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          customFieldId: "5",
          optionName: "High",
        },
        httpResponse: { id: 1, name: "High" },
      });

      const result = await customFieldsCreateOption.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/custom_fields/5/custom_options");
      expect(opts.body.name).toBe("High");
      expect(result).toHaveLength(1);
    });
  });

  describe("deleteOption", () => {
    it("sends DELETE to /v2/custom_fields/5/custom_options/8", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          customFieldId: "5",
          customOptionId: "8",
        },
        httpResponse: {},
      });

      const result = await customFieldsDeleteOption.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/custom_fields/5/custom_options/8");
      expect(result).toHaveLength(1);
      expect(result[0].json.deleted).toBe(true);
    });
  });
});
