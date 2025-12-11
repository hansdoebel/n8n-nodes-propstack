import { historyGet } from "../../../../nodes/Propstack/v2/resources/history/get";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("history", () => {
  describe("get", () => {
    it("sends GET to /v2/history/messages/{entityId}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          historyType: "messages",
          entityId: "100",
          returnAll: false,
          limit: 20,
        },
        httpResponse: [{ id: 1 }],
      });

      await historyGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toContain("/v2/history/messages/100");
      expect(opts.qs.per).toBe(20);
    });

    it("sends GET to /v2/history/deals/{entityId}", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          historyType: "deals",
          entityId: "200",
          returnAll: false,
          limit: 50,
        },
        httpResponse: [{ id: 1 }],
      });

      await historyGet.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toContain("/v2/history/deals/200");
    });
  });
});
