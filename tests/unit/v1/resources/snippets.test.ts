import { snippetsGetAll } from "../../../../nodes/Propstack/v1/resources/snippets/getAll";
import { createMockExecuteFunctions, getHttpRequestOptions } from "../testHelpers";

describe("snippets", () => {
  describe("getAll", () => {
    it("sends GET to /v1/snippets", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: true,
          simplify: false,
        },
        httpResponse: [
          { id: 1, name: "Leere E-Mail", body: "<p>HTML</p>", subject: "Test" },
          { id: 2, name: "Follow up", body: "<p>More</p>", subject: "FU" },
        ],
      });

      const result = await snippetsGetAll.call(mock);

      const opts = getHttpRequestOptions(mock);
      expect(opts.method).toBe("GET");
      expect(opts.url).toBe("/v1/snippets");
      expect(result).toHaveLength(2);
      expect(result[0].json.body).toBe("<p>HTML</p>");
    });

    it("simplifies response by removing body", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: true,
          simplify: true,
        },
        httpResponse: [
          {
            id: 1,
            name: "Leere E-Mail",
            body: "<p>long HTML</p>",
            subject: "Test",
            snippet_category_id: 100,
            message_category_id: null,
            message_template_id: null,
          },
        ],
      });

      const result = await snippetsGetAll.call(mock);

      expect(result).toHaveLength(1);
      expect(result[0].json.id).toBe(1);
      expect(result[0].json.name).toBe("Leere E-Mail");
      expect(result[0].json.subject).toBe("Test");
      expect(result[0].json).not.toHaveProperty("body");
    });

    it("respects limit when returnAll is false", async () => {
      const mock = createMockExecuteFunctions({
        nodeParameters: {
          returnAll: false,
          limit: 1,
          simplify: false,
        },
        httpResponse: [
          { id: 1, name: "A" },
          { id: 2, name: "B" },
          { id: 3, name: "C" },
        ],
      });

      const result = await snippetsGetAll.call(mock);

      expect(result).toHaveLength(1);
    });
  });
});
