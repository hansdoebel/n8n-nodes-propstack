import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration V2: Clients", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v2/clients/${id}` });
      } catch { /* cleanup */ }
    }
  });

  it("creates a client", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v2/clients",
      body: {
        first_name: `IntTest-${timestamp}`,
        last_name: "Client",
        email: `inttest-${timestamp}@example.com`,
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.first_name).toBe(`IntTest-${timestamp}`);
    expect(res.last_name).toBe("Client");
  });

  it("gets a client by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v2/clients/${id}`,
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
    expect(res.first_name).toBe(`IntTest-${timestamp}`);
  });

  it("lists clients", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v2/clients",
      qs: { per: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("updates a client", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v2/clients/${id}`,
      body: {
        last_name: "Updated",
      },
    })) as Record<string, unknown>;

    expect(res.last_name).toBe("Updated");
  });

  it("deletes a client", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v2/clients/${id}`,
    });

    try {
      await apiRequest({ method: "GET", path: `/v2/clients/${id}` });
    } catch (err: unknown) {
      expect((err as Error).message).toMatch(/404/);
    }
  });
});
