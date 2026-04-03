import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Search Profiles", () => {
  describe("getAll — GET /v1/saved_queries", () => {
    it("returns { data: [...] }", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/saved_queries",
      })) as { data: unknown[] };

      expect(Array.isArray(res.data)).toBe(true);
    });

    it("accepts per param", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/saved_queries",
        qs: { per: 2 },
      })) as { data: unknown[] };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe("create + delete lifecycle", () => {
    it("creates and then deletes a search profile", async () => {
      const contacts = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { per: 1 },
      })) as Record<string, unknown>[];

      expect(contacts.length).toBeGreaterThan(0);
      const clientId = contacts[0].id as number;

      const created = (await apiRequest({
        method: "POST",
        path: "/v1/saved_queries",
        body: {
          saved_query: {
            client_id: clientId,
            marketing_type: "BUY",
            price_from: 100000,
            price_to: 500000,
          },
        },
      })) as Record<string, unknown>;

      expect(created.id).toBeDefined();
      const profileId = created.id as number;

      await apiRequest({
        method: "DELETE",
        path: `/v1/saved_queries/${profileId}`,
      });
    });
  });
});
