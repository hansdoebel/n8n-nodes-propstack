import { apiRequest, describeIf, hasApiToken } from "./testHelpers";

describeIf(hasApiToken)("Integration: Read-only Resources", () => {
  describe("activities", () => {
    it("lists activities", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activities",
        qs: { per: 5 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("lists activity types", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/activity_types",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("brokers", () => {
    it("lists brokers", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/brokers",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("custom fields", () => {
    it("lists custom field groups", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/custom_field_groups",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("deal pipelines", () => {
    it("lists deal pipelines", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/deal_pipelines",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("events", () => {
    it("lists events", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/events",
        qs: { per: 5 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("features", () => {
    it("lists feature groups", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/groups",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });

    it("lists parent feature groups (super groups)", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/super_groups",
        qs: { entity: "for_properties" },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("locations", () => {
    it("lists locations", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/locations",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("notes", () => {
    it("lists notes", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/notes",
        qs: { per: 5 },
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });

  describe("property statuses", () => {
    it("lists property statuses", async () => {
      const res = (await apiRequest({
        method: "GET",
        path: "/v1/property_statuses",
      })) as unknown[];

      expect(Array.isArray(res)).toBe(true);
    });
  });
});
