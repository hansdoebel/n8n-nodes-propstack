import { projectsCreate } from "../../../../nodes/Propstack/v1/resources/projects/create";
import { projectsGet } from "../../../../nodes/Propstack/v1/resources/projects/get";
import { projectsGetAll } from "../../../../nodes/Propstack/v1/resources/projects/getAll";
import { projectsUpdate } from "../../../../nodes/Propstack/v1/resources/projects/update";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("projects", () => {
  describe("create", () => {
    it("sends POST to /v1/projects with project body", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            name: "New Project",
            title: "Luxury Residences",
            status: "ACQUISITION",
            city: "Berlin",
          },
        },
        httpResponse: { id: 1, name: "New Project" },
      });

      const result = await projectsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/projects");
      expect(opts.body.project.name).toBe("New Project");
      expect(opts.body.project.title).toBe("Luxury Residences");
      expect(opts.body.project.status).toBe("ACQUISITION");
      expect(opts.body.project.city).toBe("Berlin");
      expect(result).toHaveLength(1);
    });

    it("handles empty additional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { additionalFields: {} },
        httpResponse: { id: 2 },
      });

      await projectsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body).toEqual({ project: {} });
    });

    it("converts broker_id and location_id to integers", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            broker_id: "5",
            location_id: "42",
          },
        },
        httpResponse: { id: 3 },
      });

      await projectsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.project.broker_id).toBe(5);
      expect(opts.body.project.location_id).toBe(42);
    });

    it("includes all optional fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: {
            for_rent: true,
            construction_year: 2020,
            lat: 52.52,
            lng: 13.405,
            note: "Test note",
          },
        },
        httpResponse: { id: 4 },
      });

      await projectsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.project.for_rent).toBe(true);
      expect(opts.body.project.construction_year).toBe(2020);
      expect(opts.body.project.lat).toBe(52.52);
      expect(opts.body.project.lng).toBe(13.405);
      expect(opts.body.project.note).toBe("Test note");
    });
  });

  describe("get", () => {
    it("sends GET to /v1/projects/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          projectId: { value: "7" },
          simplify: false,
        },
        httpResponse: { id: 7, name: "Test Project" },
      });

      const result = await projectsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/projects/7");
      expect(result[0].json.name).toBe("Test Project");
    });

    it("simplifies response when simplify is true", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          projectId: { value: "7" },
          simplify: true,
        },
        httpResponse: {
          id: 7,
          name: "Test",
          status: "SALES",
          city: "Berlin",
          broker_id: 1,
          description_note: "long text",
        },
      });

      const result = await projectsGet.call(mock);

      expect(result[0].json.id).toBe(7);
      expect(result[0].json.name).toBe("Test");
      expect(result[0].json.city).toBe("Berlin");
      expect(result[0].json).not.toHaveProperty("broker_id");
      expect(result[0].json).not.toHaveProperty("description_note");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/projects with pagination", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 10,
          simplify: false,
          additionalFields: {},
        },
        httpResponse: [{ id: 1 }, { id: 2 }],
      });

      const result = await projectsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/projects");
      expect(opts.qs.per).toBe(10);
      expect(result).toHaveLength(2);
    });

    it("passes expand parameter", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          simplify: false,
          additionalFields: { expand: true },
        },
        httpResponse: [{ id: 1 }],
      });

      await projectsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.expand).toBe(1);
    });

    it("passes page parameter", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          simplify: false,
          additionalFields: { page: 3 },
        },
        httpResponse: [{ id: 1 }],
      });

      await projectsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.qs.page).toBe(3);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/projects/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          projectId: { value: "12" },
          additionalFields: { name: "Renamed" },
        },
        httpResponse: { id: 12, name: "Renamed" },
      });

      const result = await projectsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/projects/12");
      expect(opts.body.project.name).toBe("Renamed");
      expect(result[0].json.name).toBe("Renamed");
    });

    it("converts broker_id to integer", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          projectId: { value: "12" },
          additionalFields: { broker_id: "8" },
        },
        httpResponse: { id: 12 },
      });

      await projectsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.project.broker_id).toBe(8);
    });
  });

});
