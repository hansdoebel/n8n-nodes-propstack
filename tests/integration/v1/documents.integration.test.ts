import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Documents", () => {
  describe("getAll — GET /v1/documents", () => {
    it("returns documents array and meta with total_count", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/documents",
        qs: { per: 5 },
      })) as { documents: unknown[]; meta: { total_count: number } };

      expect(Array.isArray(res.documents)).toBe(true);
      expect(res.documents.length).toBeLessThanOrEqual(5);
      expect(typeof res.meta.total_count).toBe("number");
    });

    it("paginates across pages", async () => {
      const page1 = (await apiRequest({
        method: "GET",
        path: "/v1/documents",
        qs: { per: 2, page: 1 },
      })) as { documents: Record<string, unknown>[] };

      const page2 = (await apiRequest({
        method: "GET",
        path: "/v1/documents",
        qs: { per: 2, page: 2 },
      })) as { documents: Record<string, unknown>[] };

      expect(Array.isArray(page1.documents)).toBe(true);
      expect(Array.isArray(page2.documents)).toBe(true);

      if (page1.documents.length === 2 && page2.documents.length > 0) {
        const page1Ids = page1.documents.map((d) => d.id);
        const page2Ids = page2.documents.map((d) => d.id);
        expect(page1Ids).not.toEqual(page2Ids);
      }
    });

    it("accepts order_by parameter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/documents",
        qs: { per: 3, order_by: "created_at,desc" },
      })) as { documents: Record<string, unknown>[] };

      expect(Array.isArray(res.documents)).toBe(true);
    });

    it("accepts tag filter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/documents",
        qs: { per: 5, tag: "test" },
      })) as { documents: Record<string, unknown>[] };

      expect(Array.isArray(res.documents)).toBe(true);
    });
  });

  describe("get — GET /v1/documents/:id", () => {
    it("returns a single document by ID", async () => {
      const list = (await apiRequest({
        method: "GET",
        path: "/v1/documents",
        qs: { per: 1 },
      })) as { documents: Record<string, unknown>[] };

      if (list.documents.length === 0) return;

      const id = list.documents[0].id;
      const res = (await apiRequest({
        method: "GET",
        path: `/v1/documents/${id}`,
      })) as Record<string, unknown>;

      expect(res.id).toBe(id);
    });
  });
});
