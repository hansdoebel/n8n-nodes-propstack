import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Webhooks", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/hooks/${id}` });
      } catch { /* best-effort cleanup */ }
    }
  });

  it("creates a webhook", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/hooks",
      body: {
        event: "client_created",
        target_url: `https://example.com/webhook-inttest-${timestamp}`,
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
  });

  it("lists webhooks with hooks wrapper", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/hooks",
    })) as { hooks: Record<string, unknown>[] };

    expect(res).toHaveProperty("hooks");
    expect(Array.isArray(res.hooks)).toBe(true);
    expect(res.hooks.length).toBeGreaterThan(0);

    for (const hook of res.hooks.slice(0, 3)) {
      expect(hook.id).toBeDefined();
      expect(hook.event).toBeDefined();
      expect(hook.target_url).toBeDefined();
    }
  });

  it("deletes a webhook", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    const res = (await apiRequest({
      method: "DELETE",
      path: `/v1/hooks/${id}`,
    })) as Record<string, unknown>;

    expect(res.ok).toBe(true);
  });
});
