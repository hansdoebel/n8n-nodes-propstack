import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Webhooks", () => {
  const createdIds: string[] = [];
  const timestamp = Date.now();

  afterAll(async () => {
    for (const id of createdIds) {
      try {
        await apiRequest({ method: "DELETE", path: `/v1/hooks/${id}` });
      } catch {
        // best-effort cleanup
      }
    }
  });

  it("creates a webhook", async () => {
    const res = (await apiRequest({
      method: "POST",
      path: "/v1/hooks",
      body: {
        event: "client.created",
        target_url: `https://example.com/webhook-inttest-${timestamp}`,
      },
    })) as Record<string, unknown>;

    expect(res.id).toBeDefined();
    createdIds.push(String(res.id));
    expect(res.event).toBe("client.created");
  });

  it("lists webhooks", async () => {
    const res = (await apiRequest({
      method: "GET",
      path: "/v1/hooks",
    })) as unknown[];

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it("deletes a webhook", async () => {
    expect(createdIds.length).toBeGreaterThan(0);
    const id = createdIds.pop()!;

    await apiRequest({
      method: "DELETE",
      path: `/v1/hooks/${id}`,
    });
  });
});
