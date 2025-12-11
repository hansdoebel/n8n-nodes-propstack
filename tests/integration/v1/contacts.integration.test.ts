import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Contacts", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/contacts/${id}` });
      } catch {
        // best-effort cleanup
      }
    }
  });

  it("creates a contact", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/contacts",
      body: {
        client: {
          first_name: `IntTest-${timestamp}`,
          last_name: "Contact",
          email: `inttest-${timestamp}@example.com`,
        },
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.first_name).toBe(`IntTest-${timestamp}`);
    expect(res.last_name).toBe("Contact");
  });

  it("gets a contact by ID", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "GET",
      path: `/v1/contacts/${id}`,
    })) as Record<string, unknown>;

    expect(String(res.id)).toBe(id);
    expect(res.first_name).toBe(`IntTest-${timestamp}`);
  });

  it("lists contacts", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/contacts",
      qs: { per_page: 5 },
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
  });

  it("updates a contact", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds[0];

    const res = (await apiRequest({
      method: "PUT",
      path: `/v1/contacts/${id}`,
      body: {
        client: {
          last_name: "Updated",
        },
      },
    })) as Record<string, unknown>;

    expect(res.last_name).toBe("Updated");
  });

  it("deletes a contact", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v1/contacts/${id}`,
    });

    // Verify it's gone — expect 404 or empty
    try {
      await apiRequest({ method: "GET", path: `/v1/contacts/${id}` });
    } catch (err: unknown) {
      expect((err as Error).message).toMatch(/404/);
    }
  });
});
