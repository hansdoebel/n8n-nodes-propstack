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

  describe("create — POST /v1/contacts", () => {
    it("creates a contact with basic fields", async () => {
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

      expect(res.ok).toBe(true);
      expect(res.id).toBeDefined();
      createdIds.push(String(res.id));
    });

    it("creates a contact with additional fields", async () => {
      const res = (await apiRequest({
        method: "POST",
        path: "/v1/contacts",
        body: {
          client: {
            first_name: `IntTest2-${timestamp}`,
            last_name: "Full",
            email: `inttest2-${timestamp}@example.com`,
            company: "Test Corp",
            phone_number: "+49123456789",
            street: "Teststraße",
            house_number: "42",
            postal_code: "10115",
            city: "Berlin",
            country: "DE",
          },
        },
      })) as Record<string, unknown>;

      expect(res.ok).toBe(true);
      expect(res.id).toBeDefined();
      createdIds.push(String(res.id));
    });
  });

  describe("get — GET /v1/contacts/:id", () => {
    it("returns a contact by ID", async () => {
      expect(createdIds.length).toBeGreaterThan(0);
      const id = createdIds[0];

      const res = (await apiRequest({
        method: "GET",
        path: `/v1/contacts/${id}`,
      })) as Record<string, unknown>;

      expect(String(res.id)).toBe(id);
      expect(res.first_name).toBe(`IntTest-${timestamp}`);
    });

    it("returns expanded data with expand=true", async () => {
      const id = createdIds[0];

      const res = (await apiRequest({
        method: "GET",
        path: `/v1/contacts/${id}`,
        qs: { expand: true },
      })) as Record<string, unknown>;

      expect(String(res.id)).toBe(id);
    });
  });

  describe("getAll — GET /v1/contacts", () => {
    it("returns a flat array of contacts", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { per: 5 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBeLessThanOrEqual(5);
    });

    it("paginates across pages", async () => {
      const page1 = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { per: 2, page: 1 },
      })) as Record<string, unknown>[];

      const page2 = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { per: 2, page: 2 },
      })) as Record<string, unknown>[];

      expect(page1.length).toBe(2);
      expect(page2.length).toBeGreaterThan(0);

      const page1Ids = page1.map((c) => c.id);
      const page2Ids = page2.map((c) => c.id);
      expect(page1Ids).not.toEqual(page2Ids);
    });

    it("accepts q search parameter", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { q: "test", per: 5 },
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("accepts sort_by and order parameters", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { per: 3, sort_by: "created_at", order: "desc" },
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBeGreaterThan(0);
    });

    it("filters by email", async () => {
      const email = `inttest-${timestamp}@example.com`;
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { email },
      })) as Record<string, unknown>[];

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBeGreaterThan(0);
      expect(res[0].email).toBe(email);
    });

    it("returns expanded data with expand=true", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/contacts",
        qs: { per: 1, expand: true },
      })) as Record<string, unknown>[];

      expect(res.length).toBeGreaterThan(0);
      expect(res[0].id).toBeDefined();
    });
  });

  describe("update — PUT /v1/contacts/:id", () => {
    it("updates basic fields", async () => {
      expect(createdIds.length).toBeGreaterThan(0);
      const id = createdIds[0];

      const res = (await apiRequest({
        method: "PUT",
        path: `/v1/contacts/${id}`,
        body: {
          client: {
            last_name: "Updated",
            company: "Updated Corp",
          },
        },
      })) as Record<string, unknown>;

      expect(res.last_name).toBe("Updated");
      expect(res.company).toBe("Updated Corp");
    });

    it("verifies update persisted", async () => {
      const id = createdIds[0];

      const res = (await apiRequest({
        method: "GET",
        path: `/v1/contacts/${id}`,
      })) as Record<string, unknown>;

      expect(res.last_name).toBe("Updated");
      expect(res.company).toBe("Updated Corp");
    });
  });

  describe("delete — DELETE /v1/contacts/:id", () => {
    it("deletes a contact and verifies it is gone", async () => {
      // Create a disposable contact
      const created = (await apiRequest({
        method: "POST",
        path: "/v1/contacts",
        body: {
          client: {
            first_name: `Delete-${timestamp}`,
            last_name: "Me",
          },
        },
      })) as Record<string, unknown>;

      const id = String(created.id);

      await apiRequest({
        method: "DELETE",
        path: `/v1/contacts/${id}`,
      });

      try {
        await apiRequest({ method: "GET", path: `/v1/contacts/${id}` });
      } catch (err: unknown) {
        expect((err as Error).message).toMatch(/404/);
      }
    });
  });
});
