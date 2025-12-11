import { referenceGetAll } from "../../../../nodes/Propstack/v2/resources/reference/getAll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("reference", () => {
  describe("getAll", () => {
    it("sends GET to /v2/property_statuses for propertyStatuses", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { referenceType: "propertyStatuses" },
        httpResponse: [{ id: 1, name: "Active" }],
      });

      await referenceGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/property_statuses");
    });

    it("sends GET to /v2/groups for groups", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { referenceType: "groups" },
        httpResponse: [{ id: 1, name: "VIP" }],
      });

      await referenceGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/groups");
    });

    it("sends GET to /v2/rights for rights", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { referenceType: "rights" },
        httpResponse: [{ id: 1, name: "Admin" }],
      });

      await referenceGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/rights");
    });
  });
});
