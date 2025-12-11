import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Tasks", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/tasks/${id}` });
      } catch {
        // best-effort cleanup
      }
    }
  });

  it("creates a task", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/tasks",
      body: {
        task: {
          title: `IntTest Task ${timestamp}`,
          body: "Created by integration test",
        },
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.title).toBe(`IntTest Task ${timestamp}`);
  });

  it("gets a task by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v1/tasks/${id}`,
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
    expect(res.title).toBe(`IntTest Task ${timestamp}`);
  });

  it("lists tasks", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/tasks",
      qs: { per_page: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("updates a task", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v1/tasks/${id}`,
      body: {
        task: {
          title: `IntTest Task Updated ${timestamp}`,
          done: true,
        },
      },
    })) as Record<string, unknown>;

    expect(res.title).toBe(`IntTest Task Updated ${timestamp}`);
  });

  it("deletes a task", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v1/tasks/${id}`,
    });
  });
});
