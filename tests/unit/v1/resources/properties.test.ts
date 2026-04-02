import { propertiesCreate } from "../../../../nodes/Propstack/v1/resources/properties/create";
import { propertiesGet } from "../../../../nodes/Propstack/v1/resources/properties/get";
import { propertiesGetAll } from "../../../../nodes/Propstack/v1/resources/properties/getAll";
import { propertiesUpdate } from "../../../../nodes/Propstack/v1/resources/properties/update";
import { propertiesDelete } from "../../../../nodes/Propstack/v1/resources/properties/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("properties", () => {
  describe("create", () => {
    it("sends POST to /v1/units", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            title: "Nice Apartment",
            rs_type: "APARTMENT",
            marketing_type: "BUY",
            price: 250000,
          },
        },
        httpResponse: { id: 1, title: "Nice Apartment" },
      });

      const result = await propertiesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/units");
      expect(opts.body.property.title).toBe("Nice Apartment");
      expect(opts.body.property.rs_type).toBe("APARTMENT");
      expect(opts.body.property.marketing_type).toBe("BUY");
      expect(opts.body.property.price).toBe(250000);
      expect(result).toHaveLength(1);
    });

    it("handles empty additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { additionalFields: {} },
        httpResponse: { id: 2 },
      });

      await propertiesCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body).toEqual({ property: {} });
    });
  });

  describe("get", () => {
    it("sends GET to /v1/units/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: { value: "10" },
          additionalFields: {},
        },
        httpResponse: { id: 10, title: "Studio" },
      });

      const result = await propertiesGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/units/10");
      expect(result[0].json.title).toBe("Studio");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/units with pagination", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 20,
          additionalFields: {},
        },
        httpResponse: [{ id: 1 }],
      });

      const result = await propertiesGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/units");
      expect(opts.qs.per).toBe(20);
      expect(result).toHaveLength(1);
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
      expect(result[0].json.title).toBe("Updated Title");
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/units/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { propertyId: { value: "20" } },
        httpResponse: { success: true },
      });

      await propertiesDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/units/20");
    });
  });
});
