import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Deals", () => {
  describe("getAll — GET /v1/client_properties", () => {
    it("returns data array and meta with total_count", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: { per: 5 },
      })) as { data: unknown[]; meta: { total_count: number } };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeLessThanOrEqual(5);
      expect(typeof res.meta.total_count).toBe("number");
    });

    it("paginates across pages", async () => {
      const page1 = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: { per: 2, page: 1 },
      })) as { data: Record<string, unknown>[] };

      const page2 = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: { per: 2, page: 2 },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(page1.data)).toBe(true);
      expect(Array.isArray(page2.data)).toBe(true);

      if (page1.data.length === 2 && page2.data.length > 0) {
        const page1Ids = page1.data.map((d) => d.id);
        const page2Ids = page2.data.map((d) => d.id);
        expect(page1Ids).not.toEqual(page2Ids);
      }
    });

    it("accepts include=client,property", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: { per: 1, include: "client,property" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
    });

    it("accepts category filter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: { per: 5, category: "qualified" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
    });

    it("accepts order parameter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: { per: 3, order: "asc" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
    });

    it("accepts date range filters", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/client_properties",
        qs: {
          per: 5,
          created_at_from: "2020-01-01T00:00:00+01:00",
          created_at_to: "2030-12-31T23:59:59+01:00",
        },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe("deal pipelines — GET /v1/deal_pipelines", () => {
    it("returns data array of pipelines", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/deal_pipelines",
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("each pipeline has id, name, and deal_stages", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/deal_pipelines",
      })) as { data: Record<string, unknown>[] };

      for (const pipeline of res.data) {
        expect(pipeline.id).toBeDefined();
        expect(pipeline.name).toBeDefined();
        expect(Array.isArray(pipeline.deal_stages)).toBe(true);
      }
    });
  });
});
