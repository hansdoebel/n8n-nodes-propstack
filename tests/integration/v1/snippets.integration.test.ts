import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Snippets", () => {
  it("lists snippets", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/snippets",
    })) as Record<string, unknown>[];

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it("each snippet has id and name", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/snippets",
    })) as Record<string, unknown>[];

    for (const snippet of res.slice(0, 5)) {
      expect(snippet.id).toBeDefined();
      expect(snippet.name).toBeDefined();
    }
  });
});
