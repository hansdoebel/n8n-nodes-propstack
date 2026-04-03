import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Features", () => {
  describe("getAll — GET /v1/groups", () => {
    it("returns array of features for clients", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/groups",
        qs: { entity: "for_clients" },
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("returns array of features for properties", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/groups",
        qs: { entity: "for_properties" },
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("returns array of features for activities", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/groups",
        qs: { entity: "for_activities" },
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("each feature has id, name, and super_group_id", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/groups",
        qs: { entity: "for_clients" },
      })) as Record<string, unknown>[];

      if (res.length > 0) {
        for (const feature of res.slice(0, 5)) {
          expect(feature.id).toBeDefined();
          expect(feature.name).toBeDefined();
          expect(feature).toHaveProperty("super_group_id");
        }
      }
    });

    it("filters by super_group", async () => {
      const all = (await apiRequest({
        method: "GET",
        path: "/v1/groups",
        qs: { entity: "for_clients" },
      })) as Record<string, unknown>[];

      if (all.length > 0) {
        const parentId = all[0].super_group_id as number;
        const filtered = (await apiRequest({
          method: "GET",
          path: "/v1/groups",
          qs: { entity: "for_clients", super_group: parentId },
        })) as Record<string, unknown>[];

        expect(Array.isArray(filtered)).toBe(true);
        for (const feature of filtered) {
          expect(feature.super_group_id).toBe(parentId);
        }
      }
    });
  });

  describe("parentGetAll — GET /v1/super_groups", () => {
    it("returns array of parent features", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_clients" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
    });

    it("each parent feature has id, name, entity", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_clients" },
      })) as { data: Record<string, unknown>[] };

      if (res.data.length > 0) {
        for (const parent of res.data.slice(0, 5)) {
          expect(parent.id).toBeDefined();
          expect(parent.name).toBeDefined();
          expect(parent.entity).toBe("for_clients");
        }
      }
    });

    it("includes child groups when include=groups", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_clients", include: "groups" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      if (res.data.length > 0) {
        expect(res.data[0]).toHaveProperty("groups");
        expect(Array.isArray(res.data[0].groups)).toBe(true);
      }
    });

    it("returns results for different entity types", async () => {
      const properties = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_properties" },
      })) as { data: Record<string, unknown>[] };

      const activities = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_activities" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(properties.data)).toBe(true);
      expect(Array.isArray(activities.data)).toBe(true);
    });
  });

  describe("create — POST /v1/groups", () => {
    const testFeatureName = `__test_feature_${Date.now()}`;

    it("creates a feature and returns it", async () => {
      const parentRes = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_clients" },
      })) as { data: Record<string, unknown>[] };

      expect(parentRes.data.length).toBeGreaterThan(0);

      const parentId = parentRes.data[0].id as number;

      const res = (await apiRequest({
        method: "POST",
        path: "/v1/groups",
        body: {
          name: testFeatureName,
          entity: "for_clients",
          super_group_id: parentId,
        },
      })) as Record<string, unknown>;

      expect(res.id).toBeDefined();
      expect(typeof res.id).toBe("number");
    });
  });
});
