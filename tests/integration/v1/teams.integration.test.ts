import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Teams", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/teams/${id}` });
      } catch {
        // best-effort cleanup
      }
    }
  });

  it("creates a team", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/teams",
      body: {
        name: `IntTest Team ${timestamp}`,
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.name).toBe(`IntTest Team ${timestamp}`);
  });

  it("gets a team by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v1/teams/${id}`,
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
  });

  it("lists teams", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/teams",
      qs: { per: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("updates a team", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v1/teams/${id}`,
      body: {
        name: `IntTest Team Updated ${timestamp}`,
      },
    })) as Record<string, unknown>;

    expect(res.name).toBe(`IntTest Team Updated ${timestamp}`);
  });

  it("deletes a team", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v1/teams/${id}`,
    });
  });
});
