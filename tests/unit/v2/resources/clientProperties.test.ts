import { describe, it, expect, mock as createMock } from "bun:test";
import {
  createMockExecuteFunctions,
  getHttpRequestOptions,
} from "../testHelpers";
import { clientPropertiesGet } from "../../../../nodes/Propstack/v2/resources/clientProperties/get";
import { clientPropertiesGetAll } from "../../../../nodes/Propstack/v2/resources/clientProperties/getAll";
import { clientPropertiesCreate } from "../../../../nodes/Propstack/v2/resources/clientProperties/create";
import { clientPropertiesUpdate } from "../../../../nodes/Propstack/v2/resources/clientProperties/update";
import { clientPropertiesDelete } from "../../../../nodes/Propstack/v2/resources/clientProperties/delete";
import { clientPropertiesScroll } from "../../../../nodes/Propstack/v2/resources/clientProperties/scroll";

describe("clientProperties resource", () => {
  describe("get", () => {
    it("sends GET to /v2/client_properties/100", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { clientPropertyId: "100" },
        httpResponse: { id: 100, client_id: 10, property_id: 20 },
      });
      const result = await clientPropertiesGet.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/client_properties/100");
      expect(result[0].json.id).toBe(100);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v2/client_properties with filters", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          filters: { deal_pipeline_id: "5" },
        },
        httpResponse: [{ id: 1, deal_pipeline_id: 5 }],
      });
      const result = await clientPropertiesGetAll.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/client_properties");
      expect(opts.qs.deal_pipeline_id).toBe("5");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("create", () => {
    it("sends POST to /v2/client_properties with client and property IDs", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          clientId: "10",
          propertyId: "20",
          additionalFields: { deal_stage_id: "3", sold_price: 500000 },
        },
        httpResponse: { id: 1, client_id: 10, property_id: 20, sold_price: 500000 },
      });
      const result = await clientPropertiesCreate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/client_properties");
      expect(opts.body.client_id).toBe("10");
      expect(opts.body.property_id).toBe("20");
      expect(opts.body.deal_stage_id).toBe("3");
      expect(opts.body.sold_price).toBe(500000);
      expect(result[0].json.id).toBe(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/client_properties/100 with options", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          clientPropertyId: "100",
          additionalFields: { sold_price: 600000 },
        },
        httpResponse: { id: 100, sold_price: 600000 },
      });
      const result = await clientPropertiesUpdate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/client_properties/100");
      expect(opts.body.sold_price).toBe(600000);
      expect(result[0].json.sold_price).toBe(600000);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/client_properties/100", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { clientPropertyId: "100" },
        httpResponse: {},
      });
      const result = await clientPropertiesDelete.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/client_properties/100");
      expect(result[0].json.deleted).toBe(true);
    });
  });

  describe("scroll", () => {
    it("sends GET to /v2/client_properties/scroll with filters", async () => {
      const httpMock = createMock()
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([]);
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          filters: { deal_pipeline_id: "5" },
        },
        httpResponse: [],
      });
      (ctx.helpers as Record<string, unknown>).httpRequest = httpMock;
      const result = await clientPropertiesScroll.call(ctx);
      const opts = httpMock.mock.calls[0][0];
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/client_properties/scroll");
      expect(opts.qs.deal_pipeline_id).toBe("5");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
