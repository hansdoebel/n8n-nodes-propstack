import { teamsGetAll } from "../../../../nodes/Propstack/v1/resources/teams/getAll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("teams", () => {
  describe("getAll", () => {
    it("sends GET to /v1/teams with pagination", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 10,
        },
        httpResponse: [{ id: 1 }, { id: 2 }],
      });

      const result = await teamsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/teams");
      expect(opts.qs.per).toBe(10);
      expect(result).toHaveLength(2);
    });

    it("each result has expected fields", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 50,
        },
        httpResponse: [{ id: 1, name: "Sales", broker_ids: [1, 2] }],
      });

      const result = await teamsGetAll.call(mock);

      expect(result[0].json.name).toBe("Sales");
      expect(result[0].json.broker_ids).toEqual([1, 2]);
    });
  });
});
