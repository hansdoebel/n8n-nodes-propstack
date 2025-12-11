import { teamsCreate } from "../../../../nodes/Propstack/v1/resources/teams/create";
import { teamsGet } from "../../../../nodes/Propstack/v1/resources/teams/get";
import { teamsGetAll } from "../../../../nodes/Propstack/v1/resources/teams/getAll";
import { teamsUpdate } from "../../../../nodes/Propstack/v1/resources/teams/update";
import { teamsDelete } from "../../../../nodes/Propstack/v1/resources/teams/delete";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("teams", () => {
  describe("create", () => {
    it("sends POST to /v1/teams with name", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          name: "Sales Team",
          additionalFields: {},
        },
        httpResponse: { id: 1, name: "Sales Team" },
      });

      const result = await teamsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("POST");
      expect(opts.url).toBe("/v1/teams");
      expect(opts.body.name).toBe("Sales Team");
      expect(result).toHaveLength(1);
    });

    it("splits broker_ids into integer array", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          name: "Team",
          additionalFields: { broker_ids: "1, 2, 3" },
        },
        httpResponse: { id: 2 },
      });

      await teamsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.broker_ids).toEqual([1, 2, 3]);
    });

    it("includes HTML note fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          name: "Team",
          additionalFields: {
            cancellation_policy_note: "<p>Cancel policy</p>",
            imprint_note: "<p>Imprint</p>",
            terms_note: "<p>Terms</p>",
            privacy_note: "<p>Privacy</p>",
            logo_url: "https://example.com/logo.png",
            position: 5,
          },
        },
        httpResponse: { id: 3 },
      });

      await teamsCreate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.body.cancellation_policy_note).toBe("<p>Cancel policy</p>");
      expect(opts.body.imprint_note).toBe("<p>Imprint</p>");
      expect(opts.body.terms_note).toBe("<p>Terms</p>");
      expect(opts.body.privacy_note).toBe("<p>Privacy</p>");
      expect(opts.body.logo_url).toBe("https://example.com/logo.png");
      expect(opts.body.position).toBe(5);
    });
  });

  describe("get", () => {
    it("sends GET to /v1/teams/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          teamId: { value: "8" },
        },
        httpResponse: { id: 8, name: "Marketing" },
      });

      const result = await teamsGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/teams/8");
      expect(result[0].json.name).toBe("Marketing");
    });
  });

  describe("getAll", () => {
    it("sends GET to /v1/teams with pagination", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 10,
          additionalFields: {},
        },
        httpResponse: [{ id: 1 }, { id: 2 }],
      });

      const result = await teamsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/teams");
      expect(result).toHaveLength(2);
    });
  });

  describe("update", () => {
    it("sends PUT to /v1/teams/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          teamId: { value: "10" },
          name: "Renamed Team",
          additionalFields: {},
        },
        httpResponse: { id: 10, name: "Renamed Team" },
      });

      const result = await teamsUpdate.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("PUT");
      expect(opts.url).toBe("/v1/teams/10");
      expect(result).toHaveLength(1);
    });
  });

  describe("delete", () => {
    it("sends DELETE to /v1/teams/{id}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: { teamId: { value: "12" } },
        httpResponse: { success: true },
      });

      await teamsDelete.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("DELETE");
      expect(opts.url).toBe("/v1/teams/12");
    });
  });
});
