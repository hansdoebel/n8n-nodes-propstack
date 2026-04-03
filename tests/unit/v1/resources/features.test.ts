import { featuresCreate } from "../../../../nodes/Propstack/v1/resources/features/create";
import { featuresGetAll } from "../../../../nodes/Propstack/v1/resources/features/getAll";
import { featuresParentGetAll } from "../../../../nodes/Propstack/v1/resources/features/parentGetAll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("features", () => {
  describe("create", () => {
    it("sends POST to /v1/groups with entity and name", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_clients",
          name: "VIP",
          superGroupId: "",
        },
        httpResponse: { id: 1, name: "VIP" },
      });

      const result = await featuresCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/groups");
      expect(opts.body.entity).toBe("for_clients");
      expect(opts.body.name).toBe("VIP");
      expect(opts.body.super_group_id).toBeUndefined();
      expect(result).toHaveLength(1);
    });

    it("includes parent feature ID when provided", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_properties",
          name: "Pool",
          superGroupId: "42",
        },
        httpResponse: { id: 2 },
      });

      await featuresCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.super_group_id).toBe(42);
    });

    it("handles resource locator for parent ID", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_activities",
          name: "Priority",
          superGroupId: { value: "99" },
        },
        httpResponse: { id: 3 },
      });

      await featuresCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.super_group_id).toBe(99);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/groups with entity filter", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_clients",
          additionalFields: {},
        },
        httpResponse: [{ id: 1, name: "VIP" }],
      });

      const result = await featuresGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/groups");
      expect(opts.qs.entity).toBe("for_clients");
      expect(result).toHaveLength(1);
    });

    it("includes parent filter when superGroupId provided", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_properties",
          additionalFields: { superGroupId: "10" },
        },
        httpResponse: [],
      });

      await featuresGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.super_group).toBe(10);
    });
  });

  describe("parentGetAll", () => {
    it("sends GET to /v1/super_groups with entity", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_clients",
          includeGroups: false,
        },
        httpResponse: { data: [{ id: 1, name: "Category A" }] },
      });

      const result = await featuresParentGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/super_groups");
      expect(opts.qs.entity).toBe("for_clients");
      expect(opts.qs.include).toBeUndefined();
      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe("Category A");
    });

    it("includes groups when includeGroups is true", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_properties",
          includeGroups: true,
        },
        httpResponse: { data: [{ id: 1, name: "Amenities", groups: [] }] },
      });

      await featuresParentGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.include).toBe("groups");
    });

    it("handles plain array response", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          entity: "for_activities",
          includeGroups: false,
        },
        httpResponse: [{ id: 2, name: "Tags" }],
      });

      const result = await featuresParentGetAll.call(mock);

      expect(result).toHaveLength(1);
      expect(result[0].json.name).toBe("Tags");
    });
  });
});
