import { relationshipsGetAll } from "../../../../nodes/Propstack/v2/resources/relationships/getAll";
import { relationshipsCreate } from "../../../../nodes/Propstack/v2/resources/relationships/create";
import { relationshipsDelete } from "../../../../nodes/Propstack/v2/resources/relationships/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("relationships", () => {
  describe("getAll", () => {
    it("sends GET to /v2/relationships with limit and filters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 30,
          filters: { client_id: "10" },
        },
        httpResponse: [{ id: 1 }],
      });

      await relationshipsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/relationships");
      expect(opts.qs.per).toBe(30);
      expect(opts.qs.client_id).toBe("10");
    });
  });

  describe("create", () => {
    it("sends POST to /v2/relationships with required and additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          internalName: "Partner",
          relationClientId: "10",
          relatedClientId: "20",
          additionalFields: { property_id: "30" },
        },
        httpResponse: { id: 1 },
      });

      const result = await relationshipsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/relationships");
      expect(opts.body.internal_name).toBe("Partner");
      expect(opts.body.client_id).toBe("10");
      expect(opts.body.related_client_id).toBe("20");
      expect(opts.body.property_id).toBe("30");
      expect(result).toHaveLength(1);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/relationships/5", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { relationshipId: "5" },
        httpResponse: {},
      });

      const result = await relationshipsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/relationships/5");
      expect(result).toHaveLength(1);
      expect(result[0].json.deleted).toBe(true);
    });
  });
});
