import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Properties", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/units/${id}` });
      } catch {
      }
    }
  });

  it("creates a property", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/units",
      body: {
        property: {
          title: `IntTest Property ${timestamp}`,
          object_type: "LIVING",
          rs_type: "APARTMENT",
          marketing_type: "RENT",
        },
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
  });

  it("gets a property by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v1/units/${id}`,
      qs: { new: 1 },
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
  });

  it("lists properties with data wrapper", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/units",
      qs: { per: 5, with_meta: 1 },
    })) as { data: Record<string, unknown>[]; meta: { total_count: number } };

    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeLessThanOrEqual(5);
    expect(typeof res.meta.total_count).toBe("number");
  });

  it("filters by marketing type", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/units",
      qs: { per: 5, with_meta: 1, marketing_type: "RENT" },
    })) as { data: Record<string, unknown>[] };

    expect(Array.isArray(res.data)).toBe(true);
  });

  it("supports search query", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/units",
      qs: { per: 5, with_meta: 1, q: "Berlin" },
    })) as { data: Record<string, unknown>[] };

    expect(Array.isArray(res.data)).toBe(true);
  });

  it("updates a property", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v1/units/${id}`,
      body: {
        property: {
          title: `IntTest Property Updated ${timestamp}`,
        },
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
  });

  it("deletes a property", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v1/units/${id}`,
    });
  });

  it("lists property statuses", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/property_statuses",
    })) as { data: Record<string, unknown>[] };

    expect(Array.isArray(res.data)).toBe(true);
    if (res.data.length > 0) {
      expect(res.data[0]).toHaveProperty("id");
      expect(res.data[0]).toHaveProperty("name");
    }
  });
});
