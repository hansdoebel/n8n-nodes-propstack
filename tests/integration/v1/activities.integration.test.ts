import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Activities", () => {
  let firstActivityId: number;

  beforeAll(async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/activities",
      qs: { per: 1 },
    })) as { data: Record<string, unknown>[] };

    expect(res.data.length).toBeGreaterThan(0);
    firstActivityId = res.data[0].id as number;
  });

  describe("getAll — GET /v1/activities", () => {
    it("returns data array and meta with total_count", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 5 },
      })) as { data: unknown[]; meta: { total_count: number } };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeLessThanOrEqual(5);
      expect(typeof res.meta.total_count).toBe("number");
    });

    it("paginates across pages", async () => {
      const page1 = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 2, page: 1 },
      })) as { data: Record<string, unknown>[] };

      const page2 = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 2, page: 2 },
      })) as { data: Record<string, unknown>[] };

      expect(page1.data.length).toBe(2);
      expect(page2.data.length).toBeGreaterThan(0);

      const page1Ids = page1.data.map((a) => a.id);
      const page2Ids = page2.data.map((a) => a.id);
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it("filters by item_type", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 5, item_type: "note" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      for (const activity of res.data) {
        expect(activity.conversation_type).toBe("note");
      }
    });

    it("accepts order=asc parameter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 3, order: "asc" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("accepts order=desc parameter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 3, order: "desc" },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("filters by not_completed", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 5, not_completed: true },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      for (const activity of res.data) {
        expect(activity.done).toBeFalsy();
      }
    });

    it("returns expanded data with expand=true", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 1, expand: true },
      })) as { data: Record<string, unknown>[] };

      expect(res.data.length).toBeGreaterThan(0);
      const activity = res.data[0];
      // expanded responses include additional nested details
      expect(activity.id).toBeDefined();
    });

    it("filters by date range", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: {
          per: 5,
          starts_at_from: "2020-01-01T00:00:00+01:00",
          starts_at_to: "2030-12-31T23:59:59+01:00",
        },
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe("get — GET /v1/activities/:id", () => {
    it("returns a single activity by ID", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: `/v1/activities/${firstActivityId}`,
      })) as Record<string, unknown>;

      expect(res.id).toBe(firstActivityId);
    });

    it("includes expected fields", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: `/v1/activities/${firstActivityId}`,
      })) as Record<string, unknown>;

      expect(res.id).toBeDefined();
      expect(res.activatable_type).toBeDefined();
    });
  });

  describe("activityTypesGetAll — GET /v1/activity_types", () => {
    it("returns an array of activity types", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activity_types",
      })) as { data: Record<string, unknown>[] };

      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("each type has id, name, and category", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activity_types",
      })) as { data: Record<string, unknown>[] };

      for (const type of res.data) {
        expect(type.id).toBeDefined();
        expect(type.name).toBeDefined();
        expect(type.category).toBeDefined();
      }
    });
  });

  describe("reservationReasonsGetAll — GET /v1/reservation_reasons", () => {
    it("returns an array of reservation reasons", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/reservation_reasons",
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("each reason has id and name", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/reservation_reasons",
      })) as Record<string, unknown>[];

      for (const reason of res) {
        expect(reason.id).toBeDefined();
        expect(reason.name).toBeDefined();
      }
    });
  });
});
