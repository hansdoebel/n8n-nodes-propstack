import { dealsCreate } from "../../../../nodes/Propstack/v1/resources/deals/create";
import { dealsGet } from "../../../../nodes/Propstack/v1/resources/deals/get";
import { dealsGetAll } from "../../../../nodes/Propstack/v1/resources/deals/getAll";
import { dealsUpdate } from "../../../../nodes/Propstack/v1/resources/deals/update";
import { dealsDelete } from "../../../../nodes/Propstack/v1/resources/deals/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("deals", () => {
  describe("create", () => {
    it("sends POST to /v1/client_properties", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          client_id: { value: "10" },
          property_id: { value: "20" },
          deal_stage_id: "30",
          additionalFields: {
            broker_id: "5",
            category: "sale",
            price: 300000,
          },
        },
        httpResponse: { id: 1 },
      });

      const result = await dealsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/client_properties");
      expect(opts.body.client_property.client_id).toBe("10");
      expect(opts.body.client_property.property_id).toBe("20");
      expect(opts.body.client_property.deal_stage_id).toBe("30");
      expect(result).toHaveLength(1);
    });
  });

  describe("get", () => {
    it("sends GET to /v1/client_properties/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          dealId: { value: "55" },
          additionalFields: {},
        },
        httpResponse: { id: 55 },
      });

      const result = await dealsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/client_properties/55");
      expect(result[0].json.id).toBe(55);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/client_properties", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          additionalFields: {},
        },
        httpResponse: { data: [{ id: 1 }, { id: 2 }] },
      });

      const result = await dealsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/client_properties");
      expect(result).toHaveLength(2);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/client_properties/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          dealId: { value: "77" },
          additionalFields: { price: 500000 },
        },
        httpResponse: { id: 77, price: 500000 },
      });

      const result = await dealsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/client_properties/77");
      expect(result[0].json.price).toBe(500000);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/client_properties/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { dealId: { value: "88" } },
        httpResponse: { success: true },
      });

      await dealsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/client_properties/88");
    });
  });
});
