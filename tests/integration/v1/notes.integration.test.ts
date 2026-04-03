import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Notes", () => {
  describe("getAll — GET /v1/notes", () => {
    it("returns plain array of notes", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/notes",
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("each note has id and title", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/notes",
      })) as Record<string, unknown>[];

      if (res.length > 0) {
        for (const note of res.slice(0, 5)) {
          expect(note.id).toBeDefined();
          expect(note).toHaveProperty("title");
        }
      }
    });

    it("accepts broker filter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/notes",
        qs: { broker: 1 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("accepts property filter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/notes",
        qs: { property: 1 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("accepts client filter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/notes",
        qs: { client: 1 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });
});
