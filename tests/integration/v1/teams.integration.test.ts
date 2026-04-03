import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Teams", () => {
  it("lists teams", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/teams",
    })) as Record<string, unknown>[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("each team has id, name, and broker_ids", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/teams",
    })) as Record<string, unknown>[];

    if (res.length > 0) {
      for (const team of res.slice(0, 5)) {
        expect(team.id).toBeDefined();
        expect(team.name).toBeDefined();
        expect(team).toHaveProperty("broker_ids");
      }
    }
  });

  it("accepts per param", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/teams",
      qs: { per: 1 },
    })) as Record<string, unknown>[];

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeLessThanOrEqual(1);
  });
});
