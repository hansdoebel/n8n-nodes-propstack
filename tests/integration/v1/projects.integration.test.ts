import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Projects", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/projects/${id}` });
      } catch {
        // best-effort cleanup
      }
    }
  });

  it("creates a project", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/projects",
      body: {
        project: {
          title: `IntTest Project ${timestamp}`,
        },
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.title).toBe(`IntTest Project ${timestamp}`);
  });

  it("gets a project by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v1/projects/${id}`,
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
  });

  it("lists projects", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/projects",
      qs: { per: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("updates a project", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v1/projects/${id}`,
      body: {
        project: {
          title: `IntTest Project Updated ${timestamp}`,
        },
      },
    })) as Record<string, unknown>;

    expect(res.title).toBe(`IntTest Project Updated ${timestamp}`);
  });

  it("deletes a project", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v1/projects/${id}`,
    });
  });
});
