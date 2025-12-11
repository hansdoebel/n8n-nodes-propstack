import { describe, it, expect } from "bun:test";
import {
  createMockExecuteFunctions,
  getHttpRequestOptions,
} from "../testHelpers";
import { projectsGet } from "../../../../nodes/Propstack/v2/resources/projects/get";
import { projectsGetAll } from "../../../../nodes/Propstack/v2/resources/projects/getAll";
import { projectsCreate } from "../../../../nodes/Propstack/v2/resources/projects/create";
import { projectsUpdate } from "../../../../nodes/Propstack/v2/resources/projects/update";
import { projectsDelete } from "../../../../nodes/Propstack/v2/resources/projects/delete";

describe("projects resource", () => {
  describe("get", () => {
    it("sends GET to /v2/projects/50", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { projectId: "50" },
        httpResponse: { id: 50, name: "Test Project" },
      });
      const result = await projectsGet.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/projects/50");
      expect(result[0].json.id).toBe(50);
    });
  });

  describe("getAll", () => {
    it("sends GET to /v2/projects with filters", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
          filters: { order: "asc" },
        },
        httpResponse: [{ id: 1, name: "Project A" }],
      });
      const result = await projectsGetAll.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/projects");
      expect(opts.qs.order).toBe("asc");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("create", () => {
    it("sends POST to /v2/projects with options", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          additionalFields: { name: "New Project", city: "Munich" },
        },
        httpResponse: { id: 1, name: "New Project", city: "Munich" },
      });
      const result = await projectsCreate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v2/projects");
      expect(opts.body.name).toBe("New Project");
      expect(opts.body.city).toBe("Munich");
      expect(result[0].json.id).toBe(1);
    });
  });

  describe("update", () => {
    it("sends PUT to /v2/projects/50 with options", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: {
          projectId: "50",
          additionalFields: { name: "Updated Project" },
        },
        httpResponse: { id: 50, name: "Updated Project" },
      });
      const result = await projectsUpdate.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v2/projects/50");
      expect(opts.body.name).toBe("Updated Project");
      expect(result[0].json.name).toBe("Updated Project");
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v2/projects/50", async () => {
      const ctx = createMockExecuteFunctions({
        nodeParameters: { projectId: "50" },
        httpResponse: {},
      });
      const result = await projectsDelete.call(ctx);
      const opts = getHttpRequestOptions(ctx);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v2/projects/50");
      expect(result[0].json.deleted).toBe(true);
    });
  });
});
