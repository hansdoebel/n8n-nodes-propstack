import { describe, it, expect, mock as createMock } from "bun:test";
import {
  createMockExecuteFunctions,
  getHttpRequestOptions,
} from "../testHelpers";
import { propertiesGet } from "../../../../nodes/Propstack/v2/resources/properties/get";
import { propertiesGetAll } from "../../../../nodes/Propstack/v2/resources/properties/getAll";
import { propertiesCreate } from "../../../../nodes/Propstack/v2/resources/properties/create";
import { propertiesUpdate } from "../../../../nodes/Propstack/v2/resources/properties/update";
import { propertiesDelete } from "../../../../nodes/Propstack/v2/resources/properties/delete";
import { propertiesScroll } from "../../../../nodes/Propstack/v2/resources/properties/scroll";
import { propertiesGetDeleted } from "../../../../nodes/Propstack/v2/resources/properties/getDeleted";
import { propertiesGetOptions } from "../../../../nodes/Propstack/v2/resources/properties/getOptions";
import { propertiesCreateLink } from "../../../../nodes/Propstack/v2/resources/properties/createLink";
import { propertiesUpdateLink } from "../../../../nodes/Propstack/v2/resources/properties/updateLink";
import { propertiesDeleteLink } from "../../../../nodes/Propstack/v2/resources/properties/deleteLink";

describe("properties resource", () => {
  describe("get", () => {
    it("sends GET to /v2/properties/456", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { propertyId: "456" },
        httpResponse: { id: 456, title: "Nice Apartment" },
      });
      const result = await propertiesGet.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/properties/456");
      expect(result[0].json.id).toBe(456);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v2/properties with filters", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          filters: { q: "apartment", marketing_type: "BUY" },
        },
        httpResponse: [{ id: 1, title: "Apartment" }],
      });
      const result = await propertiesGetAll.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/properties");
      expect(opts.qs.q).toBe("apartment");
      expect(opts.qs.marketing_type).toBe("BUY");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("create", () => {
    it("sends POST to /v2/properties with required and additional fields", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          marketingType: "BUY",
          objectType: "APARTMENT",
          rsType: "APARTMENT",
          title: "Test",
          additionalFields: { price: 100000, city: "Berlin" },
        },
        httpResponse: { id: 1, title: "Test", price: 100000 },
      });
      const result = await propertiesCreate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/properties");
      expect(opts.body.marketing_type).toBe("BUY");
      expect(opts.body.object_type).toBe("APARTMENT");
      expect(opts.body.rs_type).toBe("APARTMENT");
      expect(opts.body.title).toBe("Test");
      expect(opts.body.price).toBe(100000);
      expect(opts.body.city).toBe("Berlin");
      expect(result[0].json.id).toBe(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/properties/456 with options", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: "456",
          additionalFields: { price: 150000 },
        },
        httpResponse: { id: 456, price: 150000 },
      });
      const result = await propertiesUpdate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/properties/456");
      expect(opts.body.price).toBe(150000);
      expect(result[0].json.price).toBe(150000);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/properties/456", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { propertyId: "456" },
        httpResponse: {},
      });
      const result = await propertiesDelete.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/properties/456");
      expect(result[0].json.deleted).toBe(true);
    });
  });

  describe("scroll", () => {
    it("sends GET to /v2/properties/scroll with filters", async () => {
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
      const result = await propertiesScroll.call(ctx);
      const opts = httpMock.mock.calls[0][0];
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/properties/scroll");
      expect(opts.qs.updated_at_from).toBe("2024-01-01");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getDeleted", () => {
    it("sends GET to /v2/properties/deleted", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          filters: {},
        },
        httpResponse: [{ id: 1, deleted: true }],
      });
      const result = await propertiesGetDeleted.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/properties/deleted");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("getOptions", () => {
    it("sends GET to /v2/properties/options with locale", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { fields: "", locale: "de" },
        httpResponse: { marketing_type: ["BUY", "RENT"] },
      });
      const result = await propertiesGetOptions.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/properties/options");
      expect(opts.qs.locale).toBe("de");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("createLink", () => {
    it("sends POST to /v2/properties/456/links", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: "456",
          linkTitle: "Website",
          linkUrl: "https://example.com",
          linkFields: { is_private: true },
        },
        httpResponse: { id: 1, title: "Website", url: "https://example.com" },
      });
      const result = await propertiesCreateLink.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/properties/456/links");
      expect(opts.body.title).toBe("Website");
      expect(opts.body.url).toBe("https://example.com");
      expect(opts.body.is_private).toBe(true);
      expect(result[0].json.id).toBe(1);
    });
  });

  describe("updateLink", () => {
    it("sends PUT to /v2/properties/456/links/789", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: "456",
          linkId: "789",
          linkUpdateFields: { title: "Updated" },
        },
        httpResponse: { id: 789, title: "Updated" },
      });
      const result = await propertiesUpdateLink.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/properties/456/links/789");
      expect(opts.body.title).toBe("Updated");
      expect(result[0].json.title).toBe("Updated");
    });
  });

  describe("deleteLink", () => {
    it("sends DELETE to /v2/properties/456/links/789", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          propertyId: "456",
          linkId: "789",
        },
        httpResponse: {},
      });
      const result = await propertiesDeleteLink.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/properties/456/links/789");
      expect(result[0].json.deleted).toBe(true);
    });
  });
});
