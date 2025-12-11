import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration V2: Properties", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v2/properties/${id}` });
      } catch { /* cleanup */ }
    }
  });

  it("creates a property", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v2/properties",
      body: {
        title: `IntTest Property ${timestamp}`,
        rs_type: "apartment",
        marketing_type: "rent",
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.title).toBe(`IntTest Property ${timestamp}`);
  });

  it("gets a property by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v2/properties/${id}`,
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
  });

  it("lists properties", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v2/properties",
      qs: { per: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("updates a property", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v2/properties/${id}`,
      body: {
        title: `IntTest Property Updated ${timestamp}`,
      },
    })) as Record<string, unknown>;

    expect(res.title).toBe(`IntTest Property Updated ${timestamp}`);
  });

  it("deletes a property", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v2/properties/${id}`,
    });
  });
});
