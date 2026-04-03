import { propertiesCreate } from "../../../../nodes/Propstack/v1/resources/properties/create";
import { propertiesGet } from "../../../../nodes/Propstack/v1/resources/properties/get";
import { propertiesGetAll } from "../../../../nodes/Propstack/v1/resources/properties/getAll";
import { propertiesUpdate } from "../../../../nodes/Propstack/v1/resources/properties/update";
import { propertiesDelete } from "../../../../nodes/Propstack/v1/resources/properties/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("properties", () => {
  describe("create", () => {
    it("sends POST to /v1/units with required and optional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          object_type: "LIVING",
          rs_type: "APARTMENT",
          marketing_type: "BUY",
          additionalFields: {
            title: "Nice Apartment",
            price: 250000,
          },
        },
        httpResponse: { id: 1, title: "Nice Apartment" },
      });

      const result = await propertiesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/units");
      expect(opts.body.property.object_type).toBe("LIVING");
      expect(opts.body.property.rs_type).toBe("APARTMENT");
      expect(opts.body.property.marketing_type).toBe("BUY");
      expect(opts.body.property.title).toBe("Nice Apartment");
      expect(opts.body.property.price).toBe(250000);
      expect(result).toHaveLength(1);
    });

    it("sends required fields even with empty additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          object_type: "COMMERCIAL",
          rs_type: "OFFICE",
          marketing_type: "RENT",
          additionalFields: {},
        },
        httpResponse: { id: 2 },
      });

      await propertiesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.property.object_type).toBe("COMMERCIAL");
      expect(opts.body.property.rs_type).toBe("OFFICE");
      expect(opts.body.property.marketing_type).toBe("RENT");
    });

    it("parses custom fields JSON", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          object_type: "LIVING",
          rs_type: "APARTMENT",
          marketing_type: "BUY",
          additionalFields: {
            partial_custom_fields: '{"my_field": "value"}',
          },
        },
        httpResponse: { id: 3 },
      });

      await propertiesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.property.partial_custom_fields).toEqual({ my_field: "value" });
    });

    it("parses relationships JSON", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          object_type: "LIVING",
          rs_type: "HOUSE",
          marketing_type: "BUY",
          additionalFields: {
            relationships_attributes: '[{"internal_name":"owner","related_client_id":123}]',
          },
        },
        httpResponse: { id: 4 },
      });

      await propertiesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.property.relationships_attributes).toEqual([
        { internal_name: "owner", related_client_id: 123 },
      ]);
    });
  });

  describe("get", () => {
    it("sends GET to /v1/units/{id} with new=1 by default", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: { value: "10" },
          simplify: false,
          additionalFields: {},
        },
        httpResponse: { id: 10, title: "Studio" },
      });

      const result = await propertiesGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/units/10");
      expect(opts.qs.new).toBe(1);
      expect(result[0].json.title).toBe("Studio");
    });

    it("simplifies response", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: { value: "10" },
          simplify: true,
          additionalFields: {},
        },
        httpResponse: {
          id: 10,
          title: "Studio",
          city: "Berlin",
          broker_id: 5,
          description_note: "long",
        },
      });

      const result = await propertiesGet.call(mock);

      expect(result[0].json.title).toBe("Studio");
      expect(result[0].json.city).toBe("Berlin");
      expect(result[0].json).not.toHaveProperty("broker_id");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/units and extracts data array", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 20,
          simplify: false,
          additionalFields: {},
        },
        httpResponse: { data: [{ id: 1 }, { id: 2 }], meta: { total_count: 2 } },
      });

      const result = await propertiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/units");
      expect(opts.qs.per).toBe(20);
      expect(opts.qs.with_meta).toBe(1);
      expect(result).toHaveLength(2);
    });

    it("passes filter parameters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          simplify: false,
          additionalFields: {
            marketing_type: "RENT",
            rs_type: "APARTMENT",
            price_from: 100000,
            price_to: 500000,
            q: "Berlin",
          },
        },
        httpResponse: { data: [] },
      });

      await propertiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.marketing_type).toBe("RENT");
      expect(opts.qs.rs_type).toBe("APARTMENT");
      expect(opts.qs.price_from).toBe(100000);
      expect(opts.qs.price_to).toBe(500000);
      expect(opts.qs.q).toBe("Berlin");
    });

    it("skips zero-value range fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          simplify: false,
          additionalFields: {
            price_from: 0,
            living_space_from: 50,
          },
        },
        httpResponse: { data: [] },
      });

      await propertiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.price_from).toBeUndefined();
      expect(opts.qs.living_space_from).toBe(50);
    });

    it("splits property_ids into array", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          simplify: false,
          additionalFields: {
            property_ids: "1, 2, 3",
          },
        },
        httpResponse: { data: [] },
      });

      await propertiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.property_ids).toEqual(["1", "2", "3"]);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/units/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: { value: "15" },
          additionalFields: { title: "Updated Title" },
        },
        httpResponse: { id: 15, title: "Updated Title" },
      });

      const result = await propertiesUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/units/15");
      expect(opts.body.property.title).toBe("Updated Title");
      expect(result[0].json.title).toBe("Updated Title");
    });

    it("parses custom fields JSON on update", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: { value: "15" },
          additionalFields: {
            partial_custom_fields: '{"key": "val"}',
          },
        },
        httpResponse: { id: 15 },
      });

      await propertiesUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.property.partial_custom_fields).toEqual({ key: "val" });
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/units/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { propertyId: { value: "20" } },
        httpResponse: { success: true },
      });

      const result = await propertiesDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/units/20");
      expect(result[0].json.deleted).toBe(true);
    });
  });
});
