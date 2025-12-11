import { activitiesScroll } from "../../../../nodes/Propstack/v2/resources/activities/scroll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("activities", () => {
  describe("scroll", () => {
    it("sends GET to /v2/activities/scroll with filters", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          filters: {
            only_inquiries: true,
            updated_at_from: "2024-01-01",
          },
        },
        httpResponse: [],
      });

      await activitiesScroll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v2/activities/scroll");
      expect(opts.qs.only_inquiries).toBe(true);
      expect(opts.qs.updated_at_from).toBe("2024-01-01");
    });
  });
});
